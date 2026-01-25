# 🚀 DOSage Release Workflow Agent Prompt

> Copy everything below the line and paste it to your coding agent.

---

## Your Mission

You are implementing the GitHub Actions CI/CD pipeline and release workflow for **DOSage**, a TypeScript component library. Your goal is to make this project ready for GitHub Releases with downloadable assets, and eventually npm publishing.

## Primary Reference

**Read this file first and use it as your task list:**
```
planning/checklist-release-workflow.md
```

This checklist contains 9 phases (R1-R9) with specific tasks. Work through them **sequentially**, checking off boxes as you complete each task.

## Critical Rules

### 1. NEVER GUESS PERSONAL OR PROJECT-SPECIFIC VALUES

**ASK ME** before filling in any of these fields:

| Field | Example | Ask First! |
|-------|---------|------------|
| `author` in package.json | name, email, url | ✅ YES |
| `repository.url` | GitHub repo URL | ✅ YES |
| `bugs.url` | GitHub issues URL | ✅ YES |
| `homepage` | docs/website URL | ✅ YES |
| npm package scope | `@org/dosage` vs `dosage` | ✅ YES |
| GitHub username/org | Owner of the repo | ✅ YES |
| Email addresses | For CODE_OF_CONDUCT, etc. | ✅ YES |

**DO NOT** invent placeholder values like `your-username` or `TODO`. Stop and ask me.

### 2. Workflow Execution

- Work through phases **in order** (R1 → R2 → R3...)
- Check off tasks with `- [x]` as you complete them
- **STOP** at any `⛔ HUMAN ONLY` checkpoint — do not proceed past these
- Report your progress after completing each phase

### 3. File Creation Standards

When creating GitHub Actions workflow files:
- Use the latest stable action versions (e.g., `actions/checkout@v4`)
- Include proper permissions blocks
- Add helpful comments explaining non-obvious steps
- Use environment variables for repeated values
- Ensure workflows are idempotent

### 4. What You CAN Do Without Asking

- Create workflow YAML files
- Create issue/PR templates
- Create dependabot.yml
- Add npm scripts to package.json
- Create .npmignore if needed
- Update CONTRIBUTING.md with release process docs
- Add badges to README (using placeholder URLs I'll update)

### 5. Quality Standards

All workflow files must:
- Pass YAML linting
- Have clear job/step names
- Include appropriate `timeout-minutes`
- Use `npm ci` (not `npm install`) in CI
- Cache node_modules appropriately
- Set explicit permissions

## Starting Point

1. Read `planning/checklist-release-workflow.md` completely
2. Read `package.json` to understand current state
3. Check if `.github/workflows/` exists and what's already there
4. **Ask me** for the personal/project values you need for Phase R1
5. Begin implementation

## Reporting Format

After each phase, report:

```markdown
## Phase RX Complete

### ✅ Completed
- [Task completed]

### ❓ Questions/Blockers
- [Anything you need from me]

### 📁 Files Created/Modified
- [List of files]

### ⏭️ Next Phase
Ready for Phase RY: [Phase Name]
```

## Begin!

Start by reading the checklist, then ask me for the values you need to complete Phase R1.
