# Components

DOSage provides a comprehensive set of components for building DOS-style interfaces.

## Component Categories

### Layout
Components for structuring your application layout.

| Component | Description |
|-----------|-------------|
| [Container](./layout/container.md) | Content wrapper with configurable padding and max-width |
| [Panel](./layout/panel.md) | DOS-style bordered panel with optional title |
| [Box](./layout/box.md) | Flexible box with padding and margin options |
| [Grid](./layout/grid.md) | CSS Grid-based layout component |
| [Divider](./layout/divider.md) | Horizontal or vertical line separator |
| [Separator](./layout/separator.md) | Visual separator with optional label |

### Typography
Text display and formatting components.

| Component | Description |
|-----------|-------------|
| [Heading](./typography/heading.md) | h1-h6 headings with DOS styling |
| [Text](./typography/text.md) | Styled text with size/weight variants |
| [Code](./typography/code.md) | Inline code formatting |
| [CodeBlock](./typography/codeblock.md) | Multi-line code display |
| [Blockquote](./typography/blockquote.md) | Styled quotation blocks |
| [List](./typography/list.md) | Ordered/unordered lists |
| [DefinitionList](./typography/definitionlist.md) | Term/definition pairs |
| [Label](./typography/label.md) | Form labels |
| [ASCIIArt](./typography/asciiart.md) | ASCII art display |

### Form Controls
Input and selection components.

| Component | Description |
|-----------|-------------|
| [Button](./form-controls/button.md) | Clickable button with variants |
| [ButtonGroup](./form-controls/buttongroup.md) | Grouped buttons |
| [IconButton](./form-controls/iconbutton.md) | Square button with icon |
| [Link](./form-controls/link.md) | Hyperlink component |
| [TextInput](./form-controls/textinput.md) | Single-line text input |
| [Textarea](./form-controls/textarea.md) | Multi-line text input |
| [PasswordInput](./form-controls/passwordinput.md) | Password input with toggle |
| [Checkbox](./form-controls/checkbox.md) | Checkbox input |
| [RadioButton](./form-controls/radiobutton.md) | Radio button group |
| [Select](./form-controls/select.md) | Dropdown selection |
| [Slider](./form-controls/slider.md) | Range slider |
| [Toggle](./form-controls/toggle.md) | On/off switch |
| [FileInput](./form-controls/fileinput.md) | File upload |
| [DatePicker](./form-controls/datepicker.md) | Date selection |
| [TimePicker](./form-controls/timepicker.md) | Time selection |

### Feedback
User notification and status components.

| Component | Description |
|-----------|-------------|
| [Alert](./feedback/alert.md) | Alert messages |
| [Toast](./feedback/toast.md) | Toast notifications |
| [ProgressBar](./feedback/progressbar.md) | Progress indicator |
| [LoadingSpinner](./feedback/loadingspinner.md) | Loading animation |
| [SkeletonLoader](./feedback/skeletonloader.md) | Content placeholder |
| [Tooltip](./feedback/tooltip.md) | Hover tooltips |
| [Popover](./feedback/popover.md) | Click-triggered popover |

### Navigation
Navigation and routing components.

| Component | Description |
|-----------|-------------|
| [Breadcrumbs](./navigation/breadcrumbs.md) | Breadcrumb navigation |
| [Pagination](./navigation/pagination.md) | Page navigation |
| [MenuBar](./navigation/menubar.md) | Horizontal menu |
| [ContextMenu](./navigation/contextmenu.md) | Right-click menu |
| [DropdownMenu](./navigation/dropdownmenu.md) | Dropdown menu |
| [Sidebar](./navigation/sidebar.md) | Collapsible sidebar |
| [Tabs](./navigation/tabs.md) | Tab navigation |

### Data Display
Components for displaying data and content.

| Component | Description |
|-----------|-------------|
| [Table](./data-display/table.md) | Data table |
| [DataGrid](./data-display/datagrid.md) | Advanced data grid |
| [Card](./data-display/card.md) | Content card |
| [Badge](./data-display/badge.md) | Status badge |
| [Avatar](./data-display/avatar.md) | User avatar |
| [ListBox](./data-display/listbox.md) | Selectable list |
| [TreeView](./data-display/treeview.md) | Tree structure |
| [Timeline](./data-display/timeline.md) | Event timeline |
| [EmptyState](./data-display/emptystate.md) | Empty state placeholder |

### Overlays
Modal and overlay components.

| Component | Description |
|-----------|-------------|
| [Modal](./overlays/modal.md) | Modal dialog |
| [Window](./overlays/window.md) | Draggable window |

### Advanced
Advanced interactive components.

| Component | Description |
|-----------|-------------|
| [Accordion](./advanced/accordion.md) | Expandable sections |
| [SplitPane](./advanced/splitpane.md) | Resizable split layout |
| [CommandPalette](./advanced/commandpalette.md) | Command search |
| [SearchInput](./advanced/searchinput.md) | Search with autocomplete |
| [Combobox](./advanced/combobox.md) | Combined input/dropdown |
| [MultiSelect](./advanced/multiselect.md) | Multi-selection |
| [TagInput](./advanced/taginput.md) | Tag input |
| [Stepper](./advanced/stepper.md) | Multi-step wizard |

### Utilities
Helper components for advanced patterns.

| Component | Description |
|-----------|-------------|
| [Portal](./utilities/portal.md) | Render in different location |
| [FocusTrap](./utilities/focustrap.md) | Trap focus within element |
| [KeyboardShortcutHandler](./utilities/keyboardshortcuthandler.md) | Keyboard shortcuts |
| [ScrollArea](./utilities/scrollarea.md) | Custom scrollbars |
| [Resizable](./utilities/resizable.md) | Resizable container |
| [Draggable](./utilities/draggable.md) | Drag-and-drop |
| [VisuallyHidden](./utilities/visuallyhidden.md) | Screen reader content |

---

## Component Patterns

### Creating Components

All components follow a similar pattern:

```typescript
import { createComponentName } from 'dosage';
import type { ComponentNameProps } from 'dosage';

const props: ComponentNameProps = {
  // Configure the component
};

const element = createComponentName(props);
document.body.appendChild(element);
```

### Common Props

Most components share these common props:

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Additional CSS classes |
| `id` | `string` | Element ID |

### Events

Interactive components emit custom events:

```typescript
element.addEventListener('dos:componentname:eventname', (event) => {
  const detail = event.detail;
  // Handle event
});
```

### Component Methods

Many components expose methods for programmatic control:

```typescript
const modal = createModal({ title: 'Example' });

// Methods available on the element
modal.open();
modal.close();
modal.setTitle('New Title');
modal.destroy();
```

---

## Accessibility

All components follow WCAG 2.1 AA guidelines:

- Keyboard accessible
- ARIA attributes
- Visible focus states
- Screen reader support

See individual component documentation for specific accessibility features.
