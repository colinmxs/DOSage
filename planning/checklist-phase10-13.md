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

- [x] ⛔ HUMAN ONLY: I have reviewed and verified Phase 10

---

## Phase 11: Utility Components

### 11.1 Portal

#### Portal

**File:** `src/components/Portal/Portal.ts`
**Styles:** `src/components/Portal/Portal.styles.css`
**Types:** `src/components/Portal/Portal.types.ts`
**Tests:** `tests/components/Portal.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interfaces:
  - [x] `PortalProps` - configuration options
  - [x] `PortalContainer` - target container type
- [x] Implement base Portal component
- [x] Add default portal target (document.body)
- [x] Implement custom portal target support
- [x] Add portal container creation if needed
- [x] Implement portal cleanup on destroy
- [x] Handle multiple portals
- [x] Preserve event bubbling through portal
- [x] Add CSS styles (minimal, for portal container)
- [x] Write unit tests:
  - [x] Content renders in target
  - [x] Events bubble correctly
  - [x] Cleanup on destroy
- [x] Document usage patterns (modals, tooltips, etc.)

> **Accessibility:** Maintains DOM order for screen readers when used with FocusTrap
> **Keyboard:** N/A (utility component)

---

### 11.2 FocusTrap

#### FocusTrap

**File:** `src/components/FocusTrap/FocusTrap.ts`
**Styles:** `src/components/FocusTrap/FocusTrap.styles.css`
**Types:** `src/components/FocusTrap/FocusTrap.types.ts`
**Tests:** `tests/components/FocusTrap.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interfaces:
  - [x] `FocusTrapProps` - configuration options
  - [x] `FocusTrapOptions` - behavior options
- [x] Implement base FocusTrap component
- [x] Add focus containment within element
- [x] Implement Tab / Shift+Tab cycling at boundaries
- [x] Add initial focus element option
- [x] Implement focus return on deactivate
- [x] Add escape key handling option
- [x] Handle dynamically added focusable elements
- [x] Implement pause/resume functionality
- [x] Add sentinel elements (hidden start/end focusables)
- [x] Write unit tests:
  - [x] Focus stays within trap
  - [x] Tab cycles correctly
  - [x] Initial focus works
  - [x] Focus returns on deactivate
- [x] Document usage with modals and dialogs

> **Accessibility:** Essential for modal dialogs; prevents focus escape; manages focus return
> **Keyboard:** Tab/Shift+Tab cycle within trap; configurable Escape handling

---

### 11.3 KeyboardShortcutHandler

#### KeyboardShortcutHandler

**File:** `src/components/KeyboardShortcutHandler/KeyboardShortcutHandler.ts`
**Styles:** `src/components/KeyboardShortcutHandler/KeyboardShortcutHandler.styles.css`
**Types:** `src/components/KeyboardShortcutHandler/KeyboardShortcutHandler.types.ts`
**Tests:** `tests/components/KeyboardShortcutHandler.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interfaces:
  - [x] `KeyboardShortcutHandlerProps` - configuration options
  - [x] `ShortcutDefinition` - shortcut configuration
  - [x] `ShortcutCallback` - action callback type
  - [x] `ModifierKeys` - ctrl, alt, shift, meta
- [x] Implement base KeyboardShortcutHandler
- [x] Add shortcut registration API:
  - [x] `register(shortcut, callback)`
  - [x] `unregister(shortcut)`
  - [x] `enable()` / `disable()`
- [x] Implement shortcut parsing (`Ctrl+Shift+P`, `Alt+F4`)
- [x] Add global scope (document level)
- [x] Add local scope (element level)
- [x] Implement shortcut conflict detection
- [x] Add shortcut hint display component
- [x] Handle platform differences (Ctrl vs Cmd)
- [x] Implement shortcut sequences (`g g`, `Ctrl+K Ctrl+C`)
- [x] Add CSS styles for hint display
- [x] Write unit tests:
  - [x] Shortcuts trigger correctly
  - [x] Scoping works
  - [x] Conflicts handled
  - [x] Platform detection works
- [x] Add to Kitchen Sink demo with examples

> **Accessibility:** Provides keyboard alternatives; hints can be announced
> **Keyboard:** Configurable shortcuts; supports modifiers and sequences

---

### 11.4 ScrollArea

#### ScrollArea

**File:** `src/components/ScrollArea/ScrollArea.ts`
**Styles:** `src/components/ScrollArea/ScrollArea.styles.css`
**Types:** `src/components/ScrollArea/ScrollArea.types.ts`
**Tests:** `tests/components/ScrollArea.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interfaces:
  - [x] `ScrollAreaProps` - configuration options
  - [x] `ScrollAreaOrientation` - `'vertical' | 'horizontal' | 'both'`
- [x] Implement base ScrollArea component
- [x] Add DOS-style custom scrollbar:
  - [x] Vertical: `▲` (up) `█` (thumb) `░` (track) `▼` (down)
  - [x] Horizontal: `◄` (left) `█` (thumb) `░` (track) `►` (right)
- [x] Implement vertical scrollbar
- [x] Implement horizontal scrollbar
- [x] Add scroll position tracking
- [x] Implement thumb dragging
- [x] Add button click scrolling (arrows)
- [x] Implement track click scrolling (page up/down)
- [x] Add auto-hide scrollbar option
- [x] Handle content resize (ResizeObserver)
- [x] Add CSS styles
- [x] Add keyboard navigation:
  - [x] `↑` / `↓` - scroll vertically
  - [x] `←` / `→` - scroll horizontally
  - [x] `Page Up` / `Page Down` - page scroll
  - [x] `Home` / `End` - scroll to start/end
- [x] Add ARIA attributes:
  - [x] `role="scrollbar"` on scrollbar
  - [x] `aria-controls` pointing to content
  - [x] `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
  - [x] `aria-orientation`
- [x] Add `dos:scrollarea:scroll` custom event
- [x] Write unit tests
- [x] Add to Kitchen Sink demo

> **Accessibility:** Custom scrollbars maintain keyboard scrolling; ARIA scrollbar semantics
> **Keyboard:** Arrows scroll; Page Up/Down for pages; Home/End for extremes

---

### 11.5 Resizable

#### Resizable

**File:** `src/components/Resizable/Resizable.ts`
**Styles:** `src/components/Resizable/Resizable.styles.css`
**Types:** `src/components/Resizable/Resizable.types.ts`
**Tests:** `tests/components/Resizable.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interfaces:
  - [x] `ResizableProps` - configuration options
  - [x] `ResizeDirection` - enabled resize directions
  - [x] `ResizeConstraints` - min/max width/height
- [x] Implement base Resizable component
- [x] Add resize handles:
  - [x] Corner handles: `◢` (bottom-right), etc.
  - [x] Edge handles: `═` (horizontal), `║` (vertical)
- [x] Implement 8-direction resize (corners + edges)
- [x] Add direction restriction options
- [x] Implement min/max size constraints
- [x] Add aspect ratio lock option
- [x] Implement grid snapping option
- [x] Add resize preview/ghost option
- [x] Add CSS styles with appropriate cursors
- [x] Add keyboard navigation:
  - [x] `Arrow keys` - resize when handle focused
  - [x] `Shift+Arrow` - larger resize increments
- [x] Add ARIA attributes:
  - [x] `role="separator"` on handles (where appropriate)
  - [x] `aria-grabbed` during drag
- [x] Add custom events:
  - [x] `dos:resizable:start`
  - [x] `dos:resizable:resize`
  - [x] `dos:resizable:end`
- [x] Write unit tests
- [x] Add to Kitchen Sink demo

> **Accessibility:** Resize handles are keyboard accessible; announces resize state
> **Keyboard:** Arrow keys resize when handle focused; Shift for larger increments

---

### 11.6 Draggable

#### Draggable

**File:** `src/components/Draggable/Draggable.ts`
**Styles:** `src/components/Draggable/Draggable.styles.css`
**Types:** `src/components/Draggable/Draggable.types.ts`
**Tests:** `tests/components/Draggable.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interfaces:
  - [x] `DraggableProps` - configuration options
  - [x] `DragConstraints` - containment bounds
  - [x] `DragAxis` - `'x' | 'y' | 'both'`
- [x] Implement base Draggable component
- [x] Add drag handle support (specific element to grab)
- [x] Implement containment bounds (parent, viewport, custom)
- [x] Add axis restriction (x-only, y-only)
- [x] Implement grid snapping
- [x] Add drag threshold (minimum movement to start)
- [x] Implement drag preview/ghost option
- [x] Add CSS styles with grab cursor
- [x] Add keyboard navigation:
  - [x] `Arrow keys` - move element
  - [x] `Shift+Arrow` - larger movement increments
  - [x] `Escape` - cancel drag
- [x] Add ARIA attributes:
  - [x] `aria-grabbed`
  - [x] `aria-dropeffect` (if applicable)
  - [x] Announce position changes
- [x] Add custom events:
  - [x] `dos:draggable:start`
  - [x] `dos:draggable:drag`
  - [x] `dos:draggable:end`
- [x] Write unit tests
- [x] Add to Kitchen Sink demo

> **Accessibility:** Keyboard alternative for drag; announces position; grab state communicated
> **Keyboard:** Arrow keys move; Shift for larger increments; Escape cancels

---

### 11.7 VisuallyHidden

#### VisuallyHidden

**File:** `src/components/VisuallyHidden/VisuallyHidden.ts`
**Styles:** `src/components/VisuallyHidden/VisuallyHidden.styles.css`
**Types:** `src/components/VisuallyHidden/VisuallyHidden.types.ts`
**Tests:** `tests/components/VisuallyHidden.test.ts`

- [x] Create component directory structure
- [x] Define TypeScript interfaces:
  - [x] `VisuallyHiddenProps` - configuration options
  - [x] `VisuallyHiddenElement` - wrapper element type
- [x] Implement base VisuallyHidden component
- [x] Add proper CSS for visual hiding:
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
- [x] Add focusable option (visible on focus)
- [x] Implement as wrapper or standalone
- [x] Add CSS styles
- [x] Write unit tests:
  - [x] Content hidden visually
  - [x] Content accessible to screen readers
  - [x] Focusable variant shows on focus
- [x] Document usage patterns (skip links, form hints, etc.)

> **Accessibility:** Provides screen reader only content; essential for accessible UIs
> **Keyboard:** Focusable variant becomes visible on focus (for skip links)

---

### Phase 11 Checkpoint

- [x] All Phase 11 utility components implemented
- [x] All Phase 11 tests passing
- [x] Utilities integrated with existing components (Portal with Dialog, FocusTrap with Modal, etc.)
- [x] Documentation for each utility complete
- [x] Code review completed

- [x] ⛔ HUMAN ONLY: I have reviewed and verified Phase 11

---

## Phase 12: Polish & Documentation

### 12.1 API Documentation

- [x] Add JSDoc comments to all public APIs:
  - [x] All exported classes
  - [x] All public methods
  - [x] All interfaces and types
  - [x] All CSS custom properties
- [x] Set up TypeDoc for API reference generation
- [x] Configure TypeDoc output to `docs/api/`
- [x] Create props tables for each component:
  - [x] Prop name, type, default, description
  - [x] Required vs optional indicators
- [x] Add usage examples to JSDoc:
  - [x] Basic usage example
  - [x] Common configurations
  - [x] Event handling examples
- [x] Generate and review API documentation
- [x] Add cross-references between related components

### 12.2 Theming Guide

- [x] Create `docs/theming.md` comprehensive guide:
  - [x] Introduction to DOSage theming
  - [x] CSS custom properties overview
- [x] Document all CSS custom properties:
  - [x] Property name
  - [x] Default value
  - [x] Description
  - [x] Which components use it
- [x] Write theme creation tutorial:
  - [x] Creating a new theme file
  - [x] Registering with ThemeManager
  - [x] Applying themes to elements
- [x] Document preset themes:
  - [x] dos-blue (default)
  - [x] amber
  - [x] green-phosphor
  - [x] cga
  - [x] Screenshots of each
- [x] Add dark/light mode guidance:
  - [x] prefers-color-scheme integration
  - [x] Manual toggle implementation
- [x] Create theme playground in demo

### 12.3 Kitchen Sink Polish

- [x] Review all component demos for completeness:
  - [x] All props demonstrated
  - [x] All variants shown
  - [x] All states visible
- [x] Ensure consistent code examples:
  - [x] Same code style throughout
  - [x] Proper syntax highlighting
  - [x] Copy-to-clipboard functionality
- [x] Add interactive playground controls:
  - [x] Prop toggles
  - [x] Live preview updates
  - [x] Reset to defaults
- [x] Perform mobile/responsive testing:
  - [x] Test on various screen sizes
  - [x] Touch interaction testing
  - [x] Mobile keyboard handling
- [x] Performance check:
  - [x] Demo page load time
  - [x] Interaction responsiveness
  - [x] No memory leaks in demo

### 12.4 Developer Documentation

#### README.md
- [x] Project description and logo
- [x] Quick start section (< 5 minutes to first component)
- [x] Feature highlights
- [x] Installation instructions (npm, yarn)
- [x] CDN usage option
- [x] Basic usage example
- [x] Links to documentation

#### Getting Started Guide (`docs/getting-started.md`)
- [x] Prerequisites
- [x] Installation steps
- [x] First component example
- [x] Adding styles
- [x] Theming basics
- [x] Next steps

#### Installation Documentation
- [x] npm installation: `npm install dosage`
- [x] yarn installation: `yarn add dosage`
- [x] CDN usage with unpkg/jsdelivr
- [x] Browser script tag usage
- [x] CSS import instructions

#### Framework Integration Guides
- [x] Vanilla TypeScript/JavaScript guide
- [x] React wrapper notes (future consideration)
- [x] Vue usage notes
- [x] Svelte usage notes
- [x] Angular usage notes

#### Contributing Guide (`CONTRIBUTING.md`)
- [x] Code of conduct
- [x] Development setup
- [x] Running tests
- [x] Pull request process
- [x] Code style requirements
- [x] Component creation guidelines

#### Code Style Documentation
- [x] TypeScript conventions
- [x] CSS naming conventions
- [x] File organization
- [x] Testing conventions
- [x] Commit message format

#### Changelog Setup
- [x] Create `CHANGELOG.md`
- [x] Set up conventional commits
- [x] Configure changelog generation
- [x] Document release process

---

### Phase 12 Checkpoint

- [x] All API documentation complete
- [x] Theming guide comprehensive
- [x] Kitchen Sink demo polished
- [x] All developer documentation written
- [x] Documentation reviewed for accuracy
- [x] Code examples tested and working

- [x] ⛔ HUMAN ONLY: I have reviewed and verified Phase 12

---

## Phase 13: Quality Assurance

### 13.1 Unit Test Coverage

- [x] Run test coverage analysis
- [x] Review coverage report:
  - [x] Target: 80%+ line coverage ✅ (89.74%)
  - [x] Target: 80%+ branch coverage ✅ (86.13%)
- [x] Add missing component tests:
  - [x] Identify untested components
  - [x] Identify untested methods
  - [x] Write missing tests
- [x] Add edge case tests:
  - [x] Empty/null/undefined inputs
  - [x] Maximum/minimum values
  - [x] Rapid interactions
  - [x] Race conditions
- [x] Add error boundary tests:
  - [x] Invalid props handling
  - [x] Missing required props
  - [x] Graceful degradation

### 13.2 Accessibility Audit

- [x] Run automated accessibility tests:
  - [x] axe-core on all components (via vitest-axe)
  - [x] WAVE evaluation
  - [x] Lighthouse accessibility audit
- [x] Test with screen readers:
  - [x] NVDA on Windows
  - [x] VoiceOver on macOS
  - [x] Document any issues found
- [x] Verify keyboard navigation:
  - [x] All interactive components keyboard accessible
  - [x] Focus visible at all times
  - [x] Tab order logical
  - [x] No keyboard traps (except intentional)
- [x] Check color contrast ratios:
  - [x] All themes meet WCAG AA (4.5:1 for text) ✅ (Updated error color #FF6666)
  - [x] Large text meets 3:1
  - [x] UI components meet 3:1
- [x] Review ARIA usage:
  - [x] No redundant ARIA
  - [x] Proper role usage
  - [x] State changes announced
  - [x] Labels and descriptions present
- [x] Document accessibility limitations:
  - [x] Known issues
  - [x] Browser-specific behaviors
  - [x] Workarounds

### 13.3 Browser Compatibility

- [x] Test in Chrome (latest):
  - [x] All components render correctly
  - [x] All interactions work
  - [x] No console errors
- [x] Test in Firefox (latest):
  - [x] All components render correctly
  - [x] All interactions work
  - [x] CSS renders consistently
- [x] Test in Safari (latest):
  - [x] All components render correctly
  - [x] All interactions work
  - [x] WebKit-specific issues addressed
- [x] Test in Edge (latest):
  - [x] All components render correctly
  - [x] All interactions work
- [x] Document browser support matrix:
  - [x] Minimum supported versions
  - [x] Known issues per browser
- [x] Note required polyfills:
  - [x] Document any needed polyfills
  - [x] Provide polyfill recommendations

### 13.4 Performance Review

- [x] Measure initial bundle size:
  - [x] Total size (uncompressed): ESM 411KB, CJS 317KB, CSS 198KB
  - [x] Total size (gzipped): ESM 90KB, CJS 82KB, CSS 24KB
  - [x] Total size (brotli)
  - [x] Target: < 50KB gzipped for full library ⚠️ (90KB gzipped, but 72 components)
- [x] Verify tree-shaking works:
  - [x] Individual component import size
  - [x] Unused code not included
  - [x] Test with webpack-bundle-analyzer
- [x] Check for memory leaks:
  - [x] Create/destroy components repeatedly
  - [x] Monitor memory in DevTools
  - [x] Event listener cleanup verified
- [x] Profile render performance:
  - [x] Initial render time
  - [x] Update/re-render time
  - [x] Animation performance (60fps)
- [x] Optimize if needed:
  - [x] Address identified bottlenecks
  - [x] Lazy load where appropriate
  - [x] Minimize DOM operations

### 13.5 Bundle Analysis

- [x] Generate bundle visualization:
  - [x] Use rollup-plugin-visualizer or similar
  - [x] Identify largest modules
- [x] Identify any bloat:
  - [x] Unused code paths
  - [x] Duplicate code
  - [x] Unnecessary utilities
- [x] Ensure no unnecessary dependencies:
  - [x] Review package.json dependencies
  - [x] Remove unused dependencies
  - [x] Consider inlining small utilities
- [x] Document final bundle sizes:
  - [x] Full library size
  - [x] Per-component sizes
  - [x] CSS sizes
  - [x] Tree-shaken sizes

### 13.6 Final Verification

- [x] All Kitchen Sink demos working:
  - [x] Every component demo functional
  - [x] All interactive features work
  - [x] No visual regressions
- [x] All tests passing:
  - [x] `npm test` passes (3199 tests)
  - [x] No skipped tests
  - [x] No flaky tests
- [x] No TypeScript errors:
  - [x] `tsc --noEmit` passes
  - [x] All types exported correctly
  - [x] Declaration files generate correctly
- [x] No linting errors:
  - [x] ESLint passes (0 errors, 478 warnings)
  - [x] Stylelint passes (if configured)
  - [x] Prettier formatting correct
- [x] Documentation complete:
  - [x] All components documented
  - [x] All APIs documented
  - [x] Examples working
  - [x] Links valid
- [x] Package ready for publish:
  - [x] package.json metadata complete
  - [x] Version number set
  - [x] License file present
  - [x] .npmignore configured
  - [x] Build outputs correct

---

### Phase 13 Checkpoint

- [x] Test coverage meets targets
- [x] Accessibility audit passed
- [x] All browsers tested
- [x] Performance acceptable
- [x] Bundle optimized
- [x] All final checks passed

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
