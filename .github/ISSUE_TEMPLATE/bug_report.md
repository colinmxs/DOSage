---
name: Bug Report
about: Report a bug or unexpected behavior
title: '[Bug] '
labels: ['bug']
assignees: []

---

## 🐛 Bug Description

A clear and concise description of what the bug is.

## 📝 Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## ✅ Expected Behavior

A clear and concise description of what you expected to happen.

## ❌ Actual Behavior

A clear and concise description of what actually happened.

## 📷 Screenshots

If applicable, add screenshots to help explain your problem.

## 🖥️ Environment

- **OS:** [e.g., Windows 11, macOS 14, Ubuntu 22.04]
- **Browser:** [e.g., Chrome 120, Firefox 121, Safari 17]
- **DOSage Version:** [e.g., 0.1.0]
- **Node Version:** [e.g., 20.10.0] (if building from source)

## 📦 Minimal Reproduction

If possible, provide a minimal code example that reproduces the issue:

```typescript
import { createButton } from 'dosage';

const button = createButton({
  label: 'Test',
  onClick: () => console.log('clicked')
});

// Bug occurs here...
```

Or link to a CodeSandbox/StackBlitz reproduction.

## 🔍 Additional Context

Add any other context about the problem here. For example:
- Does this happen with specific component combinations?
- Does this only happen in certain browsers?
- Did this work in a previous version?

## 🔗 Related Issues

Link to any related issues or pull requests.
