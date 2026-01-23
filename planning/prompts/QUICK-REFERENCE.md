# DOSage Prompt Sequence — Quick Reference

## The Problem

The original spec prompt (~530 lines) caused context overflow because it asked for:
- 3 separate detailed documents
- ~14 phases of implementation details  
- Complex per-component specifications
- Nested instructions and formats

## The Solution

Split into **5 focused prompts** that each produce manageable output:

```
┌─────────────────────────────────────────────────────────────────┐
│  PROMPT 1: Foundation                                           │
│  ─────────────────────                                          │
│  Input:  Design questions                                       │
│  Output: project-foundation.md (architecture decisions)         │
│  Size:   ~2-3 pages                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PROMPT 2: Checklist Part 1 (Phases 0-3)                        │
│  ───────────────────────────────────────                        │
│  Input:  Phase specs + component format template                │
│  Output: First ~30% of dosage-checklist.md                      │
│  Size:   ~4-6 pages                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PROMPT 3: Checklist Part 2 (Phases 4-9)                        │
│  ───────────────────────────────────────                        │
│  Input:  Phase specs + component format template                │
│  Output: Middle ~40% of dosage-checklist.md                     │
│  Size:   ~6-8 pages                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PROMPT 4: Checklist Part 3 (Phases 10-13)                      │
│  ────────────────────────────────────────                       │
│  Input:  Phase specs + component format template                │
│  Output: Final ~30% of dosage-checklist.md                      │
│  Size:   ~4-6 pages                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PROMPT 5: Agent Documents                                      │
│  ─────────────────────────                                      │
│  Input:  Document templates + project context                   │
│  Output: agent-instructions.md + starter-prompt.md              │
│  Size:   ~3-4 pages total                                       │
└─────────────────────────────────────────────────────────────────┘
```

## Why This Works

| Issue | Original | Split Approach |
|-------|----------|----------------|
| Output size | ~50+ pages in one response | ~5-10 pages per prompt |
| Context window | Exhausted mid-generation | Stays within limits |
| Focus | Juggling 3 documents + 14 phases | One clear task per prompt |
| Quality | Degraded toward end | Consistent throughout |
| Recovery | Start over if fails | Re-run only failed prompt |

## Tips for Best Results

1. **Fresh context** — Start a new chat for each prompt
2. **Don't rush** — Let each response complete fully before saving
3. **Manual assembly** — Combine checklist parts 2-4 manually into one file
4. **Adjust paths** — Update file paths in prompt 5 if foundation changed them
5. **Review as you go** — Catch issues before they compound

## File Outputs

After running all prompts:

```
planning/
├── spec-prompt.md          # Original (keep for reference)
├── project-foundation.md   # From Prompt 1
├── dosage-checklist.md     # Combined from Prompts 2-4
├── agent-instructions.md   # From Prompt 5
├── starter-prompt.md       # From Prompt 5
└── prompts/
    ├── 00-sequence-guide.md
    ├── 01-project-foundation.md
    ├── 02-checklist-phase0-3.md
    ├── 03-checklist-phase4-9.md
    ├── 04-checklist-phase10-13.md
    └── 05-agent-docs.md
```

## Execution Checklist

- [ ] Run Prompt 1 → Save output to `planning/project-foundation.md`
- [ ] Run Prompt 2 → Save output to `planning/dosage-checklist.md`
- [ ] Run Prompt 3 → Append output to `planning/dosage-checklist.md`
- [ ] Run Prompt 4 → Append output to `planning/dosage-checklist.md`
- [ ] Run Prompt 5 → Save outputs to `planning/agent-instructions.md` and `planning/starter-prompt.md`
- [ ] Review all documents for consistency
- [ ] Ready to start implementation!
