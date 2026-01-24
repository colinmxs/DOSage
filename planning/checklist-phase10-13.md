# DOSage Checklist — Phases 10–13

> Part 3 of 3: Advanced Components, Utilities, Documentation, and QA

---

## Phase 10: Advanced Interactive Components

### 10.1 Tabs / TabPanels

#### Tabs

**File:** `src/components/Tabs/Tabs.ts`
**Styles:** `src/components/Tabs/Tabs.styles.css`
**Types:** `src/components/Tabs/Tabs.types.ts`
**Tests:** `tests/components/Tabs.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interfaces:
  - [x] `TabsProps` - container configuration
  - [x] `TabProps` - individual tab configuration
  - [x] `TabPanelProps` - panel content configuration
  - [x] `TabsOrientation` - `'horizontal' | 'vertical'`
- [x] Implement base Tabs container component
- [x] Implement Tab component (clickable tab header)
- [x] Implement TabPanel component (content area)
- [x] Add DOS-style tab appearance:
  - [x] Active tab: `┌──────┐` top border, connected to panel
  - [x] Inactive tabs: flat bottom border
  - [x] Vertical tabs: side-connected appearance
- [x] Add horizontal layout (default)
- [x] Add vertical layout option
- [x] Implement controlled/uncontrolled modes
- [x] Add CSS styles with DOS box-drawing characters
- [x] Add keyboard navigation:
  - [x] `←` / `→` for horizontal tabs
  - [x] `↑` / `↓` for vertical tabs
  - [x] `Home` - first tab
  - [x] `End` - last tab
  - [x] `Enter` / `Space` - activate focused tab
- [x] Add ARIA attributes:
  - [x] `role="tablist"` on container
  - [x] `role="tab"` on each tab
  - [x] `role="tabpanel"` on each panel
  - [x] `aria-selected` on active tab
  - [x] `aria-controls` linking tabs to panels
  - [x] `aria-labelledby` on panels
- [x] Add `dos:tabs:change` custom event
- [x] Write unit tests
- [x] Add to Kitchen Sink demo

> **Accessibility:** Full ARIA tablist pattern; automatic focus management; roving tabindex
> **Keyboard:** Arrow keys navigate tabs; Home/End jump to first/last; Enter/Space activate

---

### 10.2 Accordion

#### Accordion

**File:** `src/components/Accordion/Accordion.ts`
**Styles:** `src/components/Accordion/Accordion.styles.css`
**Types:** `src/components/Accordion/Accordion.types.ts`
**Tests:** `tests/components/Accordion.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interfaces:
  - [x] `AccordionProps` - container configuration
  - [x] `AccordionItemProps` - individual section configuration
  - [x] `AccordionMode` - `'single' | 'multiple'`
- [x] Implement base Accordion container component
- [x] Implement AccordionItem component (header + content)
- [x] Add single expand mode (only one open at a time)
- [x] Add multiple expand mode (any number open)
- [x] Add DOS-style expand indicators:
  - [x] Collapsed: `[+]` or `►`
  - [x] Expanded: `[-]` or `▼`
- [x] Add header styling with box characters: `╔═══════════════╗`
- [x] Implement expand/collapse animation (optional, instant by default)
- [x] Add controlled/uncontrolled modes
- [x] Add CSS styles
- [x] Add keyboard navigation:
  - [x] `Enter` / `Space` - toggle current section
  - [x] `↑` / `↓` - navigate between headers
  - [x] `Home` - first header
  - [x] `End` - last header
- [x] Add ARIA attributes:
  - [x] `aria-expanded` on headers
  - [x] `aria-controls` linking header to content
  - [x] `role="button"` on headers (if using non-button element)
  - [x] `aria-labelledby` on content regions
- [x] Add `dos:accordion:toggle` custom event
- [x] Write unit tests
- [x] Add to Kitchen Sink demo

> **Accessibility:** Expandable sections with proper state announcements; keyboard operable headers
> **Keyboard:** Enter/Space toggle; Arrow keys navigate headers; Home/End jump

---

### 10.3 SplitPane

#### SplitPane

**File:** `src/components/SplitPane/SplitPane.ts`
**Styles:** `src/components/SplitPane/SplitPane.styles.css`
**Types:** `src/components/SplitPane/SplitPane.types.ts`
**Tests:** `tests/components/SplitPane.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interfaces:
  - [x] `SplitPaneProps` - configuration options
  - [x] `SplitPaneOrientation` - `'horizontal' | 'vertical'`
  - [x] `SplitPaneSizes` - initial/min/max sizes
- [x] Implement base SplitPane component
- [x] Add horizontal split (left | right)
- [x] Add vertical split (top | bottom)
- [x] Implement resizable divider/splitter:
  - [x] DOS-style ASCII handle: `║` or `═══`
  - [x] Grip indicator: `┃` or `═╪═`
- [x] Add drag-to-resize functionality
- [x] Implement min/max size constraints per pane
- [x] Add initial size configuration (pixels or percentage)
- [x] Implement double-click to reset/collapse
- [x] Add CSS styles with proper cursors (`col-resize`, `row-resize`)
- [x] Add keyboard navigation:
  - [x] `←` / `→` or `↑` / `↓` - resize when divider focused
  - [x] `Home` - collapse to minimum
  - [x] `End` - expand to maximum
- [x] Add ARIA attributes:
  - [x] `role="separator"` on divider
  - [x] `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
  - [x] `aria-orientation`
- [x] Add `dos:splitpane:resize` custom event
- [x] Write unit tests
- [x] Add to Kitchen Sink demo

> **Accessibility:** Separator is keyboard operable; announces current split ratio
> **Keyboard:** Arrow keys resize; Home/End for min/max positions

---

### 10.4 CommandPalette

#### CommandPalette

**File:** `src/components/CommandPalette/CommandPalette.ts`
**Styles:** `src/components/CommandPalette/CommandPalette.styles.css`
**Types:** `src/components/CommandPalette/CommandPalette.types.ts`
**Tests:** `tests/components/CommandPalette.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interfaces:
  - [x] `CommandPaletteProps` - configuration options
  - [x] `CommandItem` - command definition (id, label, shortcut, action, category)
  - [x] `CommandCategory` - grouping for commands
- [x] Implement base CommandPalette component
- [x] Add DOS prompt style input: `C:\>` prefix
- [x] Implement command registration API
- [x] Add search/filter functionality:
  - [x] Basic substring match
  - [x] Fuzzy search support (optional)
- [x] Implement command categories/groups
- [x] Add recently used commands tracking
- [x] Display keyboard shortcuts next to commands
- [x] Implement command execution on selection
- [x] Add CSS styles (modal overlay appearance)
- [x] Add keyboard navigation:
  - [x] `Ctrl+Shift+P` or configurable - open palette
  - [x] `↑` / `↓` - navigate results
  - [x] `Enter` - execute selected command
  - [x] `Escape` - close palette
  - [x] Type to filter
- [x] Add ARIA attributes:
  - [x] `role="combobox"` pattern
  - [x] `role="listbox"` for results
  - [x] `aria-activedescendant` for selection
  - [x] `aria-expanded`
- [x] Add custom events:
  - [x] `dos:commandpalette:open`
  - [x] `dos:commandpalette:execute`
  - [x] `dos:commandpalette:close`
- [x] Write unit tests
- [x] Add to Kitchen Sink demo

> **Accessibility:** Combobox pattern with live filtering; announces result count; keyboard-first design
> **Keyboard:** Ctrl+Shift+P open; Arrows navigate; Enter execute; Escape close; Type to filter

---

### 10.5 SearchInput

#### SearchInput

**File:** `src/components/SearchInput/SearchInput.ts`
**Styles:** `src/components/SearchInput/SearchInput.styles.css`
**Types:** `src/components/SearchInput/SearchInput.types.ts`
**Tests:** `tests/components/SearchInput.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interfaces:
  - [x] `SearchInputProps` - configuration options
  - [x] `SearchSuggestion` - autocomplete item definition
  - [x] `SearchInputState` - internal state
- [x] Implement base SearchInput component
- [x] Add DOS-style search prompt/icon: `[?]` or `FIND:`
- [x] Implement autocomplete suggestions dropdown
- [x] Add async suggestion loading support
- [x] Implement debounced search (configurable delay)
- [x] Add clear button: `[X]` or `[C]`
- [x] Implement suggestion highlighting (matched text)
- [x] Add no-results message
- [x] Add loading state indicator
- [x] Add CSS styles
- [x] Add keyboard navigation:
  - [x] `↑` / `↓` - navigate suggestions
  - [x] `Enter` - select suggestion or submit
  - [x] `Escape` - close suggestions / clear
  - [x] `Tab` - accept inline autocomplete (if applicable)
- [x] Add ARIA attributes:
  - [x] `role="combobox"`
  - [x] `role="listbox"` for suggestions
  - [x] `aria-autocomplete="list"`
  - [x] `aria-activedescendant`
  - [x] `aria-expanded`
  - [x] `aria-busy` during loading
- [x] Add custom events:
  - [x] `dos:search:input`
  - [x] `dos:search:select`
  - [x] `dos:search:submit`
  - [x] `dos:search:clear`
- [x] Write unit tests
- [x] Add to Kitchen Sink demo

> **Accessibility:** Combobox with listbox pattern; announces suggestion count; loading state announced
> **Keyboard:** Arrows navigate suggestions; Enter select/submit; Escape close/clear

---

### 10.6 Combobox

#### Combobox

**File:** `src/components/Combobox/Combobox.ts`
**Styles:** `src/components/Combobox/Combobox.styles.css`
**Types:** `src/components/Combobox/Combobox.types.ts`
**Tests:** `tests/components/Combobox.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interfaces:
  - [x] `ComboboxProps` - configuration options
  - [x] `ComboboxOption` - option definition (value, label, disabled, data)
  - [x] `ComboboxRenderOption` - custom render function type
- [x] Implement base Combobox component
- [x] Add text input field with dropdown toggle
- [x] Implement type-ahead filtering
- [x] Add custom option rendering support
- [x] Implement option groups
- [x] Add disabled options support
- [x] Implement free-form input (allow values not in list)
- [x] Add strict mode (must match an option)
- [x] Add CSS styles with DOS dropdown appearance
- [x] Add keyboard navigation:
  - [x] `↑` / `↓` - navigate options
  - [x] `Enter` - select highlighted option
  - [x] `Escape` - close dropdown
  - [x] `Alt+↓` - open dropdown
  - [x] Type to filter
- [x] Add ARIA attributes:
  - [x] `role="combobox"`
  - [x] `role="listbox"` for options
  - [x] `aria-autocomplete="list"` or `"both"`
  - [x] `aria-activedescendant`
  - [x] `aria-expanded`
  - [x] `aria-haspopup="listbox"`
- [x] Add `dos:combobox:change` custom event
- [x] Write unit tests
- [x] Add to Kitchen Sink demo

> **Accessibility:** Full ARIA combobox pattern; type-ahead announced; options described
> **Keyboard:** Alt+Down open; Arrows navigate; Enter select; Escape close; Type to filter

---

### 10.7 MultiSelect

#### MultiSelect

**File:** `src/components/MultiSelect/MultiSelect.ts`
**Styles:** `src/components/MultiSelect/MultiSelect.styles.css`
**Types:** `src/components/MultiSelect/MultiSelect.types.ts`
**Tests:** `tests/components/MultiSelect.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interfaces:
  - [x] `MultiSelectProps` - configuration options
  - [x] `MultiSelectOption` - option definition
  - [x] `MultiSelectValue` - array of selected values
- [x] Implement base MultiSelect component
- [x] Add tags/chips display for selected items:
  - [x] DOS-style: `[Option1] [Option2] [Option3]`
  - [x] Remove button on each tag: `[Option1 ×]`
- [x] Implement dropdown with checkboxes for options
- [x] Add "Select All" option
- [x] Add "Clear All" option
- [x] Implement search/filter within dropdown
- [x] Add max selection limit option
- [x] Implement disabled options
- [x] Add CSS styles
- [x] Add keyboard navigation:
  - [x] `↑` / `↓` - navigate options
  - [x] `Space` - toggle option selection
  - [x] `Enter` - close dropdown
  - [x] `Backspace` - remove last tag (when input empty)
  - [x] `Escape` - close dropdown
- [x] Add ARIA attributes:
  - [x] `role="listbox"` with `aria-multiselectable="true"`
  - [x] `role="option"` on each option
  - [x] `aria-selected` on options
  - [x] `aria-checked` (if using checkbox pattern)
  - [x] Selection count announcement
- [x] Add `dos:multiselect:change` custom event
- [x] Write unit tests
- [x] Add to Kitchen Sink demo

> **Accessibility:** Multiselectable listbox pattern; announces selection count; removable tags
> **Keyboard:** Space toggle; Enter close; Backspace remove last; Arrows navigate

---

### 10.8 TagInput

#### TagInput

**File:** `src/components/TagInput/TagInput.ts`
**Styles:** `src/components/TagInput/TagInput.styles.css`
**Types:** `src/components/TagInput/TagInput.types.ts`
**Tests:** `tests/components/TagInput.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interfaces:
  - [x] `TagInputProps` - configuration options
  - [x] `Tag` - tag definition (id, label, removable)
  - [x] `TagInputValidation` - validation function type
- [x] Implement base TagInput component
- [x] Add tag creation on Enter/comma/custom delimiter
- [x] Implement tag display:
  - [x] DOS-style: `[tag1] [tag2] [tag3]`
  - [x] Remove button: `[tag ×]`
- [x] Add duplicate validation (reject or allow)
- [x] Implement custom validation function
- [x] Add max tags limit
- [x] Implement tag suggestions/autocomplete (optional)
- [x] Add paste handling (split by delimiter)
- [x] Add CSS styles
- [x] Add keyboard navigation:
  - [x] `Enter` / `,` - create tag from input
  - [x] `Backspace` - remove last tag (when input empty)
  - [x] `←` / `→` - navigate between tags
  - [x] `Delete` - remove focused tag
  - [x] `Escape` - clear input / deselect tag
- [x] Add ARIA attributes:
  - [x] `role="list"` for tag container
  - [x] `role="listitem"` for each tag
  - [x] Announce tag added/removed
  - [x] Error announcements for validation
- [x] Add custom events:
  - [x] `dos:taginput:add`
  - [x] `dos:taginput:remove`
  - [x] `dos:taginput:invalid`
- [x] Write unit tests
- [x] Add to Kitchen Sink demo

> **Accessibility:** List pattern for tags; announces add/remove; validation errors announced
> **Keyboard:** Enter/comma create; Backspace remove last; Arrows navigate tags; Delete remove

---

### Phase 10 Checkpoint

- [x] All Phase 10 components implemented
- [x] All Phase 10 tests passing
- [x] All Phase 10 demos added to Kitchen Sink
- [x] Code review completed

- [ ] ⛔ HUMAN ONLY: I have reviewed and verified Phase 10

---

## Phase 11: Utility Components

### 11.1 Portal

#### Portal

**File:** `src/components/Portal/Portal.ts`
**Styles:** `src/components/Portal/Portal.styles.css`
**Types:** `src/components/Portal/Portal.types.ts`
**Tests:** `tests/components/Portal.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interfaces:
  - [ ] `PortalProps` - configuration options
  - [ ] `PortalContainer` - target container type
- [ ] Implement base Portal component
- [ ] Add default portal target (document.body)
- [ ] Implement custom portal target support
- [ ] Add portal container creation if needed
- [ ] Implement portal cleanup on destroy
- [ ] Handle multiple portals
- [ ] Preserve event bubbling through portal
- [ ] Add CSS styles (minimal, for portal container)
- [ ] Write unit tests:
  - [ ] Content renders in target
  - [ ] Events bubble correctly
  - [ ] Cleanup on destroy
- [ ] Document usage patterns (modals, tooltips, etc.)

> **Accessibility:** Maintains DOM order for screen readers when used with FocusTrap
> **Keyboard:** N/A (utility component)

---

### 11.2 FocusTrap

#### FocusTrap

**File:** `src/components/FocusTrap/FocusTrap.ts`
**Styles:** `src/components/FocusTrap/FocusTrap.styles.css`
**Types:** `src/components/FocusTrap/FocusTrap.types.ts`
**Tests:** `tests/components/FocusTrap.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interfaces:
  - [ ] `FocusTrapProps` - configuration options
  - [ ] `FocusTrapOptions` - behavior options
- [ ] Implement base FocusTrap component
- [ ] Add focus containment within element
- [ ] Implement Tab / Shift+Tab cycling at boundaries
- [ ] Add initial focus element option
- [ ] Implement focus return on deactivate
- [ ] Add escape key handling option
- [ ] Handle dynamically added focusable elements
- [ ] Implement pause/resume functionality
- [ ] Add sentinel elements (hidden start/end focusables)
- [ ] Write unit tests:
  - [ ] Focus stays within trap
  - [ ] Tab cycles correctly
  - [ ] Initial focus works
  - [ ] Focus returns on deactivate
- [ ] Document usage with modals and dialogs

> **Accessibility:** Essential for modal dialogs; prevents focus escape; manages focus return
> **Keyboard:** Tab/Shift+Tab cycle within trap; configurable Escape handling

---

### 11.3 KeyboardShortcutHandler

#### KeyboardShortcutHandler

**File:** `src/components/KeyboardShortcutHandler/KeyboardShortcutHandler.ts`
**Styles:** `src/components/KeyboardShortcutHandler/KeyboardShortcutHandler.styles.css`
**Types:** `src/components/KeyboardShortcutHandler/KeyboardShortcutHandler.types.ts`
**Tests:** `tests/components/KeyboardShortcutHandler.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interfaces:
  - [ ] `KeyboardShortcutHandlerProps` - configuration options
  - [ ] `ShortcutDefinition` - shortcut configuration
  - [ ] `ShortcutCallback` - action callback type
  - [ ] `ModifierKeys` - ctrl, alt, shift, meta
- [ ] Implement base KeyboardShortcutHandler
- [ ] Add shortcut registration API:
  - [ ] `register(shortcut, callback)`
  - [ ] `unregister(shortcut)`
  - [ ] `enable()` / `disable()`
- [ ] Implement shortcut parsing (`Ctrl+Shift+P`, `Alt+F4`)
- [ ] Add global scope (document level)
- [ ] Add local scope (element level)
- [ ] Implement shortcut conflict detection
- [ ] Add shortcut hint display component
- [ ] Handle platform differences (Ctrl vs Cmd)
- [ ] Implement shortcut sequences (`g g`, `Ctrl+K Ctrl+C`)
- [ ] Add CSS styles for hint display
- [ ] Write unit tests:
  - [ ] Shortcuts trigger correctly
  - [ ] Scoping works
  - [ ] Conflicts handled
  - [ ] Platform detection works
- [ ] Add to Kitchen Sink demo with examples

> **Accessibility:** Provides keyboard alternatives; hints can be announced
> **Keyboard:** Configurable shortcuts; supports modifiers and sequences

---

### 11.4 ScrollArea

#### ScrollArea

**File:** `src/components/ScrollArea/ScrollArea.ts`
**Styles:** `src/components/ScrollArea/ScrollArea.styles.css`
**Types:** `src/components/ScrollArea/ScrollArea.types.ts`
**Tests:** `tests/components/ScrollArea.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interfaces:
  - [ ] `ScrollAreaProps` - configuration options
  - [ ] `ScrollAreaOrientation` - `'vertical' | 'horizontal' | 'both'`
- [ ] Implement base ScrollArea component
- [ ] Add DOS-style custom scrollbar:
  - [ ] Vertical: `▲` (up) `█` (thumb) `░` (track) `▼` (down)
  - [ ] Horizontal: `◄` (left) `█` (thumb) `░` (track) `►` (right)
- [ ] Implement vertical scrollbar
- [ ] Implement horizontal scrollbar
- [ ] Add scroll position tracking
- [ ] Implement thumb dragging
- [ ] Add button click scrolling (arrows)
- [ ] Implement track click scrolling (page up/down)
- [ ] Add auto-hide scrollbar option
- [ ] Handle content resize (ResizeObserver)
- [ ] Add CSS styles
- [ ] Add keyboard navigation:
  - [ ] `↑` / `↓` - scroll vertically
  - [ ] `←` / `→` - scroll horizontally
  - [ ] `Page Up` / `Page Down` - page scroll
  - [ ] `Home` / `End` - scroll to start/end
- [ ] Add ARIA attributes:
  - [ ] `role="scrollbar"` on scrollbar
  - [ ] `aria-controls` pointing to content
  - [ ] `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
  - [ ] `aria-orientation`
- [ ] Add `dos:scrollarea:scroll` custom event
- [ ] Write unit tests
- [ ] Add to Kitchen Sink demo

> **Accessibility:** Custom scrollbars maintain keyboard scrolling; ARIA scrollbar semantics
> **Keyboard:** Arrows scroll; Page Up/Down for pages; Home/End for extremes

---

### 11.5 Resizable

#### Resizable

**File:** `src/components/Resizable/Resizable.ts`
**Styles:** `src/components/Resizable/Resizable.styles.css`
**Types:** `src/components/Resizable/Resizable.types.ts`
**Tests:** `tests/components/Resizable.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interfaces:
  - [ ] `ResizableProps` - configuration options
  - [ ] `ResizeDirection` - enabled resize directions
  - [ ] `ResizeConstraints` - min/max width/height
- [ ] Implement base Resizable component
- [ ] Add resize handles:
  - [ ] Corner handles: `◢` (bottom-right), etc.
  - [ ] Edge handles: `═` (horizontal), `║` (vertical)
- [ ] Implement 8-direction resize (corners + edges)
- [ ] Add direction restriction options
- [ ] Implement min/max size constraints
- [ ] Add aspect ratio lock option
- [ ] Implement grid snapping option
- [ ] Add resize preview/ghost option
- [ ] Add CSS styles with appropriate cursors
- [ ] Add keyboard navigation:
  - [ ] `Arrow keys` - resize when handle focused
  - [ ] `Shift+Arrow` - larger resize increments
- [ ] Add ARIA attributes:
  - [ ] `role="separator"` on handles (where appropriate)
  - [ ] `aria-grabbed` during drag
- [ ] Add custom events:
  - [ ] `dos:resizable:start`
  - [ ] `dos:resizable:resize`
  - [ ] `dos:resizable:end`
- [ ] Write unit tests
- [ ] Add to Kitchen Sink demo

> **Accessibility:** Resize handles are keyboard accessible; announces resize state
> **Keyboard:** Arrow keys resize when handle focused; Shift for larger increments

---

### 11.6 Draggable

#### Draggable

**File:** `src/components/Draggable/Draggable.ts`
**Styles:** `src/components/Draggable/Draggable.styles.css`
**Types:** `src/components/Draggable/Draggable.types.ts`
**Tests:** `tests/components/Draggable.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interfaces:
  - [ ] `DraggableProps` - configuration options
  - [ ] `DragConstraints` - containment bounds
  - [ ] `DragAxis` - `'x' | 'y' | 'both'`
- [ ] Implement base Draggable component
- [ ] Add drag handle support (specific element to grab)
- [ ] Implement containment bounds (parent, viewport, custom)
- [ ] Add axis restriction (x-only, y-only)
- [ ] Implement grid snapping
- [ ] Add drag threshold (minimum movement to start)
- [ ] Implement drag preview/ghost option
- [ ] Add CSS styles with grab cursor
- [ ] Add keyboard navigation:
  - [ ] `Arrow keys` - move element
  - [ ] `Shift+Arrow` - larger movement increments
  - [ ] `Escape` - cancel drag
- [ ] Add ARIA attributes:
  - [ ] `aria-grabbed`
  - [ ] `aria-dropeffect` (if applicable)
  - [ ] Announce position changes
- [ ] Add custom events:
  - [ ] `dos:draggable:start`
  - [ ] `dos:draggable:drag`
  - [ ] `dos:draggable:end`
- [ ] Write unit tests
- [ ] Add to Kitchen Sink demo

> **Accessibility:** Keyboard alternative for drag; announces position; grab state communicated
> **Keyboard:** Arrow keys move; Shift for larger increments; Escape cancels

---

### 11.7 VisuallyHidden

#### VisuallyHidden

**File:** `src/components/VisuallyHidden/VisuallyHidden.ts`
**Styles:** `src/components/VisuallyHidden/VisuallyHidden.styles.css`
**Types:** `src/components/VisuallyHidden/VisuallyHidden.types.ts`
**Tests:** `tests/components/VisuallyHidden.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interfaces:
  - [ ] `VisuallyHiddenProps` - configuration options
  - [ ] `VisuallyHiddenElement` - wrapper element type
- [ ] Implement base VisuallyHidden component
- [ ] Add proper CSS for visual hiding:
  ```css
  .dos-visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  ```
- [ ] Add focusable option (visible on focus)
- [ ] Implement as wrapper or standalone
- [ ] Add CSS styles
- [ ] Write unit tests:
  - [ ] Content hidden visually
  - [ ] Content accessible to screen readers
  - [ ] Focusable variant shows on focus
- [ ] Document usage patterns (skip links, form hints, etc.)

> **Accessibility:** Provides screen reader only content; essential for accessible UIs
> **Keyboard:** Focusable variant becomes visible on focus (for skip links)

---

### Phase 11 Checkpoint

- [ ] All Phase 11 utility components implemented
- [ ] All Phase 11 tests passing
- [ ] Utilities integrated with existing components (Portal with Dialog, FocusTrap with Modal, etc.)
- [ ] Documentation for each utility complete
- [ ] Code review completed

- [ ] ⛔ HUMAN ONLY: I have reviewed and verified Phase 11

---

## Phase 12: Polish & Documentation

### 12.1 API Documentation

- [ ] Add JSDoc comments to all public APIs:
  - [ ] All exported classes
  - [ ] All public methods
  - [ ] All interfaces and types
  - [ ] All CSS custom properties
- [ ] Set up TypeDoc for API reference generation
- [ ] Configure TypeDoc output to `docs/api/`
- [ ] Create props tables for each component:
  - [ ] Prop name, type, default, description
  - [ ] Required vs optional indicators
- [ ] Add usage examples to JSDoc:
  - [ ] Basic usage example
  - [ ] Common configurations
  - [ ] Event handling examples
- [ ] Generate and review API documentation
- [ ] Add cross-references between related components

### 12.2 Theming Guide

- [ ] Create `docs/theming.md` comprehensive guide:
  - [ ] Introduction to DOSage theming
  - [ ] CSS custom properties overview
- [ ] Document all CSS custom properties:
  - [ ] Property name
  - [ ] Default value
  - [ ] Description
  - [ ] Which components use it
- [ ] Write theme creation tutorial:
  - [ ] Creating a new theme file
  - [ ] Registering with ThemeManager
  - [ ] Applying themes to elements
- [ ] Document preset themes:
  - [ ] dos-blue (default)
  - [ ] amber
  - [ ] green-phosphor
  - [ ] cga
  - [ ] Screenshots of each
- [ ] Add dark/light mode guidance:
  - [ ] prefers-color-scheme integration
  - [ ] Manual toggle implementation
- [ ] Create theme playground in demo

### 12.3 Kitchen Sink Polish

- [ ] Review all component demos for completeness:
  - [ ] All props demonstrated
  - [ ] All variants shown
  - [ ] All states visible
- [ ] Ensure consistent code examples:
  - [ ] Same code style throughout
  - [ ] Proper syntax highlighting
  - [ ] Copy-to-clipboard functionality
- [ ] Add interactive playground controls:
  - [ ] Prop toggles
  - [ ] Live preview updates
  - [ ] Reset to defaults
- [ ] Perform mobile/responsive testing:
  - [ ] Test on various screen sizes
  - [ ] Touch interaction testing
  - [ ] Mobile keyboard handling
- [ ] Performance check:
  - [ ] Demo page load time
  - [ ] Interaction responsiveness
  - [ ] No memory leaks in demo

### 12.4 Developer Documentation

#### README.md
- [ ] Project description and logo
- [ ] Quick start section (< 5 minutes to first component)
- [ ] Feature highlights
- [ ] Installation instructions (npm, yarn)
- [ ] CDN usage option
- [ ] Basic usage example
- [ ] Links to documentation

#### Getting Started Guide (`docs/getting-started.md`)
- [ ] Prerequisites
- [ ] Installation steps
- [ ] First component example
- [ ] Adding styles
- [ ] Theming basics
- [ ] Next steps

#### Installation Documentation
- [ ] npm installation: `npm install dosage`
- [ ] yarn installation: `yarn add dosage`
- [ ] CDN usage with unpkg/jsdelivr
- [ ] Browser script tag usage
- [ ] CSS import instructions

#### Framework Integration Guides
- [ ] Vanilla TypeScript/JavaScript guide
- [ ] React wrapper notes (future consideration)
- [ ] Vue usage notes
- [ ] Svelte usage notes
- [ ] Angular usage notes

#### Contributing Guide (`CONTRIBUTING.md`)
- [ ] Code of conduct
- [ ] Development setup
- [ ] Running tests
- [ ] Pull request process
- [ ] Code style requirements
- [ ] Component creation guidelines

#### Code Style Documentation
- [ ] TypeScript conventions
- [ ] CSS naming conventions
- [ ] File organization
- [ ] Testing conventions
- [ ] Commit message format

#### Changelog Setup
- [ ] Create `CHANGELOG.md`
- [ ] Set up conventional commits
- [ ] Configure changelog generation
- [ ] Document release process

---

### Phase 12 Checkpoint

- [ ] All API documentation complete
- [ ] Theming guide comprehensive
- [ ] Kitchen Sink demo polished
- [ ] All developer documentation written
- [ ] Documentation reviewed for accuracy
- [ ] Code examples tested and working

- [ ] ⛔ HUMAN ONLY: I have reviewed and verified Phase 12

---

## Phase 13: Quality Assurance

### 13.1 Unit Test Coverage

- [ ] Run test coverage analysis
- [ ] Review coverage report:
  - [ ] Target: 80%+ line coverage
  - [ ] Target: 80%+ branch coverage
- [ ] Add missing component tests:
  - [ ] Identify untested components
  - [ ] Identify untested methods
  - [ ] Write missing tests
- [ ] Add edge case tests:
  - [ ] Empty/null/undefined inputs
  - [ ] Maximum/minimum values
  - [ ] Rapid interactions
  - [ ] Race conditions
- [ ] Add error boundary tests:
  - [ ] Invalid props handling
  - [ ] Missing required props
  - [ ] Graceful degradation

### 13.2 Accessibility Audit

- [ ] Run automated accessibility tests:
  - [ ] axe-core on all components
  - [ ] WAVE evaluation
  - [ ] Lighthouse accessibility audit
- [ ] Test with screen readers:
  - [ ] NVDA on Windows
  - [ ] VoiceOver on macOS
  - [ ] Document any issues found
- [ ] Verify keyboard navigation:
  - [ ] All interactive components keyboard accessible
  - [ ] Focus visible at all times
  - [ ] Tab order logical
  - [ ] No keyboard traps (except intentional)
- [ ] Check color contrast ratios:
  - [ ] All themes meet WCAG AA (4.5:1 for text)
  - [ ] Large text meets 3:1
  - [ ] UI components meet 3:1
- [ ] Review ARIA usage:
  - [ ] No redundant ARIA
  - [ ] Proper role usage
  - [ ] State changes announced
  - [ ] Labels and descriptions present
- [ ] Document accessibility limitations:
  - [ ] Known issues
  - [ ] Browser-specific behaviors
  - [ ] Workarounds

### 13.3 Browser Compatibility

- [ ] Test in Chrome (latest):
  - [ ] All components render correctly
  - [ ] All interactions work
  - [ ] No console errors
- [ ] Test in Firefox (latest):
  - [ ] All components render correctly
  - [ ] All interactions work
  - [ ] CSS renders consistently
- [ ] Test in Safari (latest):
  - [ ] All components render correctly
  - [ ] All interactions work
  - [ ] WebKit-specific issues addressed
- [ ] Test in Edge (latest):
  - [ ] All components render correctly
  - [ ] All interactions work
- [ ] Document browser support matrix:
  - [ ] Minimum supported versions
  - [ ] Known issues per browser
- [ ] Note required polyfills:
  - [ ] Document any needed polyfills
  - [ ] Provide polyfill recommendations

### 13.4 Performance Review

- [ ] Measure initial bundle size:
  - [ ] Total size (uncompressed)
  - [ ] Total size (gzipped)
  - [ ] Total size (brotli)
  - [ ] Target: < 50KB gzipped for full library
- [ ] Verify tree-shaking works:
  - [ ] Individual component import size
  - [ ] Unused code not included
  - [ ] Test with webpack-bundle-analyzer
- [ ] Check for memory leaks:
  - [ ] Create/destroy components repeatedly
  - [ ] Monitor memory in DevTools
  - [ ] Event listener cleanup verified
- [ ] Profile render performance:
  - [ ] Initial render time
  - [ ] Update/re-render time
  - [ ] Animation performance (60fps)
- [ ] Optimize if needed:
  - [ ] Address identified bottlenecks
  - [ ] Lazy load where appropriate
  - [ ] Minimize DOM operations

### 13.5 Bundle Analysis

- [ ] Generate bundle visualization:
  - [ ] Use rollup-plugin-visualizer or similar
  - [ ] Identify largest modules
- [ ] Identify any bloat:
  - [ ] Unused code paths
  - [ ] Duplicate code
  - [ ] Unnecessary utilities
- [ ] Ensure no unnecessary dependencies:
  - [ ] Review package.json dependencies
  - [ ] Remove unused dependencies
  - [ ] Consider inlining small utilities
- [ ] Document final bundle sizes:
  - [ ] Full library size
  - [ ] Per-component sizes
  - [ ] CSS sizes
  - [ ] Tree-shaken sizes

### 13.6 Final Verification

- [ ] All Kitchen Sink demos working:
  - [ ] Every component demo functional
  - [ ] All interactive features work
  - [ ] No visual regressions
- [ ] All tests passing:
  - [ ] `npm test` passes
  - [ ] No skipped tests
  - [ ] No flaky tests
- [ ] No TypeScript errors:
  - [ ] `tsc --noEmit` passes
  - [ ] All types exported correctly
  - [ ] Declaration files generate correctly
- [ ] No linting errors:
  - [ ] ESLint passes
  - [ ] Stylelint passes (if configured)
  - [ ] Prettier formatting correct
- [ ] Documentation complete:
  - [ ] All components documented
  - [ ] All APIs documented
  - [ ] Examples working
  - [ ] Links valid
- [ ] Package ready for publish:
  - [ ] package.json metadata complete
  - [ ] Version number set
  - [ ] License file present
  - [ ] .npmignore configured
  - [ ] Build outputs correct

---

### Phase 13 Checkpoint

- [ ] Test coverage meets targets
- [ ] Accessibility audit passed
- [ ] All browsers tested
- [ ] Performance acceptable
- [ ] Bundle optimized
- [ ] All final checks passed

- [ ] ⛔ HUMAN ONLY: I have reviewed and verified Phase 13

---

- [ ] ⛔ HUMAN ONLY: Final verification complete — DOSage is ready for release

---

## Checklist Complete

All phases have been defined. Work through each phase sequentially, stopping at each Human Checkpoint for verification.

### Phase Summary

| Phase | Focus | Components/Tasks |
|-------|-------|------------------|
| Phase 10 | Advanced Interactive | Tabs, Accordion, SplitPane, CommandPalette, SearchInput, Combobox, MultiSelect, TagInput |
| Phase 11 | Utility Components | Portal, FocusTrap, KeyboardShortcutHandler, ScrollArea, Resizable, Draggable, VisuallyHidden |
| Phase 12 | Polish & Documentation | API docs, Theming guide, Demo polish, Developer docs |
| Phase 13 | Quality Assurance | Test coverage, A11y audit, Browser testing, Performance, Bundle analysis |

### Key Metrics to Track

- **Test Coverage:** Target 80%+
- **Bundle Size:** Target < 50KB gzipped
- **Accessibility:** WCAG 2.1 AA compliance
- **Browser Support:** Latest 2 versions of Chrome, Firefox, Safari, Edge
- **Performance:** 60fps animations, < 100ms interaction response
