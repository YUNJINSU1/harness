# Logo concepts

Use this branch for standalone logo candidates and lockup variants. A lockup is the arrangement of a mark and its lettering. The shared imagegen workflow owns tool discovery, generation, inspection/refinement, and delivery; this reference supplies logo-specific decisions. Brand-system and application boards belong to [Brand kit](brandkit.md).

## Establish the identity brief

Resolve the exact name, spelling, case, language/script, and any supplied tagline before generating lettering. An absent brand name is a missing input, not permission to invent one; a symbol-only request may proceed without a name. Resolve category, audience, intended personality, one core metaphor, usage surfaces, smallest intended display size, and whether the task creates a new identity or preserves an owned one.

For owned marks, identify precisely what may change: lettering, symbol, palette, or only arrangement. Treat the remaining geometry, proportions, copy, and clear space as source constraints. Use supplied assets through documented input-image support and compare the output to them; a generated approximation is not exact preservation. Existing font samples communicate direction unless the actual font and its use are independently established.

## Separate type, arrangement, and style

| Requested type | Design focus | Inspect |
| --- | --- | --- |
| Wordmark | The exact brand name is the mark; letterform character, spacing, and rhythm carry the identity. Use initials only when requested. | Every glyph, case, diacritic, counter, spacing pair, and reading order; no unrequested symbol or mascot. |
| Symbol | One pictorial or abstract metaphor expressed through a distinctive silhouette and negative space. | Recognition without explanatory text, fragile gaps, accidental secondary shapes, and loss at the intended small size. |
| Mascot | A character whose silhouette and expression express the product's personality. Select a subject for a product reason. | Recognizable identity rather than illustrative detail; stable defining features and expression across related variants. |
| Combination mark | A symbol or mascot paired with a wordmark in a deliberate horizontal or stacked lockup. | Fidelity of both parts, optical scale, spacing, alignment, and whether separately requested components still work alone. |
| Emblem | Lettering and imagery integrated into a containing shape rather than merely placed side by side. | Internal density, border weight, lettering legibility, and whether enclosure or decoration obscures the name. |

These labels are not mutually exclusive: a mascot can accompany a wordmark or sit inside an emblem. Record the identity carrier (lettering, symbol, character), arrangement (standalone, horizontal, stacked, enclosed), and visual style separately. Geometric, monoline, heritage, organic, and rounded treatments are directions, not universal rules. Preserve an established style unless redesign is authorized.

Read [Rounded IP](logo/rounded-ip.md) only when a very simple, cute, rounded character direction is selected. Mascot alone does not select that preset; neither the preset's palette nor its corner-emergence composition applies to other logo types.

## Define the candidate set

Honor the requested count, types, and level of exploration. For a bounded direction with no count, state a one-primary-image interpretation before generation. For an exploratory request, propose a small set of genuinely distinct, product-linked directions and name what each changes. Do not turn a specified one-image request into a fixed six-candidate batch or an extra approval round.

Distinguish independent concept candidates from variants of one identity. Independent candidates may change the metaphor or lettering; variants retain the selected identity and change only named dimensions such as arrangement or color treatment. An unselected candidate is proposed, not approved. When proceeding to a board without a user selection is authorized, label the chosen direction provisional and reuse it consistently.

Each primary is a separate inspectable image. Ordinarily show the complete logo with clear surrounding space on a simple contrasting background, choosing orientation for the mark's proportions and intended surface. An explicitly selected character-image preset may instead own the primary's framing: Rounded IP uses a dominant lower-corner character on a full-bleed square. Do not overwrite that visual contract with a centered, full-body, wide-margin logo template. Application mockups and comparison sheets remain supplementary, not replacements for the requested primary. Include only requested variants and justified inspection views.

## Describe the mark to the generator

Build the prompt from the exact copy, product-linked metaphor, type, arrangement, visual style, intended size, source assets, palette roles, and framing. For lettering, use the tool's documented text field when available and request sharp, legible, correctly spelled text. Keep lettering short; omit unsupplied slogans, establishment dates, awards, and registration symbols.

Explain whether an input image preserves a symbol, lettering, or the whole identity. Across related outputs, reuse the selected source through supported image inputs rather than independently reinventing it. Keep primary images free of presentation effects that obscure the outline, lettering, or spacing. Specify actual file formats, dimensions, or background capabilities only when the tool supports them; a white background is not proof of alpha transparency.

## Inspect the logo as a logo

In addition to the shared checks, open every primary at full size and at a stated intended application size. For a compact symbol or mascot, a 32 × 32 preview can expose lost features; evaluate wordmarks at their actual intended width rather than forcing every logo into that square.

- Check exact lettering, including non-Latin characters and diacritics, against the brief. Uncertain text remains unverified, not approved.
- Check the outline, counters, negative space, thin strokes, and framing against the selected type or preset. Distinguish intentional character cropping from accidental clipping of identifying features. For combination marks, inspect each part, clear space, and their relationship.
- Compare variants against the selected mark, lettering, and supplied assets. Distinguish intentional variation from identity drift.
- If a file contains alpha, inspect it composited on a contrasting surface rather than interpreting invisible RGB values as artwork. Keep the original and label any background-composited viewing copy; disclose a returned background or dimension that differs from the request. An opaque-background requirement is not satisfied by silently flattening a transparent result.
- Inspect figure/background separation. When one-color use is required, inspect a genuine one-color variant or a clearly labeled diagnostic derived from the actual image. A grayscale preview alone does not establish single-ink reproduction. Keep diagnostic resizing or masks separate from untouched generated primaries; do not use them to conceal defects.
- Treat illegible text, broken silhouettes, and unauthorized asset changes as defects under the shared refinement rule. A stylistic preference alone is not a defect, and visual inspection is not user approval.

Report the type/arrangement/style, independent-candidate or related-variant relationship, exact known copy and assets, actual image dimensions, application sizes inspected, and any preservation or readability limit. Generated raster concepts do not supply editable vector masters, exact font outlines or licenses, trademark clearance, production color specifications, or print-ready artwork. Those require a separately authorized production phase, not extraction claims about generated pixels.
