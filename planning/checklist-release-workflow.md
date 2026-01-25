# DOSage Release Workflow Checklist

> GitHub Actions → Build → Test → Package → Release → npm

This checklist guides implementation of automated CI/CD pipelines for GitHub releases with downloadable assets, branch protection, and eventual npm publishing.

---

## Phase R1: Repository Preparation

### R1.1 Package.json Finalization
- [x] Set `author` field (name, email, url)
- [x] Set `repository.url` to GitHub repo URL
- [x] Set `bugs.url` to GitHub issues URL
- [x] Set `homepage` to GitHub Pages or docs URL
- [x] Verify `license` is "MIT" and LICENSE file exists
- [x] Ensure `version` follows semver (currently 0.1.0)
- [x] Add `publishConfig` for npm (public access)
- [x] Add `prepublishOnly` script: `npm run build && npm run test`

### R1.2 Documentation Updates
- [x] Finalize README.md with badges (build status, npm version, license)
- [x] Ensure CONTRIBUTING.md has clear PR guidelines
- [x] Verify CHANGELOG.md follows Keep a Changelog format
- [x] Add CODE_OF_CONDUCT.md (optional but recommended)
- [x] Add SECURITY.md for vulnerability reporting

### R1.3 Git Hygiene
- [x] Ensure `.gitignore` excludes: `node_modules/`, `dist/`, `coverage/`, `.env`
- [x] Create `.npmignore` OR verify `files` field in package.json (already has `"files": ["dist"]`)
- [x] Verify no secrets or credentials in repository history

---

## Phase R2: Branch Protection & Strategy

### R2.1 Branch Naming Convention
- [ ] Document branch naming in CONTRIBUTING.md:
  - `main` - production releases only
  - `develop` - integration branch (optional)
  - `feature/*` - new features
  - `fix/*` - bug fixes
  - `docs/*` - documentation
  - `release/*` - release preparation

### R2.2 GitHub Branch Protection Rules (Manual - GitHub UI)
- [ ] ⛔ HUMAN ONLY: Enable branch protection for `main`:
  - [ ] Require pull request before merging
  - [ ] Require at least 1 approval
  - [ ] Require status checks to pass (CI workflow)
  - [ ] Require branches to be up to date before merging
  - [ ] Require conversation resolution before merging
  - [ ] Do not allow bypassing the above settings
  - [ ] Restrict who can push (maintainers only)

---

## Phase R3: GitHub Actions - CI Workflow

### R3.1 Create CI Workflow
- [ ] Create `.github/workflows/ci.yml`
- [ ] Trigger on: `push` to all branches, `pull_request` to `main`
- [ ] Matrix test: Node 18.x, 20.x, 22.x
- [ ] Matrix OS: ubuntu-latest (primary), windows-latest, macos-latest (optional)
- [ ] Steps:
  - [ ] Checkout code
  - [ ] Setup Node.js with caching
  - [ ] Install dependencies (`npm ci`)
  - [ ] Run linting (`npm run lint`)
  - [ ] Run type checking (`npm run typecheck`)
  - [ ] Run tests with coverage (`npm run test -- --coverage`)
  - [ ] Upload coverage to Codecov (optional)
  - [ ] Build library (`npm run build`)
  - [ ] Verify build artifacts exist

### R3.2 CI Quality Gates
- [ ] Ensure CI fails on: lint errors, type errors, test failures
- [ ] Add test for build output structure (esm/, cjs/, types/, css/)
- [ ] Consider adding bundle size check (optional)

---

## Phase R4: GitHub Actions - Release Workflow

### R4.1 Create Release Workflow
- [ ] Create `.github/workflows/release.yml`
- [ ] Trigger on: `push` to `main` branch only
- [ ] Condition: Only run if commit message contains version bump OR tag is pushed
- [ ] Steps:
  - [ ] Checkout code with full history
  - [ ] Setup Node.js
  - [ ] Install dependencies
  - [ ] Run full test suite
  - [ ] Build library
  - [ ] Create distributable package (tarball)
  - [ ] Extract version from package.json
  - [ ] Create GitHub Release with auto-generated notes
  - [ ] Upload tarball as release asset

### R4.2 Release Asset Structure
- [ ] Create tarball: `dosage-{version}.tgz` containing:
  - `dist/esm/` - ES modules
  - `dist/cjs/` - CommonJS
  - `dist/types/` - TypeScript declarations
  - `dist/css/` - Compiled CSS
  - `package.json`
  - `README.md`
  - `LICENSE`
  - `CHANGELOG.md`
- [ ] Optionally create ZIP for non-npm users

### R4.3 Version Management
- [ ] Add `npm version` scripts or use semantic-release (choose one):
  - **Option A (Manual):** Use `npm version patch|minor|major`
  - **Option B (Automated):** Configure semantic-release with conventional commits
- [ ] Ensure version bump commits follow pattern: `chore(release): vX.Y.Z`
- [ ] Configure git tag format: `vX.Y.Z`

---

## Phase R5: GitHub Actions - npm Publish Workflow

### R5.1 npm Authentication (Manual - GitHub UI)
- [ ] ⛔ HUMAN ONLY: Create npm access token (Automation type)
- [ ] ⛔ HUMAN ONLY: Add `NPM_TOKEN` to GitHub repository secrets

### R5.2 Create npm Publish Workflow
- [ ] Create `.github/workflows/npm-publish.yml` OR extend release.yml
- [ ] Trigger on: GitHub Release published
- [ ] Steps:
  - [ ] Checkout code at release tag
  - [ ] Setup Node.js with npm registry
  - [ ] Install dependencies
  - [ ] Build library
  - [ ] Publish to npm (`npm publish --access public`)
- [ ] Add dry-run step for PRs (optional)

### R5.3 npm Package Verification
- [ ] Test local pack: `npm pack --dry-run` lists only intended files
- [ ] Verify package size is reasonable (<500KB unpacked)
- [ ] Test install from tarball locally before first publish

---

## Phase R6: Workflow Configuration Files

### R6.1 Dependabot Configuration
- [ ] Create `.github/dependabot.yml`
- [ ] Configure npm dependency updates (weekly)
- [ ] Configure GitHub Actions updates (weekly)
- [ ] Set appropriate reviewers/assignees

### R6.2 Issue & PR Templates
- [ ] Create `.github/ISSUE_TEMPLATE/bug_report.md`
- [ ] Create `.github/ISSUE_TEMPLATE/feature_request.md`
- [ ] Create `.github/PULL_REQUEST_TEMPLATE.md`

### R6.3 GitHub Actions Permissions
- [ ] Review default GITHUB_TOKEN permissions
- [ ] Set minimal required permissions in workflow files

---

## Phase R7: Pre-Release Verification

### R7.1 Local Verification
- [ ] Run full build: `npm run build`
- [ ] Run all tests: `npm test`
- [ ] Run linting: `npm run lint`
- [ ] Run typecheck: `npm run typecheck`
- [ ] Test pack output: `npm pack`
- [ ] Verify tarball contents are correct

### R7.2 Integration Test
- [ ] Create test project that imports from local tarball
- [ ] Verify ESM import works
- [ ] Verify CJS require works
- [ ] Verify types are available
- [ ] Verify CSS import works

### R7.3 Documentation Verification
- [ ] README has installation instructions
- [ ] README has basic usage example
- [ ] API docs are generated and accurate
- [ ] CHANGELOG reflects all changes since last release

---

## Phase R8: First Release Execution

### R8.1 Final Pre-Release Steps
- [ ] Ensure all Phase R7 checks pass
- [ ] Update CHANGELOG.md with release date
- [ ] Commit: `chore: prepare v0.1.0 release`
- [ ] Create PR to `main` from development branch

### R8.2 Release Trigger
- [ ] ⛔ HUMAN ONLY: Merge PR to `main`
- [ ] ⛔ HUMAN ONLY: Verify CI passes on `main`
- [ ] ⛔ HUMAN ONLY: Create and push version tag: `git tag v0.1.0 && git push origin v0.1.0`
- [ ] Verify GitHub Release is created automatically
- [ ] Verify release assets are uploaded

### R8.3 npm Publish (First Time)
- [ ] ⛔ HUMAN ONLY: Verify npm publish workflow runs
- [ ] ⛔ HUMAN ONLY: Verify package appears on npmjs.com
- [ ] Test installation: `npm install dosage`

---

## Phase R9: Post-Release & Maintenance

### R9.1 Verification
- [ ] Test npm package in clean project
- [ ] Verify GitHub Release notes are accurate
- [ ] Verify CHANGELOG links work

### R9.2 Badges & Status
- [ ] Add CI status badge to README
- [ ] Add npm version badge to README
- [ ] Add license badge to README
- [ ] Add downloads badge to README (optional)

### R9.3 Ongoing Maintenance
- [ ] Document release process in CONTRIBUTING.md
- [ ] Set up release schedule (if applicable)
- [ ] Configure GitHub Discussions for community (optional)

---

## Quick Reference: Workflow Files to Create

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | Build, lint, test on all PRs |
| `.github/workflows/release.yml` | Create GitHub Release on tag push |
| `.github/workflows/npm-publish.yml` | Publish to npm on release |
| `.github/dependabot.yml` | Automated dependency updates |
| `.github/ISSUE_TEMPLATE/bug_report.md` | Bug report template |
| `.github/ISSUE_TEMPLATE/feature_request.md` | Feature request template |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR description template |

---

## Quick Reference: npm Scripts to Add

```json
{
  "scripts": {
    "prepublishOnly": "npm run build && npm run test",
    "version": "npm run build && git add -A",
    "postversion": "git push && git push --tags"
  }
}
```

---

## Quick Reference: Release Commands

```bash
# Patch release (0.1.0 → 0.1.1)
npm version patch -m "chore(release): %s"

# Minor release (0.1.0 → 0.2.0)
npm version minor -m "chore(release): %s"

# Major release (0.1.0 → 1.0.0)
npm version major -m "chore(release): %s"
```

---

## Semantic Versioning Guidelines

| Change Type | Version Bump | Example |
|-------------|--------------|---------|
| Bug fix, no API change | PATCH | 0.1.0 → 0.1.1 |
| New feature, backward compatible | MINOR | 0.1.0 → 0.2.0 |
| Breaking change | MAJOR | 0.1.0 → 1.0.0 |

**Pre-1.0:** During 0.x development, MINOR = breaking, PATCH = features/fixes

---

*Created: January 24, 2026*
