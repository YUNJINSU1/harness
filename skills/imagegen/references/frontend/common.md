# Frontend image reference: common rules

Apply these rules to website and native-mobile reference images. The branch document owns platform- and format-specific decisions.

The shared UI rules live in Awesome Interface. Read only the implicated [layout](../../../awesome-interface/references/layout.md), [typography](../../../awesome-interface/references/typography.md), [colors](../../../awesome-interface/references/colors.md), [writing](../../../awesome-interface/references/writing.md), or [UI polish](../../../awesome-interface/references/ui.md) reference when that domain needs a decision. Use [accessibility](../../../awesome-interface/references/accessibility.md) for visual constraints and evidence limits; pixels cannot verify runtime accessibility. These are selective references, not a full review workflow.

## Compose from product meaning

Name each image's job before styling it: orient, explain, compare, prove, choose, complete, or recover. Build one dominant reading path around that job. Use hierarchy, grouping, alignment, whitespace, and contrast before decorative effects.

A reference should make these implementation-relevant decisions visible:

- primary, supporting, and tertiary information;
- content groups and their reading order;
- container, grid, alignment, spacing, and density relationships;
- type-scale relationships and reasonable line lengths;
- primary action and the relative weight of secondary actions;
- surface, border, radius, icon, image-crop, and state language;
- where content can grow, wrap, scroll, stack, or remain fixed.

Keep copy concise enough to remain readable in a generated image. Prefer a few meaningful labels over decorative microcopy. A sharp image with tiny or misspelled words is not an implementation reference; regenerate, simplify, or mark uncertain text in the handoff.

## Preserve before proposing

Inspect supplied screenshots, logos, icons, imagery, tokens, and product guidance. Separate:

- **preserved:** user-owned, supplied, or explicitly approved elements;
- **proposed:** composition, styling, copy, or imagery introduced for this concept;
- **unknown:** behavior, state, data, accessibility semantics, or assets not evidenced by the brief.

Use the project's visual language when one exists. Retain recognizable brand marks, palette roles, type character, component geometry, and tone unless change is requested. If the tool cannot carry an asset faithfully, report that constraint rather than presenting an approximate redraw as preserved.

## Lock a coherent system

For a multi-image set, establish a small internal design bible before generation:

- canvas/viewport family and outer framing;
- palette roles and contrast strategy;
- typography mood and scale relationships;
- spacing, radius, border, and elevation language;
- icon/illustration/photo treatment;
- component and action hierarchy;
- approved assets and short copy;
- one visual metaphor or material logic when the brief benefits from it.

Keep these stable across the set. Vary composition to match each image's job: change focal placement, image-to-text balance, scale, density, and surface rhythm without drifting into a different product. Repetition that supports recognition is consistency; repeated structure that ignores content is monotony.

## Readability and credibility

Protect text with clean space, tonal overlays, masks, or restrained surfaces when it sits on imagery. Do not use an image effect that erases scan order or makes controls look unavailable. Keep generated charts, metrics, testimonials, partner logos, prices, and status claims out unless supplied or clearly labeled synthetic. Do not infer working interactions, accessibility, or responsive behavior from pixels.

Use creative imagery, texture, gradients, strong color fields, asymmetric placement, or quiet minimalism when they serve the brief. No single aesthetic is mandatory. Avoid visual novelty that obscures controls, brand identity, or content.

## Inspect the set

Open every output and judge the actual pixels, not the prompt. Confirm:

1. the intended UI artifact fills the frame at a useful scale;
2. hierarchy and actions remain readable at normal viewing size;
3. copy is legible enough to hand off, with uncertain text called out;
4. supplied assets remain recognizable and were not silently altered;
5. repeated elements and palette roles remain consistent;
6. each composition differs for a content reason rather than random styling;
7. no invented evidence or behavior appears authoritative;
8. branch-specific image counts and labels are correct.

Regenerate visible failures before delivery. Report any remaining limitation with the affected artifact path.