# Rounded IP mascot preset

Use when the brief selects the IP-as-Logo look or an extremely simple, cute, rounded character image. This preset owns the character's visual treatment and primary framing; it is not a synonym for every mascot logo. [Logo](../logo.md) owns candidate counts and logo-specific checks; imagegen owns tool discovery, generation, inspection/refinement, and delivery.

## Character and complexity

Tie the character to a product attribute or emotional promise. Keep a supplied subject; otherwise choose an immediately understandable subject with a specific rationale rather than novelty alone.

Build one dominant continuous silhouette from roughly 4–7 large geometric shapes, retaining one defining feature. Favor a large head, compact baby-like proportions, soft cheeks, broad color masses, thick rounded contours, and a calm, endearing expression. Keep facial marks subordinate to the character mass. A pair of large ears may be the defining feature; preserve both when they carry recognition. Blunt necessary tips instead of adding fragile points.

Use two simple eyes and a small mouth only when it helps expression. Merge or remove texture, repeated anatomy, ornamental outlines, tiny highlights, and small accessories that do not carry identity. Inspect the resulting compact mark at 32 × 32; simplify features that disappear or turn into noise.

## Palette and finish

When no palette is supplied, propose two purposeful character color families plus one contrasting background color. Organize character colors into broad connected regions and reuse them for facial marks. These are semantic families, not a promise of exactly three RGB values in generated pixels. User-supplied color roles take precedence; do not assume every supplied color is reserved for backgrounds.

Keep the named background solid and uniform, filling every unoccupied part of the square. Unless the brief specifies otherwise, choose a gently muted but still chromatic background and clearly separated character colors. Use flat-first graphic masses with an extremely subtle, almost imperceptible neo-skeuomorphic sense of depth. This slight softness is part of the selected look, not a reason to replace the character with a flat outlined pictogram, a detailed 3D toy, or a neutral-background full-body illustration.

## Primary composition

Generate one full-bleed square character image with normal square outer corners. Keep the character upright, visually dominant, emerging from a deliberately assigned lower-left or lower-right corner and filling roughly 85–95% of the canvas. Let the head and simple body mass extend through the bottom or assigned side when that supports the composition; exact edge contact and a fixed crop are not required. Keep paired identifying features visible.

This is the preset's primary, not an optional avatar that requires a second centered full-body logo. Avoid center or bottom-center placement and broad surrounding margins unless the user explicitly changes the composition. If an isolated un-cropped mark is separately requested, label it as a derived variant and retain the preset primary. For multiple candidates, vary the assigned corner deliberately without imposing a fixed batch size.

## Character-image prompt

Describe the square character image itself rather than prepending generic logo, brand-mark, app-icon, or transparent-asset terminology. This preset-local prompt treatment preserves the visual target; it is not a rule for wordmarks or other logo types. Name the solid background directly and omit image-mode terms such as alpha or transparency from the generation prompt. Keep required lettering for a separately specified combination or emblem arrangement rather than adding it to the character-only primary.

```text
Create one complete full-bleed 1:1 square image.
Background: solid <named background>, filling every open area and corner not occupied by the character.
Subject: one extremely simplified, cute, endearing <subject>, reduced to one soft rounded continuous silhouette and one defining feature.
Complexity: roughly 4–7 large shapes, two broad character color families, two simple eyes and a tiny mouth only when useful; remove nonessential outlines, anatomy, texture and decoration.
Color: <character color one> and <character color two> in broad purposeful masses, reusing them for facial marks, clearly separated from <background>.
Composition: upright and emerging from the <lower-left or lower-right>, filling roughly 85–95% of the square. A large head and compact proportions dominate. Crop the bottom or assigned side naturally while keeping paired identifying features visible.
Style: large soft forms, thick rounded contours, ultra-clean graphic treatment and lovable baby-like appeal. Add an extremely, extremely subtle, almost imperceptible sense of depth through a barely-there neo-skeuomorphic treatment.
Finish: only the character on the full-canvas background, normal square outer corners; no text, watermark, frame, scenery, fragile lines, unnecessary details, photorealistic material or external cast shadow.
```

## Inspect fidelity to the selected look

Compare the actual output to supplied style references for character dominance, large-head proportions, lower-corner emergence, solid chromatic background, broad color organization, and flat-first subtle depth. A small centered full-body character on a plain neutral field does not satisfy this preset even if it is cute and readable. Preserve source images and report deviations; do not call a style-mismatched result validated merely because its file opens. Also inspect the complete square at 32 × 32 for silhouette and expression.

## Attribution and adaptation

Adapted from [s1dashu/ip-as-logo-skill](https://github.com/s1dashu/ip-as-logo-skill/tree/acb834c717bcd0a487c49732d08397ba280d690b), `SKILL.md`, under the [retained MIT notice](../../LICENSE.ip-as-logo). This local reference retains the rounded silhouette, complexity, color families, lower-corner primary composition, barely-there depth, and character-only prompt treatment. Fixed batch/approval, model allowlists, and one-pass uninspected delivery are replaced by the shared imagegen workflow. The upstream showcase assets are not distributed with this skill.
