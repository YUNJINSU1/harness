#!/usr/bin/env bash
# Toggle one right-hand sidebar holding both plugin panes: the Sheep pasture on
# top, the Agent Usage limits panel below it.
#
# Open  -> split right in the focused workspace, unfocused, resized to WIDTH,
#          then split that column down for the limits panel.
# Open again while either pane exists anywhere -> close both. One sidebar by
# design: two half-open states (pasture without meters, or the reverse) would
# each need their own repair path.
#
# herdr cannot set a split size at creation (`herdr plugin pane open` has no
# --width/--height; the socket API's width/height apply to popup placement
# only), so a pane starts at ratio 0.5 and is converged onto a target size with
# `herdr pane resize`, whose --amount is a delta on the split ratio.
set -euo pipefail

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

pane_with_label() {
  "$HERDR" pane list |
    jq -r --arg l "$1" '[.result.panes[] | select(.label == $l) | .pane_id][0] // ""'
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

usage_pane="$(pane_with_label "$USAGE_LABEL")"
sheep_pane="$(pane_with_label "$SHEEP_LABEL")"

if [[ -n "$usage_pane" || -n "$sheep_pane" ]]; then
  [[ -n "$usage_pane" ]] && "$HERDR" plugin pane close "$usage_pane" >/dev/null
  [[ -n "$sheep_pane" ]] && "$HERDR" plugin pane close "$sheep_pane" >/dev/null
  exit 0
fi

# The pasture opens first so it owns the top of the column: the limits panel is
# then split off its bottom edge.
sheep_pane="$("$HERDR" plugin pane open \
  --plugin huketo.sheep \
  --entrypoint pasture \
  --placement split \
  --direction right \
  --no-focus |
  jq -r '.result.plugin_pane.pane.pane_id // ""')"

[[ -n "$sheep_pane" ]] || exit 1

converge "$sheep_pane" width "$WIDTH" left right

usage_pane="$("$HERDR" plugin pane open \
  --plugin usagebar \
  --entrypoint limits \
  --placement split \
  --target-pane "$sheep_pane" \
  --direction down \
  --no-focus |
  jq -r '.result.plugin_pane.pane.pane_id // ""')"

[[ -n "$usage_pane" ]] || exit 1

converge "$sheep_pane" height "$SHEEP_HEIGHT" down up
