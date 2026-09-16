---
name: image-to-code
description: "Implement web interfaces from supplied, selected, or generated reference images. Use when turning a screenshot, mockup, or imagegen handoff into website or frontend code. Not for native-mobile implementation, image generation alone, or general UI work without a reference image."
license: MIT
---

# Image to code

Translate selected visual references into a working web interface without inventing the product behind the pixels. A usable supplied reference starts the workflow; fresh image generation is optional and belongs to `imagegen`.

## 1. Establish scope and evidence

Confirm the requested web surface, implementation authority, and target viewport or platform. This skill implements websites and web applications in the repository's existing stack. For a native iOS, Android, Flutter, or other native-app request, state that this workflow does not promise native implementation and do not edit toward a web substitute unless the user asks for one.

Inspect the repository before interpreting the images:

- framework, routes, build and preview mechanisms;
- reusable components, native-control conventions, styling system, tokens, fonts, breakpoints, and state patterns;
- real product copy, actions, data contracts, brand guidance, and usable assets.

Inventory every candidate reference with its repo-relative or supplied path, source, full-composition or detail scope, target width/platform, approval status, and known reuse permission or license. Keep the user's selected reference primary. Do not silently replace it with a more convenient image or visual direction. If copying a particular asset has unresolved rights, isolate that asset as the blocker; inspection and independently implementable work may continue.

Classify evidence before planning:

- **Visible:** legible text, relative geometry, hierarchy, colors, imagery, and states actually shown.
- **Repository-backed:** exact fonts, tokens, brand facts, routes, interactions, product claims, data, and supported states found in source or specifications.
- **Inferred or proposed:** font guesses, hidden behavior, breakpoints, hover/focus behavior, data, and content not established by the first two classes.

Never promote an inference to a product fact. Generated pixels are visual proposals, not evidence for functionality, customer quotes, metrics, integrations, security claims, or brand history. Use generated text as product copy only after it is explicitly approved or corroborated by the repository.

## 2. Reuse references before generating

Use supplied, previously generated, or explicitly selected references when they are readable enough for the requested scope. Image regeneration is not a quality ritual and is not required merely because a generator exists.

Request a new or revised reference only when an image-dependent part has no usable visual source or the chosen reference cannot expose a necessary composition or detail. In that case, read and follow [`../imagegen/SKILL.md`](../imagegen/SKILL.md) for the generation stage. Pass it the known brand/product constraints and the exact missing full-composition or detail scope. Accept its short handoff from the response or an existing brief; do not require a new manifest or orchestration layer.

If generation tooling is unavailable, name the exact image-dependent scope that remains blocked and the missing capability. Continue analysis and implementation supported by existing references and repository evidence. Do not describe the entire coding task as blocked when only a missing image or detail depends on generation.

Once an imagegen handoff supplies usable references, the generation stage is complete. Image-only output constraints end there: this skill resumes repository inspection, implementation, runtime exercise, and code-phase reporting rather than regenerating images or stopping at analysis.

## 3. Analyze composition and details

Analyze the selected set as one composition first: reading order, section sequence, content density, repeated alignments, spacing rhythm, color and type hierarchy, imagery treatment, and responsive implications. Then inspect each section at readable scale for its internal grid, text, controls, assets, surfaces, and shown state.

For a complex multi-section set, mixed full-page/detail images, or material ambiguity, use [`references/analysis.md`](references/analysis.md). A single clear component screenshot usually needs only the compact pass above.

Record conflicts between images instead of averaging them away. Resolve them by explicit selection, repository facts, and then the smallest faithful proposal. Preserve intentional brand character, density, typography, radius, and composition. Treat aesthetic preferences as alternatives, not defects.

## 4. Map evidence to an implementation plan

For each section or component, map:

1. selected reference and target width;
2. visible structure and content;
3. existing component, token, asset, route, and state source to reuse;
4. known interactions and applicable empty, loading, error, disabled, selected, and responsive states;
5. unresolved visual or behavioral facts.

Use the repository as the authority for behavior and factual content and the selected image as the authority for approved visual direction. When they conflict, preserve working product behavior and report the visible difference unless the user explicitly authorizes changing the contract. Do not fabricate a dropdown, carousel, form submission, route, metric, testimonial, or data source because an image implies one.

Load only the Awesome Interface references implicated by the work:

- [`layout`](../awesome-interface/references/layout.md) for hierarchy, responsive arrangement, source order, or state layout;
- [`typography`](../awesome-interface/references/typography.md) for font evidence, scale, wrapping, or truncation;
- [`colors`](../awesome-interface/references/colors.md) for tokens, themes, gamut, or measured contrast;
- [`accessibility`](../awesome-interface/references/accessibility.md) for semantics, controls, focus, keyboard, forms, or reduced motion;
- [`ui`](../awesome-interface/references/ui.md) for surfaces, icons, imagery, polish, or motion;
- [`writing`](../awesome-interface/references/writing.md) for labels, product terminology, or state copy.

These are focused implementation references, not a mandatory full-interface audit.

## 5. Implement the web surface

Build with the existing framework, routing, components, tokens, and real assets. Prefer semantic HTML and native links, buttons, inputs, and disclosures; use established accessible primitives for richer widgets. Keep meaningful text in the DOM and give images purpose-appropriate alternatives. Do not flatten the reference into a screenshot background or recreate controls as inert pixels.

Translate the image's composition rather than its fixed canvas: preserve hierarchy, relationships, and distinctive motifs while allowing content to reflow at supported widths. Implement applicable interaction and content states from repository contracts. Add motion only when requested, visibly evidenced, or established by the product, with a usable reduced-motion result.

Make the smallest coherent set of changes that covers the requested surface. A faithful result preserves selected source and brand/product facts; it does not force a new theme, font stack, token system, asset pipeline, `DESIGN.md`, or fictional content.

## 6. Exercise the running interface

Run the repository's actual preview or application and compare the implementation with every selected reference at its stated target width. Inspect the full composition and the relevant section details, then check the repository's supported narrow and wide boundaries and points around structural changes.

Exercise real controls through the applicable path. Use the keyboard when interactive controls are involved; inspect focus, names, order, and state. Exercise reduced motion when the implementation contains or changes motion. Check applicable populated, empty, loading, error, disabled, and selected states that repository behavior supports. A screenshot comparison does not prove behavior, and source inspection does not prove rendered fidelity.

When a runtime, browser, font, device, generator, or state cannot be exercised, complete reachable checks and name that specific verification limit. Never invent measurements, visual results, or passing interactions.

## 7. Deliver the handoff

Report:

- exact implemented scope and changed locations;
- selected reference paths, source/approval status, and target widths;
- what was preserved from the references and existing product;
- deliberate differences, with repository or accessibility reasons;
- exact runtime scenarios exercised and observed results;
- unverified platforms, states, assets, rights, fonts, or behaviors.

Separate implemented behavior from proposed follow-up. Do not claim native-app support, generation success, pixel fidelity, accessibility conformance, or complete state coverage beyond what was actually exercised.
