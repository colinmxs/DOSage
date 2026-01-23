# DOSage Specification Prompts — Execution Guide

## Overview

The original `spec-prompt.md` has been split into **5 sequential prompts** to avoid context overflow and ensure high-quality output at each stage.

## Execution Order

| Step | File | Purpose | Output |
|------|------|---------|--------|
| 1 | `01-project-foundation.md` | Establish project structure, conventions, file paths | Foundation decisions documented |
| 2 | `02-checklist-phase0-3.md` | Generate checklist Phases 0–3 (Foundation, Infrastructure, Layout, Typography) | First half of `dosage-checklist.md` |
| 3 | `03-checklist-phase4-9.md` | Generate checklist Phases 4–9 (Buttons, Forms, Navigation, Feedback, Data) | Continue `dosage-checklist.md` |
| 4 | `04-checklist-phase10-13.md` | Generate checklist Phases 10–13 (Advanced, Utilities, Polish, QA) | Complete `dosage-checklist.md` |
| 5 | `05-agent-docs.md` | Generate agent instructions + starter prompt | `agent-instructions.md` + `starter-prompt.md` |

## How to Use

1. **Start fresh context** for each prompt
2. **Copy the entire prompt** into the AI
3. **Wait for complete output** before proceeding
4. **Save the output** to the specified file(s)
5. **For prompts 2-4**: Provide the previous checklist output as context if needed

## Important Notes

- Each prompt is **self-contained** with all necessary context
- Prompts 2-4 build on each other but can be run with minimal cross-reference
- Prompt 5 should be run **after** the checklist is complete, as it references the structure

## Project Constants (Referenced Across All Prompts)

```
Project Name: DOSage
Repository Root: (your repo)
Planning Directory: planning/
Source Directory: src/
Components Directory: src/components/
Styles Directory: src/styles/
Kitchen Sink App: demo/
Tests Directory: tests/ (or __tests__/)
```

## Color Reference

```
DOS Blue: #0000AA
DOS White: #AAAAAA
DOS Bright White: #FFFFFF
DOS Black: #000000
Amber: #FFB000
Green Phosphor: #33FF33
```
