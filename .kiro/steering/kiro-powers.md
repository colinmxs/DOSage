---
inclusion: manual
---

# Kiro Powers - Local Development Guide

## Power Storage Location

**Local powers are stored in:** `.kiro/powers/`

This keeps all Kiro-specific configuration together:
- `.kiro/settings/` - MCP and other settings
- `.kiro/steering/` - Steering files (like this one)
- `.kiro/powers/` - Local custom powers

## Security Note

The `.kiro/powers/` directory is excluded from git via `.gitignore` because power configurations may contain:
- API keys and tokens
- Personal authentication credentials
- Local file paths
- Environment-specific settings

**Never commit `.kiro/powers/` to version control.**

## Creating New Powers

When creating new local powers:

1. Create directory: `.kiro/powers/{power-name}/`
2. Add required files:
   - `POWER.md` (with frontmatter metadata)
   - `mcp.json` (if Guided MCP Power)
   - `steering/` (optional, for complex workflows)

3. Install via Powers UI:
   - Open Powers panel
   - Click "Add Custom Power"
   - Select "Local Directory"
   - Path: `F:\github\DOSage\.kiro\powers\{power-name}`

## Current Local Powers

### github
- **Purpose:** GitHub MCP server that loads on-demand
- **Location:** `.kiro/powers/github/`
- **Why:** Keeps GitHub tools out of context until specifically needed
- **Contains:** GitHub authentication token (secret)

## Best Practices

- Keep secrets in local powers only
- Use `.kiro/powers/` for personal/workspace-specific powers
- Share powers via separate repos with sanitized configs
- Document each power's purpose in this file
