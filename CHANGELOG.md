# Changelog

All notable changes to DOSage will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- TreeView: Fixed ghost/duplicate brackets appearing behind expand/collapse icons due to CSS ::before pseudo-elements duplicating JavaScript textContent

### Added
- Initial release preparation

---

## [0.1.0] - 2026-01-24

### Added

#### Core Infrastructure
- Project foundation with TypeScript strict mode
- Vite build configuration for ESM and CJS
- CSS custom properties theming system
- ThemeManager for runtime theme switching
- Four preset themes: DOS Blue, Amber, Green Phosphor, CGA
- Theme persistence to localStorage

#### Layout Components
- Container - Content wrapper with configurable padding
- Panel - DOS-style bordered panel with title support
- Box - Flexible box component with padding/margin options
- Grid - CSS Grid-based layout component
- Divider - Horizontal/vertical line separator
- Separator - Visual separator with optional label

#### Typography Components
- Heading - h1-h6 headings with DOS styling
- Text - Styled text with size/weight variants
- Code - Inline code formatting
- CodeBlock - Multi-line code with syntax highlighting
- Blockquote - Styled quotation blocks
- List - Ordered/unordered lists with DOS bullets
- DefinitionList - Term/definition pairs
- Label - Form labels with required indicator
- ASCIIArt - Display ASCII art with proper formatting

#### Form Controls
- Button - Primary/secondary/danger/ghost variants with loading state
- ButtonGroup - Group buttons horizontally/vertically
- IconButton - Square button with icon
- Link - DOS-style hyperlinks
- TextInput - Single-line text input with validation
- Textarea - Multi-line text input
- PasswordInput - Password field with show/hide toggle
- Checkbox - DOS-style checkbox with indeterminate state
- RadioButton - Radio buttons with group support
- Select - Dropdown selection component
- Slider - Range input with tick marks
- Toggle - On/off switch component
- FormGroup - Fieldset with legend
- FormValidation - Error/success message display
- FileInput - File upload component
- DatePicker - Date selection component
- TimePicker - Time selection component

#### Feedback Components
- Alert - Dismissible alert messages
- Toast - Toast notifications with auto-dismiss
- ProgressBar - Determinate/indeterminate progress
- LoadingSpinner - ASCII spinning animation
- SkeletonLoader - Content placeholder animation
- Tooltip - Hover/focus tooltips
- Popover - Click-triggered popover content

#### Navigation Components
- Breadcrumbs - Navigation breadcrumb trail
- Pagination - Page navigation controls
- MenuBar - Horizontal menu bar
- ContextMenu - Right-click context menu
- DropdownMenu - Dropdown menu component
- Sidebar - Collapsible sidebar navigation

#### Data Display Components
- Table - Data table with sorting/filtering
- DataGrid - Advanced data grid
- Card - Content card with header/footer
- Badge - Status badges
- Avatar - User avatar display
- Window - Draggable/resizable window
- Modal - Modal dialog with focus trap
- ListBox - Selectable list component
- TreeView - Hierarchical tree view
- Timeline - Event timeline display
- EmptyState - Empty/no-data placeholder
- Stepper - Multi-step progress indicator

#### Advanced Interactive Components
- Tabs - Tab panels with keyboard navigation
- Accordion - Expandable/collapsible sections
- SplitPane - Resizable split layout
- CommandPalette - Keyboard-driven command search
- SearchInput - Search with autocomplete
- Combobox - Combined input/dropdown
- MultiSelect - Multi-selection dropdown
- TagInput - Tag/chip input component

#### Utility Components
- Portal - Render content in different DOM location
- FocusTrap - Trap focus within element
- KeyboardShortcutHandler - Global keyboard shortcuts
- ScrollArea - Custom scrollbar styling
- Resizable - Resizable container
- Draggable - Drag-and-drop functionality
- VisuallyHidden - Screen reader only content

#### Validation Utilities
- `validators.required()` - Required field validation
- `validators.email()` - Email format validation
- `validators.minLength()` - Minimum length validation
- `validators.maxLength()` - Maximum length validation
- `validators.pattern()` - Regex pattern validation
- `validators.matches()` - Field comparison validation
- `validators.compose()` - Combine validators

#### Documentation
- Getting Started guide
- Theming guide with CSS custom properties reference
- API documentation with TypeDoc
- Kitchen Sink demo application

### Accessibility
- Full ARIA support for all interactive components
- Keyboard navigation for all components
- High contrast focus indicators
- Screen reader announcements
- Skip link support

### Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

---

## Release Notes Format

### Types of Changes

- **Added** - New features
- **Changed** - Changes in existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security vulnerability fixes

---

[Unreleased]: https://github.com/your-repo/dosage/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-repo/dosage/releases/tag/v0.1.0
