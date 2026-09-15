# Web design-reference images

Use this branch for website sections and responsive website comps. The default desktop deliverable is horizontal section imagery a developer can read, not a coded page, tall full-page screenshot, or generic moodboard. For an explicitly requested phone-width website comp, use the requested viewport and orientation rather than forcing it into a horizontal canvas.

## Establish the page sequence

List the requested sections and give each a job in the page narrative. Preserve the user's section count and content. When no count is supplied, infer only the sections needed to express the stated page—not a fixed six- or eight-section pack—and name the interpreted set before generation.

Build a truthful progression around the user's goal. A marketing page often moves from orientation to explanation or evidence to action, but the brief may require documentation, editorial storytelling, comparison, commerce, or a single campaign moment. Do not invent pricing, statistics, customer logos, testimonials, integrations, endorsements, or unnecessary sections to fill a funnel.

## Primary and detail contract

Generate exactly one separately inspectable **primary image per requested or explicitly inferred section**. Use horizontal framing for desktop sections and the requested orientation for responsive comps. A three-section brief has three primary images. Each primary shows one complete section at a readable scale; never combine the entire page into a tall image or replace several sections with a contact sheet.

A close-up needed to clarify typography, a component, a crop, or a state may be generated as an optional **detail frame**. Label it `Detail — <section>: <subject>` and keep it outside the primary section count. A detail frame supplements rather than replaces its primary. Cropping a low-resolution primary is not a faithful detail; make a dedicated generation when readability requires it.

Use a documented ratio supported by the active image tool and appropriate to the requested viewport. Record the intended browser viewport or section width in the handoff. If an exact requested ratio is unavailable, disclose the supported ratio used.

## Vary composition with purpose

Keep one brand and design system while giving sections distinct visual roles. Choose among centered statements, full-bleed image canvases, editorial offsets, asymmetric grids, reversed splits, product-led frames, modular evidence, and quiet action bands according to content. A left-copy/right-image split is valid when it communicates best; it is not a default to repeat down the page.

Across multiple sections:

- vary focal placement, scale, density, and image treatment enough to pace the scroll;
- preserve grid logic, spacing rhythm, palette roles, typography, actions, and image grade;
- keep the main action unmistakable and secondary actions visibly subordinate;
- use full-bleed imagery, solid fields, texture, gradients, or restrained whitespace only when the brief benefits;
- reserve one or two memorable motifs for brand recall rather than decorating every section;
- make dense evidence and quiet transition sections visibly different.

The sequence should feel varied but buildable. Avoid repeated floating-card collages, illegible browser chrome, or visual effects that imply impossible layout behavior.

## Make each frame implementation-readable

Show enough of the section boundary, columns, alignment, spacing, type hierarchy, action priority, media crop, and relevant component states to guide implementation. Keep headlines and labels short. Product UI shown inside a section is illustrative unless it comes from supplied assets; do not fabricate dense dashboard detail and present it as real behavior.

For responsive-website requests, use website navigation and content patterns at the requested viewport. A phone-width responsive site remains a website: do not add native tab bars, system sheets, device conventions, or app-flow claims.

## Inspect and hand off

Inspect every primary and detail frame. Confirm the number of primary images equals the declared section count; details are labeled and excluded from that count. Check framing against the requested viewport, readable scale, section completeness, composition variety, cross-section consistency, text, and supplied assets. Regenerate any missing or collapsed primary.

For each file, hand off: `Section X of N — <role>` or `Detail — <section>: <subject>`, primary/detail scope, intended viewport, approved versus proposed elements, known copy/assets/tokens, and behavior the pixels do not define.