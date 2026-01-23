# Prompt 1: DOSage Project Foundation

## Your Task

You are helping design the foundation for **DOSage**, a TypeScript component library that recreates classic DOS-era computer interfaces for modern web applications.

**Do NOT write code yet.** Your job is to make architectural decisions and document them.

---

## Project Vision

DOSage brings the nostalgic aesthetic of DOS-era computing to modern web apps:
- Blocky, pixelated typography (CGA/EGA-era)
- Thick, blinking block cursor
- High-contrast DOS blue (#0000AA) with white text
- Sharp edges, no rounded corners, grid-aligned
- Monospace fonts exclusively

**Technical requirements:**
- Pure TypeScript with comprehensive type definitions
- Zero or minimal runtime dependencies
- Framework-agnostic (vanilla TS/JS)
- ESM and CJS module formats
- Accessible (ARIA, keyboard navigation)

---

## Decisions Needed

Please provide detailed answers for each section below. Be specific—these decisions will guide all future implementation.

### 1. Directory Structure

Define the complete directory structure for the project. Include:
- Source code organization
- Component file structure (co-located styles? separate?)
- Test file locations
- Demo/Kitchen Sink app location
- Build output directories
- Documentation location

### 2. Naming Conventions

Specify conventions for:
- Component file names (e.g., `Button.ts`, `button.ts`, `Button/index.ts`)
- CSS class names (e.g., BEM, `dos-button`, `dosage-button--primary`)
- TypeScript interface names (e.g., `ButtonProps`, `IButtonProps`)
- CSS custom property names (e.g., `--dos-color-primary`, `--dosage-bg`)
- Test file names

### 3. Component Architecture Pattern

For each component, what files should exist? For example:
```
src/components/Button/
├── Button.ts
├── Button.styles.css
├── Button.test.ts
├── Button.types.ts
├── index.ts
```
Or a different pattern? Explain your recommendation.

### 4. Theming System Design

How should theming work?
- CSS custom properties structure
- Theme object interface in TypeScript
- How to switch themes at runtime
- Default theme values
- Preset themes to include (DOS Blue, Amber, Green Phosphor, etc.)

### 5. Build & Module System

- Recommended bundler/build tool
- How to handle CSS (bundled? separate? CSS-in-JS?)
- Entry point structure for tree-shaking
- How to support both ESM and CJS

### 6. Kitchen Sink Demo App

- Technology choice (vanilla HTML/JS, Vite, etc.)
- How to organize the demo (one page per category? single page?)
- How to display code alongside examples
- How to integrate theme switching

### 7. Testing Strategy

- Test framework recommendation
- What to test for each component
- Accessibility testing approach
- How to structure test files

---

## Output Format

Provide your decisions in a structured markdown document that can be saved as `planning/project-foundation.md`. Use clear headings and be specific enough that a developer could implement from your decisions without ambiguity.

Include a final section summarizing:
- All directory paths
- All naming patterns with examples
- Key TypeScript interfaces to create
- Key CSS custom properties to establish
