# Prompt 5: DOSage Agent Instructions & Starter Prompt

## Context

You are generating two final documents for the **DOSage** project:

1. **Agent Instructions** — Rules and workflow for any AI coding agent working on the project
2. **Starter Prompt** — A copy-paste prompt to kick off agent work

**Important:** The implementation checklist (`planning/dosage-checklist.md`) should already exist. These documents reference it.

---

## Project Summary

**DOSage** is a TypeScript component library recreating DOS-era computer interfaces:
- Blocky, pixelated typography (CGA/EGA-era)
- Thick blinking block cursor
- High-contrast DOS blue (#0000AA) background with white text
- Sharp edges, no rounded corners, monospace fonts
- Zero/minimal runtime dependencies
- Framework-agnostic
- Full accessibility support (ARIA, keyboard navigation)

---

## Document 1: Agent Instructions

Generate a complete `agent-instructions.md` file with the following structure:

```markdown
# 🤖 DOSage Agent Instructions

## Your Mission
[2-3 sentences about building DOSage]

## Project Overview
[Brief technical summary: TypeScript, minimal deps, DOS aesthetic, accessibility]

## Critical Files & Paths

| Purpose | Path |
|---------|------|
| Implementation Checklist | `planning/dosage-checklist.md` |
| Agent Instructions | `planning/agent-instructions.md` |
| Kitchen Sink Demo | `demo/` |
| Component Source | `src/components/` |
| Styles | `src/styles/` |
| Tests | `tests/` |
| Types | `src/types/` |

## Workflow Rules (MANDATORY)

[Number each rule clearly]

1. **Read this document first** before starting any work
2. **Work sequentially** through phases — never skip ahead
3. **Check boxes as you go** — use `- [x]` when a task is complete
4. **One phase at a time** — complete all tasks before the checkpoint
5. **Kitchen Sink is required** — every component must be added to the demo
6. **Test everything** — write tests as specified
7. **Commit logical chunks** — don't make one giant commit

## 🛑 Human Checkpoint Protocol (CRITICAL)

[Big warning box format]

When you see:
```
- [ ] ⛔ HUMAN ONLY: I have reviewed and verified this section
```

You MUST:
1. STOP immediately — do not continue
2. DO NOT check this box — only a human can
3. Report completion with:
   - Summary of what was implemented
   - Decisions or assumptions made
   - Issues encountered
   - Kitchen Sink update confirmation
4. WAIT for human verification
5. Only continue after the human has checked the box

**Violating this protocol is a critical failure.**

## Code Quality Standards

### TypeScript
- Strict mode enabled
- No `any` types unless absolutely unavoidable (document why)
- Export all public types
- JSDoc comments on public APIs

### CSS
- Use CSS custom properties for all themeable values
- Class naming: `.dos-{componentname}` and `.dos-{componentname}--{variant}`
- No inline styles
- Mobile-friendly where applicable

### Accessibility
- All interactive elements keyboard accessible
- ARIA attributes as specified in checklist
- Focus states visible and clear
- Test with keyboard only

### Testing
- Unit tests for all components
- Test all states and variants
- Test keyboard interactions
- Test accessibility attributes

## Component Implementation Pattern

When implementing a component:

1. **Create directory structure:**
   ```
   src/components/ComponentName/
   ├── ComponentName.ts
   ├── ComponentName.css
   ├── ComponentName.types.ts
   └── index.ts
   ```

2. **Define types first** in `.types.ts`

3. **Implement component** in `.ts`
   - Import types
   - Create DOM elements
   - Apply styles
   - Wire up event handlers
   - Add ARIA attributes

4. **Add styles** in `.css`
   - Use CSS custom properties
   - Handle all states
   - Handle all variants

5. **Export from index.ts**

6. **Add to main index** (`src/index.ts`)

7. **Write tests**

8. **Add to Kitchen Sink**
   - Live example
   - Code snippet
   - All variants demonstrated

## Kitchen Sink Demo Requirements

For each component added:
- Working live example
- Code snippet showing usage
- All variants visible
- All states demonstrable (where feasible)
- Consistent layout with other components

## When You Get Stuck

- **Unclear task:** Make a reasonable decision, document in a code comment, continue
- **Blocked:** Note the blocker clearly and STOP
- **Error you can't fix:** Document the error, what you tried, and STOP
- **Missing dependency:** Note it and continue if possible, or STOP if blocked

## Reporting Format

After completing a phase, provide:

```
## Phase N Complete

### ✅ Completed
- [List all tasks completed]

### 🔧 Decisions Made
- [Any assumptions or architectural choices]

### ⚠️ Issues Encountered
- [Any problems, workarounds, or concerns]

### 📦 Kitchen Sink Updates
- [List components added to demo]

### 🛑 Status
Ready for human verification. Awaiting checkpoint approval.
```

## DO NOT

- Check any `⛔ HUMAN ONLY` box
- Skip phases or tasks
- Proceed past a checkpoint without approval
- Use external dependencies without approval
- Write untested code
- Forget the Kitchen Sink demo
- Use `any` types without documentation
- Ignore accessibility requirements
```

---

## Document 2: Starter Prompt

Generate a complete `starter-prompt.md` file that can be copy-pasted to start an agent session:

```markdown
# DOSage Implementation — Start Work

## Project Context

You are building **DOSage**, a TypeScript component library that recreates classic DOS-era computer interfaces for modern web applications.

**Design characteristics:**
- Blocky typography reminiscent of CGA/EGA text
- Thick blinking block cursor
- DOS blue (#0000AA) background with white/light gray text
- Sharp edges, no rounded corners
- Monospace fonts exclusively
- Box-drawing characters for borders (─│═║┌┐└┘├┤┬┴┼)

**Technical requirements:**
- Pure TypeScript with comprehensive types
- Zero/minimal runtime dependencies
- Framework-agnostic (vanilla TS/JS)
- ESM and CJS module support
- Accessible (ARIA, keyboard navigation)

## Your Resources

1. **Agent Instructions:** `planning/agent-instructions.md`
   - Read this FIRST — contains all rules and standards

2. **Implementation Checklist:** `planning/dosage-checklist.md`
   - Your task list — work through sequentially
   - Check boxes as you complete tasks

3. **Kitchen Sink Demo:** `demo/`
   - Add every component here after implementation
   - Show live example + code snippet

## Your Workflow

1. **Read `planning/agent-instructions.md`** — understand the rules
2. **Read `planning/dosage-checklist.md`** — find current position
3. **Find the next incomplete phase** — look for first unchecked `⛔ HUMAN ONLY`
4. **Complete all tasks in that phase** — check boxes as you go
5. **For each component:**
   - Implement with TypeScript types
   - Add accessibility (ARIA, keyboard)
   - Write unit tests
   - Add to Kitchen Sink with example + code
6. **At the Human Checkpoint:** STOP and report

## Critical Rules

⚠️ **DO NOT** check any box marked `⛔ HUMAN ONLY` — only humans can
⚠️ **DO NOT** proceed past a Human Checkpoint until it's checked
⚠️ **DO NOT** skip tasks — complete them in order
⚠️ **DO NOT** forget the Kitchen Sink — every component must be added

## Start Now

1. Read the agent instructions
2. Read the checklist
3. Find where to start (first unchecked phase)
4. Begin working

Report back when you reach a Human Checkpoint.
```

---

## Output

Generate both complete documents:

1. First output the full `agent-instructions.md` content
2. Then output the full `starter-prompt.md` content

Make sure both are complete, standalone, and ready to use. Expand on the templates above with additional helpful detail while keeping them focused and actionable.
