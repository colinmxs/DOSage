# API Reference

This directory contains auto-generated API documentation for DOSage.

## Generating Documentation

To regenerate the API documentation, run:

```bash
npm run docs
```

This uses [TypeDoc](https://typedoc.org/) to generate documentation from the source code and JSDoc comments.

## Documentation Structure

The generated documentation includes:

- **Classes** - ThemeManager, Component base classes
- **Functions** - All `createComponent()` factory functions
- **Interfaces** - All prop types and configuration interfaces
- **Types** - Type aliases and union types
- **Variables** - Exported constants

## Quick Links

### Components

Each component has a `createComponentName()` function and corresponding `ComponentNameProps` interface:

- [Button](./functions/createButton.html) - `createButton(props: ButtonProps)`
- [Panel](./functions/createPanel.html) - `createPanel(props: PanelProps)`
- [Modal](./functions/createModal.html) - `createModal(props: ModalProps)`
- ... and many more

### Themes

- [ThemeManager](./classes/ThemeManager.html) - Theme management class
- [ThemeConfig](./interfaces/ThemeConfig.html) - Theme configuration interface
- [ThemePreset](./types/ThemePreset.html) - Available preset themes

### Types

- [BaseComponentProps](./interfaces/BaseComponentProps.html) - Common component props
- [SpacingValue](./types/SpacingValue.html) - Spacing value type
- [BoxBorderStyle](./types/BoxBorderStyle.html) - Border style options

### Validators

- [validators](./variables/validators.html) - Form validation utilities
- [ValidationResult](./interfaces/ValidationResult.html) - Validation result type
- [ValidatorFn](./types/ValidatorFn.html) - Validator function type

## Versioning

This documentation corresponds to DOSage version **0.1.0**.

For documentation of other versions, check the GitHub releases or build from source.

## Contributing

To improve API documentation:

1. Add or update JSDoc comments in the source code
2. Regenerate documentation with `npm run docs`
3. Submit a pull request

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.
