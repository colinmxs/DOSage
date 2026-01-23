# Contributing to DOSage

Thank you for your interest in contributing to DOSage! This document provides guidelines and instructions for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/DOSage.git
   cd DOSage
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a new branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Kitchen Sink Demo

The Kitchen Sink demo app is the primary way to develop and test components:

```bash
npm run dev
```

This will start a development server at http://localhost:3000 with hot-reload enabled.

### Building the Library

To build the library for distribution:

```bash
npm run build
```

This creates:
- ESM build in `dist/esm/`
- CJS build in `dist/cjs/`
- Type definitions in `dist/types/`
- CSS styles in `dist/`

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm test:ci
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Component Development Guidelines

### 1. Follow the DOS Aesthetic

- Use monospace fonts exclusively
- Sharp edges, no rounded corners
- High-contrast colors
- Blocky, pixelated appearance
- Grid-aligned layouts

### 2. TypeScript First

- All code must be written in TypeScript
- No `any` types unless absolutely necessary
- Export all public types and interfaces
- Provide comprehensive JSDoc comments

### 3. Accessibility

Despite the retro aesthetic, all components must be accessible:
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader friendly
- Focus indicators
- Semantic HTML

### 4. Zero Dependencies

The core library should have zero runtime dependencies. Dev dependencies are acceptable.

### 5. Theme Integration

All components must:
- Use CSS custom properties from the theme system
- Work with all preset themes
- Support custom themes

### 6. Testing

Every component should have:
- Unit tests for component logic
- Tests for keyboard interactions
- Tests for ARIA attributes
- Tests for theme integration

### 7. Documentation

When adding a component:
1. Add it to the Kitchen Sink demo with:
   - Live rendered example
   - Code snippets
   - All variants demonstrated
   - Interactive controls where applicable
2. Document props and API in JSDoc comments
3. Update README if adding major features

## Code Style

We use ESLint and Prettier for code formatting. Run `npm run format` before committing.

### Naming Conventions

- **Files**: camelCase for implementation files, PascalCase for component files
- **Classes**: PascalCase
- **Functions**: camelCase
- **Constants**: SCREAMING_SNAKE_CASE for true constants, camelCase for config objects
- **CSS Classes**: kebab-case with `dosage-` prefix

### File Structure

```
src/
├── components/          # Component implementations
│   ├── Button/
│   │   ├── Button.ts   # Component logic
│   │   ├── types.ts    # TypeScript interfaces
│   │   └── styles.css  # Component styles
│   └── ...
├── styles/             # Global styles
├── utils/              # Utility functions
└── index.ts            # Main export file
```

## Pull Request Process

1. **Create an issue** first to discuss major changes
2. **Update tests** for your changes
3. **Update documentation** including Kitchen Sink demos
4. **Run all checks**:
   ```bash
   npm run build
   npm test
   npm run lint
   ```
5. **Write a clear PR description**:
   - What does this change do?
   - Why is it needed?
   - How to test it?
   - Screenshots for UI changes
6. **Keep PRs focused** - one feature or fix per PR
7. **Update the PR description** if you make significant changes

## Adding a New Component

Here's a checklist for adding a new component:

- [ ] Create component implementation in `src/components/ComponentName/`
- [ ] Define TypeScript interfaces for props
- [ ] Implement component logic
- [ ] Add CSS styles using theme variables
- [ ] Implement keyboard navigation
- [ ] Add ARIA attributes
- [ ] Write unit tests
- [ ] Add to Kitchen Sink demo:
  - [ ] Create showcase section
  - [ ] Add live examples
  - [ ] Show all variants
  - [ ] Display code snippets
- [ ] Export from main `index.ts`
- [ ] Document in README if major component
- [ ] Verify theme switching works
- [ ] Test accessibility

## Questions?

If you have questions or need help, please:
- Open an issue for discussion
- Check existing issues and PRs
- Review the specification in `planning/spec-prompt.md`

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
