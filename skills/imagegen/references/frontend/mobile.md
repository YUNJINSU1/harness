# Mobile design-reference images

Use this branch for native-app screens and flows on iOS, Android, or a deliberate cross-platform system. A responsive website at phone width belongs to the web branch.

## Resolve platform and flow

Select one platform mode from the brief and project evidence:

- **iOS:** iOS navigation hierarchy, safe areas, bars, sheets, controls, and gesture regions;
- **Android:** Android app bars, navigation, sheets, back behavior cues, component rhythm, and system insets;
- **Cross-platform:** one coherent neutral product language with safe areas and broadly implementable mobile navigation, without casually mixing platform-specific controls.

State whether the output is native-app or responsive-web before generation. Preserve an existing application's framework and conventions. Do not dress a stacked website layout with a phone frame and call it native.

Map requested screens in flow order and identify the action or state transition between them. Generate the number of screens explicitly requested. When the request names a flow without a count, infer the minimum complete sequence from the product goal and state it; do not add filler screens. Screen sets must form a believable progression rather than a collection of unrelated showcase pages.

## Compose for the device

Respect top and bottom safe areas, system bars where represented, navigation placement, keyboard or sheet space where relevant, and thumb-reachable primary actions. Keep the first screen immediately legible with one dominant focus. Design for the named device/viewport rather than squeezing desktop density into a portrait frame.

A visible device frame is presentation, not the product. Use it when requested or when it helps communicate platform and scale; keep device family, bezel, scale, shadow, margins, and gutters consistent. For implementation reference or raw-screen delivery, borderless screen images may be clearer. Never let a frame crop content or dominate the UI.

Across a flow, preserve:

- palette, type hierarchy, spacing, radius, surface, and icon family;
- safe-area and navigation model;
- recurring component geometry and states;
- image/illustration treatment and device presentation;
- carried-forward content and selected state.

Vary screen composition according to purpose: onboarding, browse, detail, creation, confirmation, and settings should not be one template with swapped labels. Keep the set unified rather than random.

## Primary screens and details

Each requested screen must remain readable. Prefer separately generated screen images when a collage would make text or controls too small. If a flow overview is requested, it may accompany—not replace—the readable screens unless the user explicitly wants only a concept board.

Generate a separately labeled detail only when a sheet, keyboard state, component, or interaction state cannot be judged in the primary. A regenerated detail preserves the same product system and platform. Pixel imagery cannot establish real gestures, focus behavior, accessibility semantics, keyboard handling, or state transitions; name those unknowns in the handoff.

## Inspect and hand off

Open every screen at normal phone viewing size. Check:

1. native platform cues are coherent and responsive-web patterns have not leaked in;
2. safe areas, system insets, navigation, and primary actions remain visible;
3. text and controls are comfortably readable, not miniature decoration;
4. flow order and carried state are plausible without invented product claims;
5. recurring components, palette, assets, image treatment, and device frames stay consistent;
6. screen count matches the declared flow and any details are separately labeled.

Regenerate screens with clipped safe areas, mixed platforms, website-like structure, unreadable text, or design-system drift. Hand off each path with platform, device/viewport, screen role and order, transition intent, primary/detail scope, preserved versus proposed elements, and behavior still unknown.