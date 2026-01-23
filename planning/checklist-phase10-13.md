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

- [ ] Create component directory structure
- [ ] Define TypeScript interfaces:
  - [ ] `TabsProps` - container configuration
  - [ ] `TabProps` - individual tab configuration
  - [ ] `TabPanelProps` - panel content configuration
  - [ ] `TabsOrientation` - `'horizontal' | 'vertical'`
- [ ] Implement base Tabs container component
- [ ] Implement Tab component (clickable tab header)
- [ ] Implement TabPanel component (content area)
- [ ] Add DOS-style tab appearance:
  - [ ] Active tab: `┌──────┐` top border, connected to panel
  - [ ] Inactive tabs: flat bottom border
  - [ ] Vertical tabs: side-connected appearance
- [ ] Add horizontal layout (default)
- [ ] Add vertical layout option
- [ ] Implement controlled/uncontrolled modes
- [ ] Add CSS styles with DOS box-drawing characters
- [ ] Add keyboard navigation:
  - [ ] `←` / `→` for horizontal tabs
  - [ ] `↑` / `↓` for vertical tabs
  - [ ] `Home` - first tab
  - [ ] `End` - last tab
  - [ ] `Enter` / `Space` - activate focused tab
- [ ] Add ARIA attributes:
  - [ ] `role="tablist"` on container
  - [ ] `role="tab"` on each tab
  - [ ] `role="tabpanel"` on each panel
  - [ ] `aria-selected` on active tab
  - [ ] `aria-controls` linking tabs to panels
  - [ ] `aria-labelledby` on panels
- [ ] Add `dos:tabs:change` custom event
- [ ] Write unit tests
- [ ] Add to Kitchen Sink demo

> **Accessibility:** Full ARIA tablist pattern; automatic focus management; roving tabindex
> **Keyboard:** Arrow keys navigate tabs; Home/End jump to first/last; Enter/Space activate

---

### 10.2 Accordion

#### Accordion

**File:** `src/components/Accordion/Accordion.ts`
**Styles:** `src/components/Accordion/Accordion.styles.css`
**Types:** `src/components/Accordion/Accordion.types.ts`
**Tests:** `tests/components/Accordion.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interfaces:
  - [ ] `AccordionProps` - container configuration
  - [ ] `AccordionItemProps` - individual section configuration
  - [ ] `AccordionMode` - `'single' | 'multiple'`
- [ ] Implement base Accordion container component
- [ ] Implement AccordionItem component (header + content)
- [ ] Add single expand mode (only one open at a time)
- [ ] Add multiple expand mode (any number open)
- [ ] Add DOS-style expand indicators:
  - [ ] Collapsed: `[+]` or `►`
  - [ ] Expanded: `[-]` or `▼`
- [ ] Add header styling with box characters: `╔═══════════════╗`
- [ ] Implement expand/collapse animation (optional, instant by default)
- [ ] Add controlled/uncontrolled modes
- [ ] Add CSS styles
- [ ] Add keyboard navigation:
  - [ ] `Enter` / `Space` - toggle current section
  - [ ] `↑` / `↓` - navigate between headers
  - [ ] `Home` - first header
  - [ ] `End` - last header
- [ ] Add ARIA attributes:
  - [ ] `aria-expanded` on headers
  - [ ] `aria-controls` linking header to content
  - [ ] `role="button"` on headers (if using non-button element)
  - [ ] `aria-labelledby` on content regions
- [ ] Add `dos:accordion:toggle` custom event
- [ ] Write unit tests
- [ ] Add to Kitchen Sink demo

> **Accessibility:** Expandable sections with proper state announcements; keyboard operable headers
> **Keyboard:** Enter/Space toggle; Arrow keys navigate headers; Home/End jump

---

### 10.3 SplitPane

#### SplitPane

**File:** `src/components/SplitPane/SplitPane.ts`
**Styles:** `src/components/SplitPane/SplitPane.styles.css`
**Types:** `src/components/SplitPane/SplitPane.types.ts`
**Tests:** `tests/components/SplitPane.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interfaces:
  - [ ] `SplitPaneProps` - configuration options
  - [ ] `SplitPaneOrientation` - `'horizontal' | 'vertical'`
  - [ ] `SplitPaneSizes` - initial/min/max sizes
- [ ] Implement base SplitPane component
- [ ] Add horizontal split (left | right)
- [ ] Add vertical split (top | bottom)
- [ ] Implement resizable divider/splitter:
  - [ ] DOS-style ASCII handle: `║` or `═══`
  - [ ] Grip indicator: `┃` or `═╪═`
- [ ] Add drag-to-resize functionality
- [ ] Implement min/max size constraints per pane
- [ ] Add initial size configuration (pixels or percentage)
- [ ] Implement double-click to reset/collapse
- [ ] Add CSS styles with proper cursors (`col-resize`, `row-resize`)
- [ ] Add keyboard navigation:
  - [ ] `←` / `→` or `↑` / `↓` - resize when divider focused
  - [ ] `Home` - collapse to minimum
  - [ ] `End` - expand to maximum
- [ ] Add ARIA attributes:
  - [ ] `role="separator"` on divider
  - [ ] `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
  - [ ] `aria-orientation`
- [ ] Add `dos:splitpane:resize` custom event
- [ ] Write unit tests
- [ ] Add to Kitchen Sink demo

> **Accessibility:** Separator is keyboard operable; announces current split ratio
> **Keyboard:** Arrow keys resize; Home/End for min/max positions

---

### 10.4 CommandPalette

#### CommandPalette

**File:** `src/components/CommandPalette/CommandPalette.ts`
**Styles:** `src/components/CommandPalette/CommandPalette.styles.css`
**Types:** `src/components/CommandPalette/CommandPalette.types.ts`
**Tests:** `tests/components/CommandPalette.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interfaces:
  - [ ] `CommandPaletteProps` - configuration options
  - [ ] `CommandItem` - command definition (id, label, shortcut, action, category)
  - [ ] `CommandCategory` - grouping for commands
- [ ] Implement base CommandPalette component
- [ ] Add DOS prompt style input: `C:\>` prefix
- [ ] Implement command registration API
- [ ] Add search/filter functionality:
  - [ ] Basic substring match
  - [ ] Fuzzy search support (optional)
- [ ] Implement command categories/groups
- [ ] Add recently used commands tracking
- [ ] Display keyboard shortcuts next to commands
- [ ] Implement command execution on selection
- [ ] Add CSS styles (modal overlay appearance)
- [ ] Add keyboard navigation:
  - [ ] `Ctrl+Shift+P` or configurable - open palette
  - [ ] `↑` / `↓` - navigate results
  - [ ] `Enter` - execute selected command
  - [ ] `Escape` - close palette
  - [ ] Type to filter
- [ ] Add ARIA attributes:
  - [ ] `role="combobox"` pattern
  - [ ] `role="listbox"` for results
  - [ ] `aria-activedescendant` for selection
  - [ ] `aria-expanded`
- [ ] Add custom events:
  - [ ] `dos:commandpalette:open`
  - [ ] `dos:commandpalette:execute`
  - [ ] `dos:commandpalette:close`
- [ ] Write unit tests
- [ ] Add to Kitchen Sink demo

> **Accessibility:** Combobox pattern with live filtering; announces result count; keyboard-first design
> **Keyboard:** Ctrl+Shift+P open; Arrows navigate; Enter execute; Escape close; Type to filter

---

### 10.5 SearchInput

#### SearchInput

**File:** `src/components/SearchInput/SearchInput.ts`
**Styles:** `src/components/SearchInput/SearchInput.styles.css`
**Types:** `src/components/SearchInput/SearchInput.types.ts`
**Tests:** `tests/components/SearchInput.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interfaces:
  - [ ] `SearchInputProps` - configuration options
  - [ ] `SearchSuggestion` - autocomplete item definition
  - [ ] `SearchInputState` - internal state
- [ ] Implement base SearchInput component
- [ ] Add DOS-style search prompt/icon: `[?]` or `FIND:`
- [ ] Implement autocomplete suggestions dropdown
- [ ] Add async suggestion loading support
- [ ] Implement debounced search (configurable delay)
- [ ] Add clear button: `[X]` or `[C]`
- [ ] Implement suggestion highlighting (matched text)
- [ ] Add no-results message
- [ ] Add loading state indicator
- [ ] Add CSS styles
- [ ] Add keyboard navigation:
  - [ ] `↑` / `↓` - navigate suggestions
  - [ ] `Enter` - select suggestion or submit
  - [ ] `Escape` - close suggestions / clear
  - [ ] `Tab` - accept inline autocomplete (if applicable)
- [ ] Add ARIA attributes:
  - [ ] `role="combobox"`
  - [ ] `role="listbox"` for suggestions
  - [ ] `aria-autocomplete="list"`
  - [ ] `aria-activedescendant`
  - [ ] `aria-expanded`
  - [ ] `aria-busy` during loading
- [ ] Add custom events:
  - [ ] `dos:search:input`
  - [ ] `dos:search:select`
  - [ ] `dos:search:submit`
  - [ ] `dos:search:clear`
- [ ] Write unit tests
- [ ] Add to Kitchen Sink demo

> **Accessibility:** Combobox with listbox pattern; announces suggestion count; loading state announced
> **Keyboard:** Arrows navigate suggestions; Enter select/submit; Escape close/clear

---

### 10.6 Combobox

#### Combobox

**File:** `src/components/Combobox/Combobox.ts`
**Styles:** `src/components/Combobox/Combobox.styles.css`
**Types:** `src/components/Combobox/Combobox.types.ts`
**Tests:** `tests/components/Combobox.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interfaces:
  - [ ] `ComboboxProps` - configuration options
  - [ ] `ComboboxOption` - option definition (value, label, disabled, data)
  - [ ] `ComboboxRenderOption` - custom render function type
- [ ] Implement base Combobox component
- [ ] Add text input field with dropdown toggle
- [ ] Implement type-ahead filtering
- [ ] Add custom option rendering support
- [ ] Implement option groups
- [ ] Add disabled options support
- [ ] Implement free-form input (allow values not in list)
- [ ] Add strict mode (must match an option)
- [ ] Add CSS styles with DOS dropdown appearance
- [ ] Add keyboard navigation:
  - [ ] `↑` / `↓` - navigate options
  - [ ] `Enter` - select highlighted option
  - [ ] `Escape` - close dropdown
  - [ ] `Alt+↓` - open dropdown
  - [ ] Type to filter
- [ ] Add ARIA attributes:
  - [ ] `role="combobox"`
  - [ ] `role="listbox"` for options
  - [ ] `aria-autocomplete="list"` or `"both"`
  - [ ] `aria-activedescendant`
  - [ ] `aria-expanded`
  - [ ] `aria-haspopup="listbox"`
- [ ] Add `dos:combobox:change` custom event
- [ ] Write unit tests
- [ ] Add to Kitchen Sink demo

> **Accessibility:** Full ARIA combobox pattern; type-ahead announced; options described
> **Keyboard:** Alt+Down open; Arrows navigate; Enter select; Escape close; Type to filter

---

### 10.7 MultiSelect

#### MultiSelect

**File:** `src/components/MultiSelect/MultiSelect.ts`
**Styles:** `src/components/MultiSelect/MultiSelect.styles.css`
**Types:** `src/components/MultiSelect/MultiSelect.types.ts`
**Tests:** `tests/components/MultiSelect.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interfaces:
  - [ ] `MultiSelectProps` - configuration options
  - [ ] `MultiSelectOption` - option definition
  - [ ] `MultiSelectValue` - array of selected values
- [ ] Implement base MultiSelect component
- [ ] Add tags/chips display for selected items:
  - [ ] DOS-style: `[Option1] [Option2] [Option3]`
  - [ ] Remove button on each tag: `[Option1 ×]`
- [ ] Implement dropdown with checkboxes for options
- [ ] Add "Select All" option
- [ ] Add "Clear All" option
- [ ] Implement search/filter within dropdown
- [ ] Add max selection limit option
- [ ] Implement disabled options
- [ ] Add CSS styles
- [ ] Add keyboard navigation:
  - [ ] `↑` / `↓` - navigate options
  - [ ] `Space` - toggle option selection
  - [ ] `Enter` - close dropdown
  - [ ] `Backspace` - remove last tag (when input empty)
  - [ ] `Escape` - close dropdown
- [ ] Add ARIA attributes:
  - [ ] `role="listbox"` with `aria-multiselectable="true"`
  - [ ] `role="option"` on each option
  - [ ] `aria-selected` on options
  - [ ] `aria-checked` (if using checkbox pattern)
  - [ ] Selection count announcement
- [ ] Add `dos:multiselect:change` custom event
- [ ] Write unit tests
- [ ] Add to Kitchen Sink demo

> **Accessibility:** Multiselectable listbox pattern; announces selection count; removable tags
> **Keyboard:** Space toggle; Enter close; Backspace remove last; Arrows navigate

---

### 10.8 TagInput

#### TagInput

**File:** `src/components/TagInput/TagInput.ts`
**Styles:** `src/components/TagInput/TagInput.styles.css`
**Types:** `src/components/TagInput/TagInput.types.ts`
**Tests:** `tests/components/TagInput.test.ts`

- [ ] Create component directory structure
- [ ] Define TypeScript interfaces:
  - [ ] `TagInputProps` - configuration options
  - [ ] `Tag` - tag definition (id, label, removable)
  - [ ] `TagInputValidation` - validation function type
- [ ] Implement base TagInput component
- [ ] Add tag creation on Enter/comma/custom delimiter
- [ ] Implement tag display:
  - [ ] DOS-style: `[tag1] [tag2] [tag3]`
  - [ ] Remove button: `[tag ×]`
- [ ] Add duplicate validation (reject or allow)
- [ ] Implement custom validation function
- [ ] Add max tags limit
- [ ] Implement tag suggestions/autocomplete (optional)
- [ ] Add paste handling (split by delimiter)
- [ ] Add CSS styles
- [ ] Add keyboard navigation:
  - [ ] `Enter` / `,` - create tag from input
  - [ ] `Backspace` - remove last tag (when input empty)
  - [ ] `←` / `→` - navigate between tags
  - [ ] `Delete` - remove focused tag
  - [ ] `Escape` - clear input / deselect tag
- [ ] Add ARIA attributes:
  - [ ] `role="list"` for tag container
  - [ ] `role="listitem"` for each tag
  - [ ] Announce tag added/removed
  - [ ] Error announcements for validation
- [ ] Add custom events:
  - [ ] `dos:taginput:add`
  - [ ] `dos:taginput:remove`
  - [ ] `dos:taginput:invalid`
- [ ] Write unit tests
- [ ] Add to Kitchen Sink demo

> **Accessibility:** List pattern for tags; announces add/remove; validation errors announced
> **Keyboard:** Enter/comma create; Backspace remove last; Arrows navigate tags; Delete remove

---

### Phase 10 Checkpoint

- [ ] All Phase 10 components implemented
- [ ] All Phase 10 tests passing
- [ ] All Phase 10 demos added to Kitchen Sink
- [ ] Code review completed

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
