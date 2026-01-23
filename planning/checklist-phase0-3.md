# DOSage Implementation Checklist

> **Instructions:** Work through this checklist sequentially. Check boxes as you complete tasks. STOP at each Human Checkpoint and wait for verification.

---

## Phase 0: Project Foundation & Kitchen Sink App

### Repository Initialization

#### Package Configuration

- [x] Initialize npm package
  - [x] Create `package.json` with name `dosage`
  - [x] Set version to `0.1.0`
  - [x] Add description: "A TypeScript component library recreating DOS-era interfaces"
  - [x] Set `"type": "module"`
  - [x] Configure `main`, `module`, `types`, and `exports` fields
  - [x] Add `sideEffects: ["*.css"]`
- [x] Create `tsconfig.json`
  - [x] Target: `ES2020`
  - [x] Module: `ESNext`
  - [x] ModuleResolution: `bundler`
  - [x] Enable `strict` mode
  - [x] Enable `declaration` and `declarationMap`
  - [x] Set `outDir` to `dist`
  - [x] Include `src/**/*`
- [x] Create `tsconfig.build.json` extending base config
  - [x] Exclude test files
  - [x] Exclude demo files

> **Note:** The package.json exports field should follow the structure in project-foundation.md

#### Directory Structure

- [x] Create source directories
  - [x] `src/`
  - [x] `src/components/`
  - [x] `src/core/`
  - [x] `src/themes/`
  - [x] `src/themes/presets/`
  - [x] `src/styles/`
  - [x] `src/types/`
- [x] Create test directories
  - [x] `tests/`
  - [x] `tests/components/`
  - [x] `tests/core/`
  - [x] `tests/themes/`
  - [x] `tests/utils/`
- [x] Create demo directories
  - [x] `demo/`
  - [x] `demo/src/`
  - [x] `demo/src/pages/`
  - [x] `demo/src/components/`
  - [x] `demo/src/utils/`
  - [x] `demo/public/`
  - [x] `demo/public/fonts/`
- [x] Create documentation directories
  - [x] `docs/`
  - [x] `docs/components/`
  - [x] `docs/api/`

#### Build Tooling Setup

- [x] Install Vite as dev dependency
- [x] Create `vite.config.ts` for library build
  - [x] Configure library mode entry point
  - [x] Set output formats: `es` and `cjs`
  - [x] Configure `preserveModules` for tree-shaking
  - [x] Set up CSS extraction
- [x] Create `demo/vite.config.ts` for demo app
  - [x] Configure dev server
  - [x] Set up alias for local library import
- [x] Add npm scripts to `package.json`
  - [x] `"dev"`: Run demo in development mode
  - [x] `"build"`: Build library for production
  - [x] `"build:demo"`: Build demo app
  - [x] `"preview"`: Preview production build
  - [x] `"test"`: Run tests
  - [x] `"test:watch"`: Run tests in watch mode
  - [x] `"lint"`: Run ESLint
  - [x] `"format"`: Run Prettier
  - [x] `"typecheck"`: Run TypeScript type checking

#### Linting and Formatting

- [x] Install ESLint and TypeScript ESLint
- [x] Create `.eslintrc.cjs` or `eslint.config.js`
  - [x] Extend `@typescript-eslint/recommended`
  - [x] Configure rules for project conventions
  - [x] Set up ignore patterns for dist, node_modules
- [x] Install Prettier
- [x] Create `.prettierrc`
  - [x] Set `semi: true`
  - [x] Set `singleQuote: true`
  - [x] Set `tabWidth: 2`
  - [x] Set `trailingComma: 'es5'`
- [x] Create `.prettierignore`
- [x] Create `.editorconfig`

#### Git Configuration

- [x] Create `.gitignore`
  - [x] Ignore `node_modules/`
  - [x] Ignore `dist/`
  - [x] Ignore `.vite/`
  - [x] Ignore `coverage/`
  - [x] Ignore `*.log`
  - [x] Ignore `.env*` (except examples)
  - [x] Ignore IDE-specific files
- [x] Create `.gitattributes`
- [x] Initialize git repository (if not exists)

---

### Kitchen Sink Demo App Scaffold

#### HTML Shell

- [x] Create `demo/index.html`
  - [x] Set DOCTYPE and lang attribute
  - [x] Add meta charset UTF-8
  - [x] Add viewport meta tag
  - [x] Set title "DOSage Kitchen Sink"
  - [x] Link to main CSS
  - [x] Add root container div with id `app`
  - [x] Add script module entry point
- [x] Apply DOS-style base styling
  - [x] Black/blue background
  - [x] Monospace font family
  - [x] Remove default margins/padding

#### Navigation Sidebar

- [x] Create `demo/src/components/Sidebar.ts`
  - [x] Create sidebar container element
  - [x] Add navigation header with title "DOSage"
  - [x] Create nav list structure
  - [x] Add navigation items for each component category:
    - [x] Home/Overview
    - [x] Layout (Container, Panel, Box, Grid, Divider)
    - [x] Typography (Heading, Text, Code, List)
    - [x] Form Controls (placeholder)
    - [x] Feedback (placeholder)
    - [x] Navigation (placeholder)
    - [x] Themes
  - [x] Style with DOS-appropriate borders
  - [x] Add highlight style for active item

#### Main Content Area

- [x] Create `demo/src/components/MainContent.ts`
  - [x] Create main content container
  - [x] Add header area for page title
  - [x] Add content area for component demos
  - [x] Style with appropriate padding and borders
- [x] Create `demo/src/components/DemoSection.ts`
  - [x] Create wrapper for individual demos
  - [x] Add title/heading slot
  - [x] Add description slot
  - [x] Add live example area
  - [x] Add code display area
  - [x] Style with visual separation

#### Router Setup

- [x] Create `demo/src/utils/router.ts`
  - [x] Implement hash-based routing
  - [x] Create `navigate(path)` function
  - [x] Create `getCurrentRoute()` function
  - [x] Add route change event listener
  - [x] Export route constants

#### Theme Switcher UI

- [x] Create `demo/src/components/ThemePicker.ts`
  - [x] Create dropdown/select container
  - [x] Add label "Theme:"
  - [x] Add options for each preset theme:
    - [x] DOS Blue (default)
    - [x] Amber Monochrome
    - [x] Green Phosphor
    - [x] CGA
  - [x] Style as DOS-style dropdown
  - [x] Add change event handler (placeholder for now)
- [x] Position theme picker in header/toolbar area

#### Demo Entry Point

- [x] Create `demo/src/main.ts`
  - [x] Import styles
  - [x] Import and initialize router
  - [x] Import and mount Sidebar
  - [x] Import and mount MainContent
  - [x] Import and mount ThemePicker
  - [x] Set up initial route handling
- [x] Create `demo/src/styles.css`
  - [x] Import library base styles
  - [x] Add demo-specific layout styles
  - [x] Style app shell (sidebar + main layout)

---

### Basic Theming Infrastructure

#### CSS Custom Properties

- [x] Create `src/themes/base.css`
  - [x] Define all color properties under `:root, [data-dos-theme]`
    - [x] `--dos-color-bg`
    - [x] `--dos-color-fg`
    - [x] `--dos-color-primary`
    - [x] `--dos-color-secondary`
    - [x] `--dos-color-border`
    - [x] `--dos-color-highlight`
    - [x] `--dos-color-shadow`
    - [x] `--dos-color-disabled`
    - [x] `--dos-color-error`
    - [x] `--dos-color-success`
  - [x] Define typography properties
    - [x] `--dos-font-family`
    - [x] `--dos-font-size`
    - [x] `--dos-font-size-sm`
    - [x] `--dos-font-size-lg`
    - [x] `--dos-line-height`
  - [x] Define spacing properties
    - [x] `--dos-space-unit` (8px base)
    - [x] `--dos-space-xs`
    - [x] `--dos-space-sm`
    - [x] `--dos-space-md`
    - [x] `--dos-space-lg`
    - [x] `--dos-space-xl`
  - [x] Define border properties
    - [x] `--dos-border-width`
    - [x] `--dos-border-style`
  - [x] Define cursor/animation properties
    - [x] `--dos-cursor-width`
    - [x] `--dos-cursor-height`
    - [x] `--dos-cursor-blink-rate`
    - [x] `--dos-timing-instant`
    - [x] `--dos-timing-fast`
    - [x] `--dos-timing-normal`

#### Theme Type Definitions

- [x] Create `src/themes/index.ts`
  - [x] Export ThemeManager
  - [x] Export theme types
- [x] Create `src/types/theme.ts`
  - [x] Define `ThemeColors` interface
  - [x] Define `ThemeSpacing` interface
  - [x] Define `ThemeTypography` interface
  - [x] Define `ThemeConfig` interface
  - [x] Define `ThemePreset` type union

#### Default DOS Blue Theme

- [x] Create `src/themes/presets/dos-blue.css`
  - [x] Set `[data-dos-theme="dos-blue"]` selector
  - [x] Define DOS Blue color values:
    - [x] Background: `#0000AA`
    - [x] Foreground: `#FFFFFF`
    - [x] Primary: `#FFFF55`
    - [x] Secondary: `#55FFFF`
    - [x] Border: `#AAAAAA`
    - [x] Highlight: `#FFFFFF`
    - [x] Shadow: `#000000`

#### Main Entry Point

- [x] Create `src/index.ts`
  - [x] Add placeholder exports
  - [x] Add comment structure for future exports
- [x] Create `src/types/index.ts`
  - [x] Export all types from theme.ts
  - [x] Add placeholder for component types

---

### Testing Infrastructure

- [x] Install Vitest
- [x] Install `@testing-library/dom`
- [x] Install `jsdom`
- [x] Install `vitest-axe` for accessibility testing
- [x] Create `vitest.config.ts`
  - [x] Configure jsdom environment
  - [x] Set up test file patterns
  - [x] Configure coverage options
- [x] Create `tests/setup.ts`
  - [x] Import jsdom setup
  - [x] Add global test utilities
  - [x] Configure vitest-axe matchers
- [x] Create `tests/utils/render.ts`
  - [x] Create `render()` helper function
  - [x] Create `cleanup()` helper function
- [x] Create placeholder test file `tests/setup.test.ts`
  - [x] Add simple test to verify setup works

---

- [x] ⛔ HUMAN ONLY: I have reviewed and verified Phase 0

---

## Phase 1: Core Infrastructure

### CSS Reset

- [ ] Create `src/styles/reset.css`
  - [ ] Reset box-sizing to border-box
  - [ ] Remove default margins on body
  - [ ] Remove default padding on lists
  - [ ] Reset button styles
  - [ ] Reset input styles
  - [ ] Remove default link underlines (controlled by component)
  - [ ] Set base font to inherit
  - [ ] Normalize line-height
  - [ ] Remove default table spacing

> **Note:** Keep reset minimal and DOS-appropriate. Avoid modern CSS reset patterns that don't fit the aesthetic.

---

### Base Typography Styles

- [ ] Create `src/styles/fonts.css`
  - [ ] Add @font-face for DOS/pixel fonts (if using custom)
  - [ ] Define fallback font stack
  - [ ] Set font-display: block for pixel-perfect rendering
- [ ] Create `src/styles/global.css`
  - [ ] Set html font-size to base value
  - [ ] Set body background and foreground colors
  - [ ] Set default font-family to `--dos-font-family`
  - [ ] Set default line-height
  - [ ] Style selection/highlight colors
  - [ ] Add basic text rendering settings

---

### Theming System

#### ThemeManager Implementation

**File:** `src/themes/ThemeManager.ts`

- [ ] Create `ThemeManager` class with static methods
  - [ ] `setTheme(theme: ThemePreset | string, scope?: HTMLElement): void`
    - [ ] Apply `data-dos-theme` attribute to scope or document root
    - [ ] Dispatch theme change event
  - [ ] `getTheme(scope?: HTMLElement): string`
    - [ ] Read `data-dos-theme` attribute from scope or root
    - [ ] Return current theme name
  - [ ] `registerTheme(name: string, config: ThemeConfig): void`
    - [ ] Store custom theme configuration
    - [ ] Generate and inject CSS custom properties
  - [ ] `applyCustomProperties(config: Partial<ThemeConfig>, scope?: HTMLElement): void`
    - [ ] Apply individual CSS custom properties to scope
- [ ] Export ThemeManager from `src/themes/index.ts`

#### Theme Switching Logic

- [ ] Implement theme persistence to localStorage
  - [ ] Save theme preference on change
  - [ ] Load theme preference on init
- [ ] Create `initTheme()` function
  - [ ] Check for saved preference
  - [ ] Check for system preference (prefers-color-scheme)
  - [ ] Apply default theme if no preference

#### Preset Themes

- [ ] Create `src/themes/presets/amber.css`
  - [ ] Set `[data-dos-theme="amber"]` selector
  - [ ] Background: `#1A1000`
  - [ ] Foreground: `#FFB000`
  - [ ] Primary: `#FFCC00`
  - [ ] Border: `#805800`
- [ ] Create `src/themes/presets/green-phosphor.css`
  - [ ] Set `[data-dos-theme="green-phosphor"]` selector
  - [ ] Background: `#001100`
  - [ ] Foreground: `#00FF00`
  - [ ] Primary: `#33FF33`
  - [ ] Border: `#006600`
- [ ] Create `src/themes/presets/cga.css`
  - [ ] Set `[data-dos-theme="cga"]` selector
  - [ ] Background: `#000000`
  - [ ] Foreground: `#FFFFFF`
  - [ ] Primary: `#FF55FF`
  - [ ] Secondary: `#55FFFF`
  - [ ] Border: `#AAAAAA`
- [ ] Create combined themes import file `src/themes/presets/index.css`
  - [ ] Import all preset theme files

> **Note:** Each theme should define all required color properties for consistency.

---

### Font Setup

- [ ] Source DOS-style monospace fonts
  - [ ] Perfect DOS VGA 437 (or similar)
  - [ ] Fallback to system monospace
- [ ] Add font files to `demo/public/fonts/`
- [ ] Create @font-face declarations in `src/styles/fonts.css`
- [ ] Test font rendering across browsers
- [ ] Document font licensing in README or LICENSES file

---

### Animation Utilities

#### Cursor Blink Animation

- [ ] Create `src/styles/animations.css`
- [ ] Define `@keyframes dos-blink`
  - [ ] 0%, 49%: visible
  - [ ] 50%, 100%: hidden
- [ ] Create `.dos-cursor` class
  - [ ] Apply blink animation
  - [ ] Use `--dos-cursor-blink-rate` for duration
- [ ] Create `.dos-cursor--block` variant
  - [ ] Full character block cursor
- [ ] Create `.dos-cursor--underline` variant
  - [ ] Underline-style cursor

#### Scanline Effect (Optional)

- [ ] Create `.dos-scanlines` class
  - [ ] Use CSS gradient for scanline overlay
  - [ ] Make configurable via CSS property
  - [ ] Ensure it doesn't affect readability
- [ ] Create `.dos-crt` class for CRT screen effect
  - [ ] Subtle vignette
  - [ ] Optional curvature effect

---

### Transition Utilities

- [ ] Create transition utility classes in `src/styles/utilities.css`
  - [ ] `.dos-transition-none` — no transitions
  - [ ] `.dos-transition-fast` — uses `--dos-timing-fast`
  - [ ] `.dos-transition-normal` — uses `--dos-timing-normal`
- [ ] Define default transition properties
  - [ ] Color transitions
  - [ ] Background transitions
  - [ ] Border transitions

---

### Focus Style Utilities

- [ ] Define focus styles in `src/styles/global.css`
  - [ ] Create `.dos-focus-visible` class
  - [ ] Use high-contrast outline for visibility
  - [ ] Ensure focus is visible on all themes
- [ ] Create focus-within styles for containers
- [ ] Implement skip-link styles (for accessibility)

---

### Wire Up Theme Switcher

- [ ] Update `demo/src/components/ThemePicker.ts`
  - [ ] Import ThemeManager from library
  - [ ] Call `ThemeManager.setTheme()` on selection change
  - [ ] Initialize with current theme from ThemeManager
- [ ] Verify theme switching works in demo
  - [ ] Test DOS Blue theme
  - [ ] Test Amber theme
  - [ ] Test Green Phosphor theme
  - [ ] Test CGA theme
- [ ] Verify theme persists on page reload

---

### Core Module Exports

- [ ] Create `src/core/index.ts`
  - [ ] Export any core utilities
- [ ] Create `src/core/Component.ts` (base class placeholder)
  - [ ] Define base component interface
  - [ ] Add common component methods (render, destroy, etc.)
- [ ] Update `src/index.ts` with core exports

---

### Unit Tests for Phase 1

- [ ] Create `tests/themes/ThemeManager.test.ts`
  - [ ] Test: setTheme applies data attribute
  - [ ] Test: getTheme returns current theme
  - [ ] Test: theme persists to localStorage
  - [ ] Test: custom theme registration works
- [ ] Create `tests/core/Component.test.ts`
  - [ ] Test: base component renders
  - [ ] Test: component cleanup works

---

- [ ] ⛔ HUMAN ONLY: I have reviewed and verified Phase 1

---

## Phase 2: Layout Primitives

### Container

**File:** `src/components/Container/Container.ts`
**Styles:** `src/components/Container/Container.styles.css`
**Types:** `src/components/Container/Container.types.ts`
**Tests:** `tests/components/Container.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `ContainerProps`
  - [ ] Prop: `padding` (SpacingValue | { x?: SpacingValue, y?: SpacingValue }) — padding around content
  - [ ] Prop: `maxWidth` (string | number) — maximum width constraint
  - [ ] Prop: `centered` (boolean) — center container horizontally
  - [ ] Prop: `className` (string) — additional CSS classes
  - [ ] Prop: `as` (keyof HTMLElementTagNameMap) — HTML element to render as
- [ ] Implement base component
  - [ ] Create container element
  - [ ] Apply padding based on props
  - [ ] Apply max-width if specified
  - [ ] Apply centering if specified
- [ ] Add CSS styles with class `.dos-container`
  - [ ] Default padding using CSS custom properties
  - [ ] Width: 100% by default
  - [ ] Responsive max-width handling
- [ ] Write unit tests
  - [ ] Test: renders with default props
  - [ ] Test: applies custom padding
  - [ ] Test: centers when centered=true
  - [ ] Test: respects maxWidth prop
- [ ] Add to Kitchen Sink demo
  - [ ] Basic example with content
  - [ ] Padding variations
  - [ ] Centered vs full-width

> **Accessibility:** Container is a structural element; ensure semantic HTML with appropriate landmark roles if needed.

---

### Panel

**File:** `src/components/Panel/Panel.ts`
**Styles:** `src/components/Panel/Panel.styles.css`
**Types:** `src/components/Panel/Panel.types.ts`
**Tests:** `tests/components/Panel.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `PanelProps`
  - [ ] Prop: `title` (string) — optional panel title
  - [ ] Prop: `borderStyle` ('single' | 'double' | 'thick' | 'none') — box-drawing border style
  - [ ] Prop: `padding` (SpacingValue) — internal padding
  - [ ] Prop: `shadow` (boolean) — show DOS-style shadow
  - [ ] Prop: `className` (string) — additional CSS classes
- [ ] Implement base component
  - [ ] Create panel wrapper element
  - [ ] Render title in top border if provided
  - [ ] Create content area
- [ ] Implement border variants
  - [ ] Variant: `single` — uses `┌─┐│└─┘` characters
  - [ ] Variant: `double` — uses `╔═╗║╚═╝` characters
  - [ ] Variant: `thick` — uses `█▀█▌▐█▄█` block characters
  - [ ] Variant: `none` — no visible border
- [ ] Add CSS styles with class `.dos-panel`
  - [ ] `.dos-panel--single`
  - [ ] `.dos-panel--double`
  - [ ] `.dos-panel--thick`
  - [ ] `.dos-panel___title` — title styling
  - [ ] `.dos-panel___content` — content area
  - [ ] `.dos-panel--shadow` — drop shadow effect
- [ ] Add ARIA attributes
  - [ ] `role="region"` when title present
  - [ ] `aria-labelledby` pointing to title element
- [ ] Write unit tests
  - [ ] Test: renders with default border
  - [ ] Test: displays title correctly
  - [ ] Test: applies border style variants
  - [ ] Test: shadow renders when enabled
  - [ ] Test: ARIA attributes present with title
- [ ] Add to Kitchen Sink demo
  - [ ] Basic panel with content
  - [ ] Panel with title
  - [ ] All border style variants
  - [ ] Panel with shadow

> **Accessibility:** Use region role with aria-labelledby when panel has a title.
> **Visual:** Box-drawing characters create authentic DOS look.

---

### Box

**File:** `src/components/Box/Box.ts`
**Styles:** `src/components/Box/Box.styles.css`
**Types:** `src/components/Box/Box.types.ts`
**Tests:** `tests/components/Box.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `BoxProps`
  - [ ] Prop: `border` (boolean | BorderConfig) — border configuration
  - [ ] Prop: `padding` (SpacingValue) — internal padding
  - [ ] Prop: `margin` (SpacingValue) — external margin
  - [ ] Prop: `display` ('block' | 'inline-block' | 'flex' | 'inline-flex') — display mode
  - [ ] Prop: `width` (string | number) — width
  - [ ] Prop: `height` (string | number) — height
  - [ ] Prop: `backgroundColor` (string) — background color override
  - [ ] Prop: `className` (string) — additional CSS classes
- [ ] Define `BorderConfig` interface
  - [ ] `width` (number) — border width
  - [ ] `style` ('solid' | 'dashed' | 'dotted') — CSS border style
  - [ ] `color` (string) — border color
  - [ ] `sides` ('all' | 'top' | 'bottom' | 'left' | 'right' | array) — which sides
- [ ] Implement base component
  - [ ] Create box element
  - [ ] Apply all spacing and size props
  - [ ] Apply border configuration
- [ ] Add CSS styles with class `.dos-box`
  - [ ] Default box styling
  - [ ] Border variants
  - [ ] Display mode classes
- [ ] Write unit tests
  - [ ] Test: renders with default props
  - [ ] Test: applies border correctly
  - [ ] Test: respects padding/margin props
  - [ ] Test: handles different display modes
- [ ] Add to Kitchen Sink demo
  - [ ] Basic box examples
  - [ ] Border configurations
  - [ ] Size variations

> **Accessibility:** Box is a generic container; no specific ARIA needed unless used as a landmark.

---

### Grid

**File:** `src/components/Grid/Grid.ts`
**Styles:** `src/components/Grid/Grid.styles.css`
**Types:** `src/components/Grid/Grid.types.ts`
**Tests:** `tests/components/Grid.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `GridProps`
  - [ ] Prop: `columns` (number | string) — number of columns or grid-template-columns value
  - [ ] Prop: `rows` (number | string) — number of rows or grid-template-rows value
  - [ ] Prop: `gap` (SpacingValue | { row?: SpacingValue, column?: SpacingValue }) — grid gap
  - [ ] Prop: `alignItems` ('start' | 'center' | 'end' | 'stretch') — vertical alignment
  - [ ] Prop: `justifyItems` ('start' | 'center' | 'end' | 'stretch') — horizontal alignment
  - [ ] Prop: `className` (string) — additional CSS classes
- [ ] Define TypeScript interface `GridItemProps`
  - [ ] Prop: `column` (number | string) — grid-column value
  - [ ] Prop: `row` (number | string) — grid-row value
  - [ ] Prop: `colSpan` (number) — column span
  - [ ] Prop: `rowSpan` (number) — row span
- [ ] Implement Grid component
  - [ ] Create grid container element
  - [ ] Apply CSS Grid properties
- [ ] Implement GridItem component
  - [ ] Create grid item wrapper
  - [ ] Apply placement props
- [ ] Add CSS styles
  - [ ] `.dos-grid` — base grid container
  - [ ] `.dos-grid___item` — grid item
  - [ ] Gap utilities
  - [ ] Alignment utilities
- [ ] Write unit tests
  - [ ] Test: renders grid with correct columns
  - [ ] Test: applies gap correctly
  - [ ] Test: GridItem positions correctly
  - [ ] Test: span props work correctly
- [ ] Add to Kitchen Sink demo
  - [ ] Basic grid layout
  - [ ] Different column configurations
  - [ ] Grid with spanning items

> **Accessibility:** Grid is a layout utility; ensure content within has proper structure.

---

### Divider

**File:** `src/components/Divider/Divider.ts`
**Styles:** `src/components/Divider/Divider.styles.css`
**Types:** `src/components/Divider/Divider.types.ts`
**Tests:** `tests/components/Divider.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `DividerProps`
  - [ ] Prop: `orientation` ('horizontal' | 'vertical') — divider direction
  - [ ] Prop: `variant` ('single' | 'double' | 'thick' | 'dashed') — line style
  - [ ] Prop: `character` (string) — custom character to use (overrides variant)
  - [ ] Prop: `length` (string | number | 'full') — divider length
  - [ ] Prop: `margin` (SpacingValue) — margin around divider
  - [ ] Prop: `className` (string) — additional CSS classes
- [ ] Implement base component
  - [ ] Create divider element
  - [ ] Render using appropriate character:
    - [ ] Single horizontal: `─` (U+2500)
    - [ ] Single vertical: `│` (U+2502)
    - [ ] Double horizontal: `═` (U+2550)
    - [ ] Double vertical: `║` (U+2551)
    - [ ] Thick: `█` (U+2588)
    - [ ] Dashed: `┄` or `┆`
- [ ] Add CSS styles with class `.dos-divider`
  - [ ] `.dos-divider--horizontal`
  - [ ] `.dos-divider--vertical`
  - [ ] `.dos-divider--single`
  - [ ] `.dos-divider--double`
  - [ ] `.dos-divider--thick`
  - [ ] `.dos-divider--dashed`
- [ ] Add ARIA attributes
  - [ ] `role="separator"`
  - [ ] `aria-orientation` attribute
- [ ] Write unit tests
  - [ ] Test: renders horizontal by default
  - [ ] Test: renders correct character for variant
  - [ ] Test: custom character overrides variant
  - [ ] Test: has correct ARIA attributes
- [ ] Add to Kitchen Sink demo
  - [ ] Horizontal divider examples
  - [ ] Vertical divider examples
  - [ ] All variant styles
  - [ ] Custom character example

> **Accessibility:** `role="separator"` and `aria-orientation` are required.
> **Keyboard:** Divider is not interactive.

---

### Separator

**File:** `src/components/Separator/Separator.ts`
**Styles:** `src/components/Separator/Separator.styles.css`
**Types:** `src/components/Separator/Separator.types.ts`
**Tests:** `tests/components/Separator.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `SeparatorProps`
  - [ ] Prop: `spacing` (SpacingValue) — vertical space around separator
  - [ ] Prop: `visible` (boolean) — show visual line or just space
  - [ ] Prop: `className` (string) — additional CSS classes
- [ ] Implement base component
  - [ ] Create separator element (blank line or subtle visual)
  - [ ] Apply spacing
- [ ] Add CSS styles with class `.dos-separator`
  - [ ] `.dos-separator--visible` — shows subtle line
  - [ ] `.dos-separator--hidden` — spacing only
- [ ] Add ARIA attributes
  - [ ] `role="separator"` when visible
  - [ ] `aria-hidden="true"` when purely decorative
- [ ] Write unit tests
  - [ ] Test: renders with default props
  - [ ] Test: applies spacing correctly
  - [ ] Test: visible prop shows/hides line
- [ ] Add to Kitchen Sink demo
  - [ ] Visible separator
  - [ ] Invisible spacer
  - [ ] Different spacing values

> **Accessibility:** Visible separators should have `role="separator"`.

---

### Export Layout Components

- [ ] Create `src/components/Container/index.ts` — barrel export
- [ ] Create `src/components/Panel/index.ts` — barrel export
- [ ] Create `src/components/Box/index.ts` — barrel export
- [ ] Create `src/components/Grid/index.ts` — barrel export
- [ ] Create `src/components/Divider/index.ts` — barrel export
- [ ] Create `src/components/Separator/index.ts` — barrel export
- [ ] Update `src/index.ts` to export all layout components
- [ ] Update `src/types/index.ts` to export all layout types

---

- [ ] ⛔ HUMAN ONLY: I have reviewed and verified Phase 2

---

## Phase 3: Typography Components

### Heading

**File:** `src/components/Heading/Heading.ts`
**Styles:** `src/components/Heading/Heading.styles.css`
**Types:** `src/components/Heading/Heading.types.ts`
**Tests:** `tests/components/Heading.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `HeadingProps`
  - [ ] Prop: `level` (1 | 2 | 3 | 4 | 5 | 6) — heading level (h1-h6)
  - [ ] Prop: `children` (string | HTMLElement) — heading content
  - [ ] Prop: `align` ('left' | 'center' | 'right') — text alignment
  - [ ] Prop: `uppercase` (boolean) — transform to uppercase
  - [ ] Prop: `decorated` (boolean) — add DOS-style decoration (underline or box)
  - [ ] Prop: `className` (string) — additional CSS classes
- [ ] Implement base component
  - [ ] Create heading element (h1-h6 based on level)
  - [ ] Apply text content
  - [ ] Apply alignment and decoration
- [ ] Implement decoration variants
  - [ ] Underline decoration: `═══════════`
  - [ ] Box decoration: surround with box-drawing chars
- [ ] Add CSS styles with class `.dos-heading`
  - [ ] `.dos-heading--h1` through `.dos-heading--h6`
  - [ ] `.dos-heading--center`, `.dos-heading--right`
  - [ ] `.dos-heading--uppercase`
  - [ ] `.dos-heading--decorated`
  - [ ] Size scaling for each level
- [ ] Write unit tests
  - [ ] Test: renders correct heading level
  - [ ] Test: applies alignment classes
  - [ ] Test: uppercase transformation works
  - [ ] Test: decoration renders correctly
- [ ] Add to Kitchen Sink demo
  - [ ] All heading levels (H1-H6)
  - [ ] Alignment variations
  - [ ] Decorated headings

> **Accessibility:** Use semantic heading levels; ensure proper heading hierarchy.

---

### Text

**File:** `src/components/Text/Text.ts`
**Styles:** `src/components/Text/Text.styles.css`
**Types:** `src/components/Text/Text.types.ts`
**Tests:** `tests/components/Text.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `TextProps`
  - [ ] Prop: `children` (string | HTMLElement) — text content
  - [ ] Prop: `size` ('sm' | 'base' | 'lg') — font size
  - [ ] Prop: `weight` ('normal' | 'bold') — font weight (simulated for DOS)
  - [ ] Prop: `color` (string) — text color override
  - [ ] Prop: `align` ('left' | 'center' | 'right' | 'justify') — text alignment
  - [ ] Prop: `truncate` (boolean) — truncate with ellipsis
  - [ ] Prop: `as` ('p' | 'span' | 'div') — HTML element to render
  - [ ] Prop: `className` (string) — additional CSS classes
- [ ] Implement base component
  - [ ] Create text element
  - [ ] Apply styling props
- [ ] Add CSS styles with class `.dos-text`
  - [ ] `.dos-text--sm`, `.dos-text--lg`
  - [ ] `.dos-text--bold` (brighter color or different character)
  - [ ] `.dos-text--center`, `.dos-text--right`, `.dos-text--justify`
  - [ ] `.dos-text--truncate`
- [ ] Write unit tests
  - [ ] Test: renders with default props
  - [ ] Test: applies size classes
  - [ ] Test: renders as correct element
  - [ ] Test: truncate adds ellipsis styles
- [ ] Add to Kitchen Sink demo
  - [ ] Basic paragraph text
  - [ ] Size variations
  - [ ] Bold/emphasis variations
  - [ ] Truncated text example

> **Accessibility:** Use semantic elements; ensure sufficient color contrast.

---

### Code

**File:** `src/components/Code/Code.ts`
**Styles:** `src/components/Code/Code.styles.css`
**Types:** `src/components/Code/Code.types.ts`
**Tests:** `tests/components/Code.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `CodeProps`
  - [ ] Prop: `children` (string) — code content
  - [ ] Prop: `highlighted` (boolean) — apply highlight background
  - [ ] Prop: `className` (string) — additional CSS classes
- [ ] Implement base component
  - [ ] Create `<code>` element
  - [ ] Preserve whitespace
- [ ] Add CSS styles with class `.dos-code`
  - [ ] Monospace font (same as base, but explicit)
  - [ ] Distinctive background or border
  - [ ] `.dos-code--highlighted` — brighter/different background
- [ ] Write unit tests
  - [ ] Test: renders code element
  - [ ] Test: preserves whitespace
  - [ ] Test: highlighted variant applies styles
- [ ] Add to Kitchen Sink demo
  - [ ] Inline code in text
  - [ ] Highlighted code
  - [ ] Various code examples

> **Accessibility:** `<code>` element provides semantic meaning.

---

### CodeBlock

**File:** `src/components/CodeBlock/CodeBlock.ts`
**Styles:** `src/components/CodeBlock/CodeBlock.styles.css`
**Types:** `src/components/CodeBlock/CodeBlock.types.ts`
**Tests:** `tests/components/CodeBlock.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `CodeBlockProps`
  - [ ] Prop: `code` (string) — code content
  - [ ] Prop: `language` (string) — language hint (for future syntax highlighting)
  - [ ] Prop: `lineNumbers` (boolean) — show line numbers
  - [ ] Prop: `startLine` (number) — starting line number
  - [ ] Prop: `highlightLines` (number[]) — lines to highlight
  - [ ] Prop: `maxHeight` (string | number) — max height with scroll
  - [ ] Prop: `copyButton` (boolean) — show copy to clipboard button
  - [ ] Prop: `className` (string) — additional CSS classes
- [ ] Implement base component
  - [ ] Create `<pre><code>` structure
  - [ ] Split code into lines
  - [ ] Render line numbers if enabled
  - [ ] Apply line highlighting
  - [ ] Add copy button if enabled
- [ ] Implement copy functionality
  - [ ] Copy code to clipboard on button click
  - [ ] Show brief "Copied!" feedback
- [ ] Add CSS styles with class `.dos-codeblock`
  - [ ] `.dos-codeblock___pre` — preformatted wrapper
  - [ ] `.dos-codeblock___code` — code content
  - [ ] `.dos-codeblock___line-numbers` — line number gutter
  - [ ] `.dos-codeblock___line` — individual line
  - [ ] `.dos-codeblock___line--highlighted` — highlighted line
  - [ ] `.dos-codeblock___copy-btn` — copy button
  - [ ] Overflow handling with scroll
- [ ] Add keyboard navigation
  - [ ] Key: `Tab` — focus copy button
  - [ ] Key: `Enter`/`Space` on button — copy code
- [ ] Add ARIA attributes
  - [ ] `role="region"` for code block
  - [ ] `aria-label="Code block"`
  - [ ] Copy button: `aria-label="Copy code to clipboard"`
- [ ] Write unit tests
  - [ ] Test: renders code content
  - [ ] Test: line numbers display correctly
  - [ ] Test: highlighted lines have correct class
  - [ ] Test: copy button copies to clipboard
- [ ] Add to Kitchen Sink demo
  - [ ] Basic code block
  - [ ] Code with line numbers
  - [ ] Highlighted lines example
  - [ ] With copy button

> **Accessibility:** Ensure code is readable by screen readers; copy button should be keyboard accessible.
> **Keyboard:** `Tab` to copy button, `Enter`/`Space` to activate.

---

### Blockquote

**File:** `src/components/Blockquote/Blockquote.ts`
**Styles:** `src/components/Blockquote/Blockquote.styles.css`
**Types:** `src/components/Blockquote/Blockquote.types.ts`
**Tests:** `tests/components/Blockquote.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `BlockquoteProps`
  - [ ] Prop: `children` (string | HTMLElement) — quote content
  - [ ] Prop: `cite` (string) — citation/attribution
  - [ ] Prop: `indicator` (string) — character for left indicator (default: `│` or `▌`)
  - [ ] Prop: `className` (string) — additional CSS classes
- [ ] Implement base component
  - [ ] Create `<blockquote>` element
  - [ ] Add left indicator (repeated on each line for DOS look)
  - [ ] Add citation if provided
- [ ] Add CSS styles with class `.dos-blockquote`
  - [ ] Left border/indicator styling
  - [ ] `.dos-blockquote___content` — quote text
  - [ ] `.dos-blockquote___cite` — citation styling
  - [ ] Indentation from left
- [ ] Write unit tests
  - [ ] Test: renders blockquote element
  - [ ] Test: displays citation
  - [ ] Test: custom indicator character works
- [ ] Add to Kitchen Sink demo
  - [ ] Basic blockquote
  - [ ] With citation
  - [ ] Custom indicator characters

> **Accessibility:** Use semantic `<blockquote>` and `<cite>` elements.

---

### List

**File:** `src/components/List/List.ts`
**Styles:** `src/components/List/List.styles.css`
**Types:** `src/components/List/List.types.ts`
**Tests:** `tests/components/List.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `ListProps`
  - [ ] Prop: `items` (ListItem[]) — array of list items
  - [ ] Prop: `type` ('unordered' | 'ordered') — list type
  - [ ] Prop: `bullet` (string) — custom bullet character for unordered
  - [ ] Prop: `nested` (boolean) — is this a nested list
  - [ ] Prop: `className` (string) — additional CSS classes
- [ ] Define `ListItem` interface
  - [ ] `content` (string | HTMLElement) — item content
  - [ ] `children` (ListItem[]) — nested items
- [ ] Implement base component
  - [ ] Create `<ul>` or `<ol>` element based on type
  - [ ] Render items recursively for nesting
  - [ ] Apply custom bullets:
    - [ ] Default: `■` (U+25A0) Black Square
    - [ ] Alternate: `►` (U+25BA) Right Pointer
    - [ ] Circle: `•` (U+2022) Bullet
    - [ ] Arrow: `→` (U+2192) Arrow
- [ ] Add CSS styles with class `.dos-list`
  - [ ] `.dos-list--unordered`
  - [ ] `.dos-list--ordered`
  - [ ] `.dos-list___item` — list item
  - [ ] `.dos-list___bullet` — bullet character
  - [ ] Nested list indentation
  - [ ] Different bullets for nesting levels
- [ ] Write unit tests
  - [ ] Test: renders unordered list
  - [ ] Test: renders ordered list
  - [ ] Test: custom bullet character works
  - [ ] Test: nested lists render correctly
- [ ] Add to Kitchen Sink demo
  - [ ] Unordered list with different bullets
  - [ ] Ordered list
  - [ ] Nested lists
  - [ ] Mixed nested lists

> **Accessibility:** Use semantic `<ul>`, `<ol>`, `<li>` elements.

---

### DefinitionList

**File:** `src/components/DefinitionList/DefinitionList.ts`
**Styles:** `src/components/DefinitionList/DefinitionList.styles.css`
**Types:** `src/components/DefinitionList/DefinitionList.types.ts`
**Tests:** `tests/components/DefinitionList.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `DefinitionListProps`
  - [ ] Prop: `items` (DefinitionItem[]) — array of term/definition pairs
  - [ ] Prop: `layout` ('stacked' | 'inline') — layout mode
  - [ ] Prop: `className` (string) — additional CSS classes
- [ ] Define `DefinitionItem` interface
  - [ ] `term` (string) — the term (dt)
  - [ ] `definition` (string | HTMLElement) — the definition (dd)
- [ ] Implement base component
  - [ ] Create `<dl>` element
  - [ ] Render `<dt>` and `<dd>` pairs
- [ ] Implement layout variants
  - [ ] Stacked: term above definition
  - [ ] Inline: term and definition on same line
- [ ] Add CSS styles with class `.dos-definition-list`
  - [ ] `.dos-definition-list--stacked`
  - [ ] `.dos-definition-list--inline`
  - [ ] `.dos-definition-list___term` — term styling (bold/highlighted)
  - [ ] `.dos-definition-list___definition` — definition styling
- [ ] Write unit tests
  - [ ] Test: renders dl, dt, dd structure
  - [ ] Test: stacked layout works
  - [ ] Test: inline layout works
- [ ] Add to Kitchen Sink demo
  - [ ] Stacked definition list
  - [ ] Inline definition list
  - [ ] Styled terms example

> **Accessibility:** Use semantic `<dl>`, `<dt>`, `<dd>` elements.

---

### Label

**File:** `src/components/Label/Label.ts`
**Styles:** `src/components/Label/Label.styles.css`
**Types:** `src/components/Label/Label.types.ts`
**Tests:** `tests/components/Label.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `LabelProps`
  - [ ] Prop: `text` (string) — label text
  - [ ] Prop: `for` (string) — id of associated form control
  - [ ] Prop: `required` (boolean) — show required indicator
  - [ ] Prop: `requiredIndicator` (string) — custom required indicator (default: `*`)
  - [ ] Prop: `disabled` (boolean) — show as disabled
  - [ ] Prop: `className` (string) — additional CSS classes
- [ ] Implement base component
  - [ ] Create `<label>` element
  - [ ] Set `for` attribute
  - [ ] Add required indicator if needed
- [ ] Add CSS styles with class `.dos-label`
  - [ ] `.dos-label--required` — required indicator styling
  - [ ] `.dos-label--disabled` — disabled appearance
  - [ ] `.dos-label___required-indicator` — the asterisk or indicator
- [ ] Write unit tests
  - [ ] Test: renders label element
  - [ ] Test: for attribute is set
  - [ ] Test: required indicator shows
  - [ ] Test: disabled styling applies
- [ ] Add to Kitchen Sink demo
  - [ ] Basic label
  - [ ] Required label
  - [ ] Disabled label
  - [ ] Label with form control

> **Accessibility:** Always use `for` attribute to associate with form controls.

---

### ASCIIArt

**File:** `src/components/ASCIIArt/ASCIIArt.ts`
**Styles:** `src/components/ASCIIArt/ASCIIArt.styles.css`
**Types:** `src/components/ASCIIArt/ASCIIArt.types.ts`
**Tests:** `tests/components/ASCIIArt.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interface `ASCIIArtProps`
  - [ ] Prop: `art` (string) — pre-formatted ASCII art string
  - [ ] Prop: `text` (string) — text to convert to ASCII (if using generator)
  - [ ] Prop: `font` ('standard' | 'banner' | 'block' | 'mini') — ASCII font style for text
  - [ ] Prop: `color` (string) — text color override
  - [ ] Prop: `animate` (boolean) — typewriter-style animation
  - [ ] Prop: `animationSpeed` (number) — ms per character for animation
  - [ ] Prop: `className` (string) — additional CSS classes
- [ ] Implement base component
  - [ ] Create `<pre>` wrapper element
  - [ ] Render art string preserving whitespace
  - [ ] If `text` prop, convert to ASCII art (simple implementation)
- [ ] Implement basic ASCII font converters
  - [ ] Standard: basic block letters
  - [ ] Banner: large banner-style letters
  - [ ] Block: solid block letters
  - [ ] Mini: small 3-line letters
- [ ] Implement animation (optional)
  - [ ] Typewriter effect: reveal character by character
  - [ ] Use requestAnimationFrame for smooth animation
- [ ] Add CSS styles with class `.dos-ascii-art`
  - [ ] Preserve whitespace (white-space: pre)
  - [ ] Monospace font
  - [ ] Optional color overrides
- [ ] Add ARIA attributes
  - [ ] `role="img"`
  - [ ] `aria-label` with text description
- [ ] Write unit tests
  - [ ] Test: renders pre element
  - [ ] Test: art string displays correctly
  - [ ] Test: text conversion works
  - [ ] Test: ARIA attributes present
- [ ] Add to Kitchen Sink demo
  - [ ] Pre-made ASCII art
  - [ ] Text converted to ASCII
  - [ ] Different font styles
  - [ ] Animated example

> **Accessibility:** Use `role="img"` and provide `aria-label` describing the art.
> **Note:** Text-to-ASCII conversion can be basic; focus on displaying pre-made art.

---

### Export Typography Components

- [ ] Create `src/components/Heading/index.ts` — barrel export
- [ ] Create `src/components/Text/index.ts` — barrel export
- [ ] Create `src/components/Code/index.ts` — barrel export
- [ ] Create `src/components/CodeBlock/index.ts` — barrel export
- [ ] Create `src/components/Blockquote/index.ts` — barrel export
- [ ] Create `src/components/List/index.ts` — barrel export
- [ ] Create `src/components/DefinitionList/index.ts` — barrel export
- [ ] Create `src/components/Label/index.ts` — barrel export
- [ ] Create `src/components/ASCIIArt/index.ts` — barrel export
- [ ] Update `src/index.ts` to export all typography components
- [ ] Update `src/types/index.ts` to export all typography types

---

### Kitchen Sink Demo Pages

- [ ] Create `demo/src/pages/layout.ts`
  - [ ] Add Container examples
  - [ ] Add Panel examples
  - [ ] Add Box examples
  - [ ] Add Grid examples
  - [ ] Add Divider examples
  - [ ] Add Separator examples
- [ ] Create `demo/src/pages/typography.ts`
  - [ ] Add Heading examples (H1-H6)
  - [ ] Add Text examples
  - [ ] Add Code examples
  - [ ] Add CodeBlock examples
  - [ ] Add Blockquote examples
  - [ ] Add List examples
  - [ ] Add DefinitionList examples
  - [ ] Add Label examples
  - [ ] Add ASCIIArt examples
- [ ] Update navigation to link to new pages
- [ ] Add code snippets for each example

---

- [ ] ⛔ HUMAN ONLY: I have reviewed and verified Phase 3

---

## Type Definitions Summary

Create these shared types in `src/types/common.ts`:

```typescript
// Spacing values
type SpacingValue = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;

// Common component props
interface BaseComponentProps {
  className?: string;
  id?: string;
}
```

---

## CSS Class Reference

| Component | Base Class | Modifiers |
|-----------|------------|-----------|
| Container | `.dos-container` | `--centered` |
| Panel | `.dos-panel` | `--single`, `--double`, `--thick`, `--shadow` |
| Box | `.dos-box` | `--bordered` |
| Grid | `.dos-grid` | — |
| Divider | `.dos-divider` | `--horizontal`, `--vertical`, `--single`, `--double` |
| Separator | `.dos-separator` | `--visible`, `--hidden` |
| Heading | `.dos-heading` | `--h1`...`--h6`, `--decorated`, `--uppercase` |
| Text | `.dos-text` | `--sm`, `--lg`, `--bold`, `--truncate` |
| Code | `.dos-code` | `--highlighted` |
| CodeBlock | `.dos-codeblock` | — |
| Blockquote | `.dos-blockquote` | — |
| List | `.dos-list` | `--unordered`, `--ordered` |
| DefinitionList | `.dos-definition-list` | `--stacked`, `--inline` |
| Label | `.dos-label` | `--required`, `--disabled` |
| ASCIIArt | `.dos-ascii-art` | `--animated` |
