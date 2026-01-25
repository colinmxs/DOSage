# Contributing to DOSage

Thank you for your interest in contributing to DOSage! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Running Tests](#running-tests)
- [Branch Naming Conventions](#branch-naming-conventions)
- [Pull Request Process](#pull-request-process)
- [Code Style Requirements](#code-style-requirements)
- [Component Creation Guidelines](#component-creation-guidelines)
- [Commit Message Format](#commit-message-format)

---

## Code of Conduct

### Our Pledge

We are committed to making participation in this project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Expected Behavior

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, trolling, or discriminatory comments
- Personal or political attacks
- Publishing others' private information
- Other conduct that could reasonably be considered inappropriate

---

## Development Setup

### Prerequisites

- **Node.js:** Version 18.0.0 or higher
- **npm:** Version 9.0.0 or higher (comes with Node.js)
- **Git:** For version control

### Getting Started

1. **Fork the repository**

   Click the "Fork" button on the GitHub repository page.

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/DOSage.git
   cd DOSage
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   This starts the Kitchen Sink demo at `http://localhost:5173`

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run docs` | Generate API documentation |

---

## Running Tests

### Running All Tests

```bash
npm test
```

### Running Tests in Watch Mode

```bash
npm run test:watch
```

### Running Specific Tests

```bash
# Run tests for a specific file
npm test -- Button.test.ts

# Run tests matching a pattern
npm test -- --grep "Button"
```

### Test Coverage

```bash
npm test -- --coverage
```

Coverage reports are generated in the `coverage/` directory.

### Writing Tests

Tests are located in the `tests/` directory and use Vitest with Testing Library.

```typescript
// tests/components/MyComponent.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createMyComponent } from '../../src/components/MyComponent';

describe('MyComponent', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      const element = createMyComponent({ label: 'Test' });
      expect(element).toBeDefined();
      expect(element.textContent).toContain('Test');
    });
  });

  describe('accessibility', () => {
    it('has no accessibility violations', async () => {
      const element = createMyComponent({ label: 'Test' });
      container.appendChild(element);
      await expect(container).toHaveNoViolations();
    });
  });
});
```

---

## Branch Naming Conventions

We follow a structured branch naming strategy to keep the repository organized and make it easy to understand the purpose of each branch.

### Main Branches

| Branch | Purpose | Who Can Push |
|--------|---------|--------------|
| `main` | Production releases only. All code here is stable and released. | Maintainers only (via PR) |
| `develop` | Integration branch for features (optional, not currently used) | - |

### Feature Branches

Use these naming conventions for your work:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/*` | New features or enhancements | `feature/add-menu-component` |
| `fix/*` | Bug fixes | `fix/button-focus-state` |
| `docs/*` | Documentation updates | `docs/update-readme` |
| `refactor/*` | Code refactoring without behavior changes | `refactor/simplify-theme-manager` |
| `test/*` | Adding or updating tests | `test/add-modal-tests` |
| `chore/*` | Maintenance tasks | `chore/update-dependencies` |
| `release/*` | Release preparation | `release/v0.2.0` |

### Branch Naming Best Practices

- Use lowercase letters and hyphens
- Be descriptive but concise
- Reference issue numbers when applicable: `fix/123-button-alignment`
- Examples:
  - ✅ `feature/command-palette`
  - ✅ `fix/modal-escape-key`
  - ✅ `docs/api-examples`
  - ❌ `my-branch`
  - ❌ `FEATURE/NEW-STUFF`
  - ❌ `fix_something`

### Workflow

1. **Create a branch** from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit regularly

3. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Open a Pull Request** to `main`

5. **After PR is merged**, delete your branch:
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

---

## Pull Request Process

### Before Submitting

1. **Create an issue first** (for significant changes)
2. **Create a feature branch**

   ```bash
   git checkout -b feature/my-new-feature
   ```

3. **Make your changes**
4. **Ensure all tests pass**

   ```bash
   npm test
   ```

5. **Run linting and formatting**

   ```bash
   npm run lint
   npm run format
   ```

6. **Run type checking**

   ```bash
   npm run typecheck
   ```

### Submitting a Pull Request

1. Push your branch to your fork
2. Open a Pull Request against the `main` branch
3. Fill out the PR template completely
4. Wait for code review

### PR Requirements

- [ ] All tests pass
- [ ] No linting errors
- [ ] TypeScript compiles without errors
- [ ] Documentation updated (if applicable)
- [ ] Kitchen Sink demo updated (for new components)
- [ ] Changelog entry added (for user-facing changes)

### Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, a maintainer will merge your PR

---

## Code Style Requirements

### TypeScript

- Use strict mode (`"strict": true`)
- No `any` types unless absolutely necessary (document why)
- Export all public types
- Add JSDoc comments to public APIs

```typescript
// ✅ Good
/**
 * Creates a DOS-style button element.
 * @param props - Button configuration options
 * @returns The button DOM element
 */
export function createButton(props: ButtonProps): HTMLButtonElement {
  // Implementation
}

// ❌ Bad
export function createButton(props: any) {
  // No types, no docs
}
```

### CSS

- Use CSS custom properties for theming
- Follow BEM-like naming: `.dos-component`, `.dos-component--variant`, `.dos-component___element`
- No rounded corners (DOS aesthetic)
- No inline styles in JavaScript

```css
/* ✅ Good */
.dos-button {
  background: var(--dos-color-primary);
  border-radius: 0;
}

.dos-button--large {
  padding: var(--dos-space-lg);
}

/* ❌ Bad */
.button {
  background: #FFFF55;
  border-radius: 4px;
}
```

### File Organization

```
src/components/ComponentName/
├── ComponentName.ts        # Main implementation
├── ComponentName.css       # Component styles
├── ComponentName.types.ts  # TypeScript interfaces
└── index.ts                # Public exports
```

### Accessibility

- All interactive elements must be keyboard accessible
- Use appropriate ARIA attributes
- Test with screen readers
- Ensure visible focus states

---

## Component Creation Guidelines

### 1. Plan the Component

- Define the props interface
- Identify states and variants
- Plan ARIA requirements
- Consider keyboard navigation

### 2. Create Directory Structure

```bash
mkdir -p src/components/MyComponent
touch src/components/MyComponent/MyComponent.ts
touch src/components/MyComponent/MyComponent.css
touch src/components/MyComponent/MyComponent.types.ts
touch src/components/MyComponent/index.ts
```

### 3. Define Types First

```typescript
// MyComponent.types.ts
export interface MyComponentProps {
  /** Required label text */
  label: string;
  
  /** @default 'primary' */
  variant?: 'primary' | 'secondary';
  
  /** @default false */
  disabled?: boolean;
  
  /** Click handler */
  onClick?: () => void;
}
```

### 4. Implement the Component

```typescript
// MyComponent.ts
import type { MyComponentProps } from './MyComponent.types';
import './MyComponent.css';

export function createMyComponent(props: MyComponentProps): HTMLElement {
  const { label, variant = 'primary', disabled = false, onClick } = props;

  const element = document.createElement('div');
  element.className = `dos-mycomponent dos-mycomponent--${variant}`;
  
  // Set content
  element.textContent = label;
  
  // ARIA
  element.setAttribute('role', 'button');
  element.setAttribute('tabindex', disabled ? '-1' : '0');
  
  // Events
  if (!disabled && onClick) {
    element.addEventListener('click', onClick);
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    });
  }
  
  return element;
}
```

### 5. Add Styles

```css
/* MyComponent.css */
.dos-mycomponent {
  font-family: var(--dos-font-family);
  background: var(--dos-color-bg);
  color: var(--dos-color-fg);
  border: var(--dos-border-width) solid var(--dos-color-border);
  padding: var(--dos-space-sm);
  cursor: pointer;
}

.dos-mycomponent:focus {
  outline: 2px solid var(--dos-color-primary);
  outline-offset: 2px;
}

.dos-mycomponent--primary {
  background: var(--dos-color-primary);
  color: var(--dos-color-bg);
}
```

### 6. Export from Index

```typescript
// index.ts
export { createMyComponent } from './MyComponent';
export type { MyComponentProps } from './MyComponent.types';
```

### 7. Add to Main Exports

```typescript
// src/components/index.ts
export * from './MyComponent';
```

### 8. Write Tests

```typescript
// tests/components/MyComponent.test.ts
import { describe, it, expect } from 'vitest';
import { createMyComponent } from '../../src/components/MyComponent';

describe('MyComponent', () => {
  it('renders with label', () => {
    const el = createMyComponent({ label: 'Test' });
    expect(el.textContent).toBe('Test');
  });

  it('applies variant class', () => {
    const el = createMyComponent({ label: 'Test', variant: 'secondary' });
    expect(el.classList.contains('dos-mycomponent--secondary')).toBe(true);
  });

  it('handles keyboard activation', () => {
    let clicked = false;
    const el = createMyComponent({ 
      label: 'Test', 
      onClick: () => { clicked = true; }
    });
    
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(clicked).toBe(true);
  });
});
```

### 9. Add to Kitchen Sink Demo

Add a demo section in the appropriate page file (e.g., `demo/src/pages/buttons.ts`).

---

## Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, etc.) |
| `refactor` | Code refactoring |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |
| `perf` | Performance improvements |

### Examples

```
feat(button): add loading state animation

fix(modal): prevent focus trap escape on Tab

docs(readme): update installation instructions

test(checkbox): add accessibility tests
```

### Scope

Use the component or area name as the scope:

- `button`, `modal`, `tabs` - Component names
- `theme` - Theme system
- `core` - Core utilities
- `build` - Build configuration
- `docs` - Documentation

---

## Questions?

If you have questions that aren't answered here:

1. Check existing issues for similar questions
2. Open a new issue with the "question" label
3. Join our discussions

Thank you for contributing to DOSage! 💾
