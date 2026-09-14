#!/usr/bin/env bash
# Manage one right-hand sidebar holding both plugin panes: the Sheep pasture on
# top, the Agent Usage limits panel below it.
#
# Modes:
#   (default)   toggle  -> open when neither pane exists, close both otherwise
#   --rebuild   rebuild -> close whatever is there, then open a fresh pair
#
# rebuild exists because a pane outlives the plugin process that drew it: when
# herdr-sheep or usagebar exits, herdr keeps the pane as a bare shell that still
# carries the plugin's label. Toggle then reads that corpse as "open" and only
# closes it, so recovering a dead sidebar takes two presses and looks broken.
# rebuild is the single-press repair and the one an agent should invoke.
#
# Open  -> split right in the focused workspace, unfocused, resized to WIDTH,
#          then split that column down for the limits panel.
# One sidebar by design: two half-open states (pasture without meters, or the
# reverse) would each need their own repair path.
#
# herdr cannot set a split size at creation (`herdr plugin pane open` has no
# --width/--height; the socket API's width/height apply to popup placement
# only), so a pane starts at ratio 0.5 and is converged onto a target size with
# `herdr pane resize`, whose --amount is a delta on the split ratio.
set -euo pipefail

MODE=toggle
case "${1:-}" in
  --rebuild | -r) MODE=rebuild ;;
  --toggle | "") ;;
  *)
    echo "usage: ${0##*/} [--toggle|--rebuild]" >&2
    exit 2
    ;;
esac
# One run at a time. A keybinding fires per keypress with no debounce, and a
# run spends seconds in `pane open` and `converge`; overlapping runs each see a
# sidebar that is not there yet and open their own, which is how a held key
# buries the workspace under duplicate pastures. A press arriving mid-run is
# dropped rather than queued: the in-flight run already produces the state it
# was asking for.
LOCK_FILE="${TMPDIR:-/tmp}/herdr-sidebar-$(id -u).lock"
exec 9>"$LOCK_FILE"
flock -n 9 || exit 0

# A `type = "shell"` keybinding runs detached, so PATH is not guaranteed to
# carry the install dir.
HERDR="${HERDR_BIN_PATH:-}"
if [[ -z "$HERDR" ]]; then
  HERDR="$(command -v herdr || true)"
fi
if [[ -z "$HERDR" ]]; then
  HERDR="$HOME/.local/bin/herdr"
fi

# herdr-plugin.toml names the panes; PaneInfo carries no plugin id, so the
# label is the only in-band detector.
USAGE_LABEL="Agent Usage"
SHEEP_LABEL="Sheep pasture"
# 54+ columns keeps full-width bars and the "resets in" hints; below 32 the
# panel collapses to one line per provider.
WIDTH="${SIDEBAR_WIDTH:-${USAGEBAR_PANE_WIDTH:-64}}"
# The pasture is scenery: it only needs enough rows to graze in. Every row left
# over goes to the limits panel, which drops its account/note lines once it
# runs short.
SHEEP_HEIGHT="${SIDEBAR_SHEEP_HEIGHT:-14}"

# Every pane carrying the label, not just the first. A key that opens faster
# than herdr tears panes down leaves a column of duplicates behind, and a
# closer that only ever sees index 0 can never drain them.
panes_with_label() {
  "$HERDR" pane list |
    jq -r --arg l "$1" '.result.panes[] | select(.label == $l) | .pane_id'
}

# A pane outlives the plugin-pane registry entry that spawned it: once the
# plugin process exits, `plugin pane close` answers plugin_pane_not_found while
# the labelled shell stays on screen. `pane close` is the fallback that removes
# it, so both are tried before a pane is declared unclosable.
close_pane() {
  "$HERDR" plugin pane close "$1" >/dev/null 2>&1 && return 0
  "$HERDR" pane close "$1" >/dev/null 2>&1
}

# converge resizes pane toward target along axis, since only a ratio delta is
# available.
#
# Each pass reads its measurement from the resize reply rather than from a
# fresh `pane layout`: a follow-up query can still return the pre-resize
# layout, and a delta computed from a stale height stalls the loop short of
# the target. Six passes is well past what one split needs, and a pass that
# moves nothing ends it.
converge() {
  local pane="$1" axis="$2" target="$3" grow="$4" shrink="$5"
  local current area delta direction amount previous

  read -r current area < <("$HERDR" pane layout --pane "$pane" |
    jq -r --arg p "$pane" --arg a "$axis" '.result.layout
      | [(.panes[] | select(.pane_id == $p) | .rect[$a]), .area[$a]]
      | @tsv')

  for _ in 1 2 3 4 5 6; do
    [[ -n "${current:-}" && -n "${area:-}" && "$area" -gt 0 ]] || return 0

    delta=$((current - target))
    [[ "${delta#-}" -le 1 ]] && return 0

    direction="$shrink"
    [[ "$delta" -lt 0 ]] && direction="$grow"
    amount="$(awk -v d="$delta" -v a="$area" 'BEGIN { printf "%.6f", (d < 0 ? -d : d) / a }')"

    previous="$current"
    read -r current area < <("$HERDR" pane resize --pane "$pane" --direction "$direction" --amount "$amount" |
      jq -r --arg p "$pane" --arg a "$axis" '.result.resize.layout
        | [(.panes[] | select(.pane_id == $p) | .rect[$a]), .area[$a]]
        | @tsv')

    [[ "${current:-}" == "$previous" ]] && return 0
  done
}

close_sidebar() {
  local pane found=1

  for pane in $(panes_with_label "$USAGE_LABEL") $(panes_with_label "$SHEEP_LABEL"); do
    close_pane "$pane"
    found=0
  done

  return "$found"
}

open_sidebar() {
  local sheep_pane usage_pane

  # The pasture opens first so it owns the top of the column: the limits panel
  # is then split off its bottom edge.
  sheep_pane="$("$HERDR" plugin pane open \
    --plugin huketo.sheep \
    --entrypoint pasture \
    --placement split \
    --direction right \
    --no-focus |
    jq -r '.result.plugin_pane.pane.pane_id // ""')"

  [[ -n "$sheep_pane" ]] || return 1

  converge "$sheep_pane" width "$WIDTH" left right

  usage_pane="$("$HERDR" plugin pane open \
    --plugin usagebar \
    --entrypoint limits \
    --placement split \
    --target-pane "$sheep_pane" \
    --direction down \
    --no-focus |
    jq -r '.result.plugin_pane.pane.pane_id // ""')"

  [[ -n "$usage_pane" ]] || return 1

  converge "$sheep_pane" height "$SHEEP_HEIGHT" down up
}

if [[ "$MODE" == rebuild ]]; then
  # A closed pane's teardown is asynchronous; reopening before the layout
  # settles splits against the pane that is on its way out.
  close_sidebar && sleep 0.3
  open_sidebar
  exit
fi

close_sidebar && exit 0
open_sidebar
