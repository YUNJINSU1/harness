# Optional Stitch adapter

Read this only when the user explicitly requests Stitch-oriented output, a Stitch prompt/export, or interpretation of a Stitch-generated reference. Stitch is one consumer of the design-system artifact, not its prerequisite or source of runtime truth.

## Export to Stitch

Start from the completed design-system evidence ledger. Emit semantic visual descriptions that explain role and atmosphere, followed by only the exact values verified in a runtime owner or named Approved/Proposed decision. Preserve the artifact's terminology, brands, supported appearances, density, and platform constraints.

For each applicable area, provide:

- audience, task, atmosphere, and hierarchy;
- semantic color roles and verified values by appearance;
- typographic roles, verified family/stack, hierarchy, and required scripts;
- layout, spacing, containment, platform, and responsive intent;
- components and the static states Stitch should depict;
- asset references whose source and allowed use are known;
- known constraints and unresolved decisions.

Use descriptive language beside technical values. Do not add a house palette, preferred font list, theme, hero pattern, card treatment, motion recipe, or categorical aesthetic ban that the project did not supply or approve.

## Static screen versus runtime intent

Stitch output is a static composition unless the actual tool output proves otherwise. Keep two explicit blocks when runtime behavior matters:

```markdown
### Static composition
<What the generated screen should visibly depict.>

### Runtime intent
<Approved behavior for implementation, labeled Approved or Proposed and linked to its authority.>
```

Runtime intent may describe state changes, motion, responsive adaptation, keyboard or focus behavior, reduced-motion behavior, loading, and recovery. It does not claim the static screen implements them. Exact timings, breakpoints, tokens, accessibility behavior, and performance remain Unknown unless sourced.

## Import from Stitch or a supplied comp

Treat the output as a supplied UI reference. Record directly visible facts—arrangement, content, apparent hierarchy, and the depicted state—as visual evidence. Reconcile it with existing implementation owners before documenting it as current system behavior. Pixel sampling may support a proposed color approximation when the user asks for one, but it is not proof of the source token. Mark font identity, asset provenance, unshown states, responsiveness, motion, interaction, and compliance Unknown until another source establishes them.

## Authority and delivery

Creating text for Stitch does not authorize an MCP call, generation, upload, account access, or publication. Perform those actions only when separately requested and available; otherwise return the requested prompt/export at its requested path or in the response. State whether Stitch was invoked and which output, if any, was actually inspected.

Before delivery, trace every exact value back to the design artifact, keep Approved and Proposed entries labeled, and confirm static and runtime sections make no cross-stage claims.
