# Checkpoint 01 — Directory Scaffold
**Date:** 2026-03-30
**Branch:** main

---

## Context
Vite + React app scaffolded manually in `/CharacterSelectionScreen`. GitHub Actions workflow configured to build and deploy to GitHub Pages on push to `main`. Dependencies installed, build passes. No creative work started yet — this is pure project infrastructure.

**Repo state:**
- `package.json` — React 18, Vite 6, @vitejs/plugin-react
- `vite.config.js` — base set to `/CharacterSelectionScreen/` for GitHub Pages
- `index.html` — root entry point
- `src/main.jsx` — React root mount
- `src/App.jsx` — placeholder component
- `src/index.css` / `src/App.css` — reset + shell styles
- `src/components/` — empty, ready for faction components
- `src/assets/` — empty, ready for media
- `.github/workflows/deploy.yml` — builds on push to main, deploys via actions/deploy-pages
- `claude/docs/` — source PDFs (assignment brief, companion doc, syllabus)
- `claude/checkpoints/` — this folder

**Next step:** Define Design Intent before any UI work begins.

---

## Directions
1. Create a new GitHub repo named `CharacterSelectionScreen`
2. Clone it locally
3. Create `package.json` with React 18 + Vite 6 dependencies (see current file)
4. Create `vite.config.js` — set `base` to `'/CharacterSelectionScreen/'`
5. Create `index.html` with `<div id="root">` and `src/main.jsx` script tag
6. Create `src/main.jsx`, `src/App.jsx`, `src/index.css`, `src/App.css`
7. Create empty `src/components/` and `src/assets/` directories
8. Create `.gitignore` — exclude `node_modules`, `dist`, `.DS_Store`
9. Create `.github/workflows/deploy.yml` — GitHub Actions build + deploy pipeline
10. Create `claude/docs/` and add assignment PDFs
11. Run `npm install` — should add 65 packages, 0 vulnerabilities
12. Run `npm run build` — should produce `dist/` with no errors
13. In GitHub repo settings → Pages → set source to **GitHub Actions**

---

## Records of Resistance

| # | What AI Produced | Why It Was Rejected | What Was Done Instead |
|---|---|---|---|
| 1 | Proposed `docs/` folder at repo root for assignment reference markdown | User did not want it at root level | Kept assignment docs inside `claude/docs/` only |
| 2 | Proposed `public/` folder for static assets | User removed it from the structure | Assets will live in `src/assets/` |
| 3 | Attempted `npm create vite@latest` scaffold | Non-interactive terminal can't respond to directory conflict prompt — cancelled repeatedly | Files created manually with identical output |
| 4 | Tried `npm cache clean --force` to fix permissions | Still hit the same EACCES error — cache owned by root, not fixable without sudo | Abandoned cache fix attempts, moved to manual file creation |
| 5 | Tried `echo "y" \| npm create vite@latest` and `npx --yes create-vite@latest -- --overwrite` | Both still cancelled — the prompt isn't a yes/no, it's a menu selection | Dropped the approach entirely |
| 6 | Kept suggesting `sudo` commands as the solution to the npm permissions issue | User pointed out sudo wasn't necessary — the real fix was to stop trying to use npm create at all | Manually created all files, bypassing npm entirely |
| 7 | Began writing assignment reference markdown to a `docs/` folder before being confirmed | User stopped the tool call — wanted to define the structure first before any files were written | Confirmed full directory structure with user before writing any files |
| 8 | Asked questions about Design Intent and creative direction before touching the directory structure | User wanted the scaffold built first, creative decisions later | Moved immediately to directory structure, held design questions for after |

---

## Successes

- **Presenting the full directory tree visually before building** — Showing the structure as a diagram let the user remove two items before a single file was created. Prevents rework. Do this before every scaffold.
- **Manual scaffold as fallback** — When `npm create vite` kept failing, building files manually was faster, gave cleaner control, and produced an identical result. No dependency on interactive prompts.
- **Confirming structure before writing** — Showing the proposed tree and asking "ready to scaffold?" gave the user a clear decision point. They approved, then we built. No surprises.
- **Checkpoint system as memory** — User defined a documentation standard mid-session. Saving it immediately to persistent memory means it will apply to every future project without being re-explained.
- **`vite.config.js` base path set correctly on first pass** — Setting `base: '/CharacterSelectionScreen/'` upfront means GitHub Pages will resolve assets correctly without a debugging session later.
