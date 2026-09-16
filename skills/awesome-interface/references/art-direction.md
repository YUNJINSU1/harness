# Art direction for a new interface

Use when creation needs a coherent visual direction, not for a copy fix or an unsolicited redesign. Domain rules remain in [layout](layout.md), [writing](writing.md), [typography](typography.md), [colors](colors.md), [accessibility](accessibility.md), and [UI polish](ui.md); load only those affected.

## Read the brief before choosing a look

Extract the product, audience, primary task, content, brand assets, delivery surface, and constraints from the request and repository. A reference may contribute hierarchy, density, rhythm, or material character without authorizing a copy of its identity. Distinguish approved assets and facts from proposed content. Never invent customers, testimonials, metrics, certifications, prices, or dates to make a page look credible.

Identify the dominant job: explain an unfamiliar product, compare choices, complete an operation, read long-form content, or monitor dense information. A dashboard needs legible data and efficient operations, not a marketing-page hero. Native app conventions and platform navigation are not interchangeable with a responsive website.

Resolve reversible visual choices from existing evidence. Ask only for a missing requirement that materially changes the work; otherwise state a conservative assumption and proceed. Do not demand a branding questionnaire for a bounded screen.

## Choose one content-led direction

Describe the direction briefly in the working response: hierarchy, typographic character, density, palette roles, imagery, and motion purpose. No standalone strategy document or DESIGN.md is required unless requested.

Use three qualitative controls to make tradeoffs explicit:

- **Expressiveness:** where a distinctive composition helps the product communicate, versus where conventional controls reduce friction.
- **Density:** how much information the task needs visible together, including expert scanning and comparison.
- **Motion:** what transition communicates a state or spatial relationship, and what can remain still.

These are reasoning aids, not numeric configuration or fixed presets. Quiet, familiar, compact UI can be the right design. Existing brand fonts, purple palettes, centered heroes, cards, gradients, and borders are neither universally wrong nor mandatory. Choose a treatment because it serves this content and audience; do not enforce an upstream style blacklist.

## Compose with real content

1. Put the primary task and its evidence first. Build the information hierarchy before decorative detail.
2. For a content-led page, assign each section a distinct purpose: proposition, demonstration, evidence, comparison, or next action. Use only sections the brief supports; do not fill a default section count.
3. Vary composition when content warrants it. Comparison may need a table; a workflow may need ordered steps; proof may need a real product view. Do not pour every section into identical cards or create arbitrary asymmetry.
4. Establish a small reusable system of spacing, type roles, semantic color roles, and component treatments using the project's mechanisms. A unique hero does not justify unrelated styling systems below it.
5. Use existing or authorized imagery only when it explains the product. CSS or text may be sufficient. Image generation is optional, not a gate before implementation.
6. Implement the supported widths, long copy, localization, and relevant empty/loading/error states rather than only the ideal desktop composition.

Do not force a framework, component library, font provider, icon package, or animation dependency. Confirm installed capabilities before adding code or packages. Preserve semantic controls and readable content; an image mockup is not the final accessible interface.

## Verify the direction in use

Run the actual surface and inspect both the composition and the primary task. Check whether real copy wraps, repeated items align, imagery crops without hiding meaning, and the narrow layout retains the intended reading order. Follow the main skill's accessibility and runtime verification boundary. Report observed results separately from aesthetic judgments; a distinctive screenshot alone does not prove usability.

Adapted selectively from Leonxlnx/taste-skill; see `../LICENSE.taste-skill` and the repository's adopted-skills provenance record.
