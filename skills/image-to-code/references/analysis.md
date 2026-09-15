# Reference-image analysis

Use this expanded pass only when a multi-section set, separate detail images, or ambiguity makes the compact analysis in `SKILL.md` insufficient.

## Establish the reference map

List each image once with its path, dimensions or stated viewport, full-composition or detail role, source, approval state, and the section it governs. Identify overlaps and conflicts. A detail reference may clarify its named section without silently replacing the selected full composition.

For every observation, label its evidence class:

- **visible** — directly legible or measurable in the image;
- **repository-backed** — confirmed by source, assets, tokens, content, or specification;
- **inferred/proposed** — a plausible implementation choice still needing confirmation.

Treat unreadable text, cropped areas, off-canvas content, hover behavior, motion, and hidden states as unknown. A visual resemblance is not proof of a specific font, CSS technique, interaction, route, or data value.

## Analyze the whole composition

Capture:

1. page and section order, primary task, and reading path;
2. major grid lines, content bounds, gutters, bleeds, and alignment anchors;
3. relative section heights, density changes, whitespace, and repeated rhythm;
4. type-role hierarchy and line-count relationships, without guessing a family name;
5. color roles, image treatment, surface depth, borders, radii, and recurring motifs;
6. elements that imply adaptation at narrower or wider widths.

Describe ratios and relationships before fixed pixel values. Use exact image dimensions only for the viewport they represent.

## Analyze each section

At readable scale, record:

- semantic region and intended visual priority;
- exact legible text and whether repository content corroborates it;
- columns, alignment, spacing, wrapping, and media crop;
- control appearance and only the states actually shown;
- asset candidates already present in the repository;
- ambiguous details that affect implementation.

For repeated components, identify both the invariant structure and meaningful variants. Keep distinct sections distinct; shared code should not erase composition differences visible in the selected references.

## Resolve the unknowns

Use this order:

1. explicit user selection or approval;
2. repository-backed brand, content, behavior, and platform constraints;
3. the selected full-composition reference;
4. its named detail reference;
5. the smallest faithful, accessible implementation proposal.

Request imagegen only when the unresolved fact is genuinely visual and blocks the requested image-dependent scope. Ask the user only for facts that neither images nor repository evidence can establish and that cannot safely remain an explicit implementation choice.

Finish with a section-to-code map and an unknowns list. The analysis is complete when every requested section has an owning reference, repository sources for factual behavior/content, and an explicit disposition for each ambiguity.
