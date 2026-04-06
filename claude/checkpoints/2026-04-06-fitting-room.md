# Checkpoint 02 — Fitting Room Screen
**Date:** 2026-04-06
**Branch:** main

---

## Context
Full "SAY YES to the dress" Fitting Room screen implemented from Figma (file `fTcwDkIUW4nyXE57DU8HQI`, node `10:318`). React + Vite project, plain CSS, no Tailwind. The canvas is a fixed 1920×1080 surface that scales to fit any viewport via `transform: scale()`.

**Repo state:**
- `src/App.jsx` — renders `<FittingRoom />` directly
- `src/components/FittingRoom.jsx` — full screen component with drag-and-drop try-on logic
- `src/components/FittingRoom.css` — all layout, positioning, and interaction styles
- `src/assets/` — 15 images: `dress1–5.png`, `podium.png`, `body.png`, `wheel.svg`, `icon-hair/makeup/jewelry/dress/shoes/bouquet/accessory.png`

**What's on screen:**
- Gradient background (light gray → warm cream)
- "SAY YES to the dress" title centered above the body (70px + 50px, KyivType Sans)
- Podium, body silhouette, decorative wheel ring in the center stage
- 7 accessory icon buttons arranged around the wheel — toggle active state on click (gold ring)
- "Say, yes!" rounded CTA button at bottom center
- Right panel (273px wide): 2-column dress grid (5 dresses, row 3 full-width), scrollable, "+" button adds local image

**Drag-and-drop try-on:**
- Drag dress thumbnail → ghost follows cursor at 75% opacity
- Drop on stage → dress placed as floating overlay centered on drop point (200×420px default)
- Drag to reposition; 4 corner handles to resize (opposite corner fixed); gold circle handle to rotate; × to remove
- Handles fade out after **5 seconds** of inactivity; any interaction (click, drag, resize, rotate) resets the timer

---

## Directions
1. Clone repo, run `npm install`
2. All assets are already in `src/assets/` — no download needed
3. Run `npm run dev` — app runs at `http://localhost:5173/CharacterSelectionScreen/`
4. Figma source: `https://www.figma.com/design/fTcwDkIUW4nyXE57DU8HQI/AI-Projects-Design-File?node-id=10-318`
5. To update from Figma: use `get_design_context` with fileKey `fTcwDkIUW4nyXE57DU8HQI` and re-download assets from new MCP asset URLs

---

## Records of Resistance

| # | What AI Produced | Why It Was Rejected | What Was Done Instead |
|---|---|---|---|
| 1 | Attempted to download assets to `/Users/brunastefani/My project/Assets/` (Unity project) | Wrong project — Unity, not the web app | User corrected path to `/Users/brunastefani/Documents/GitHub/CharacterSelectionScreen` |
| 2 | Implemented "click dress → replaces body silhouette" interaction | User wanted to go back to drag-and-drop with adjustable overlay | Fully reverted to drag-and-drop with resize/rotate/remove handles |
| 3 | Set handle auto-hide timer to 10 seconds | Too long — felt sluggish | Reduced to 5 seconds |

---

## Successes

- **Figma MCP → plain CSS workflow:** `get_design_context` returns React + Tailwind; converting pixel values directly to absolute CSS positions with a scaled canvas worked cleanly without installing any extra dependencies
- **Viewport scaling via `transform: scale()`:** All Figma pixel coordinates used as-is — no conversion math needed, scales perfectly to any window size
- **`useRef` for drag state instead of `useState`:** Using a ref for `adjustDrag` avoids stale closure issues in global `mousemove` / `mouseup` listeners while keeping renders minimal
- **Handles auto-hide with `pointer-events: none`:** Wrapping all handles in `.fr-controls` and toggling `pointer-events` alongside opacity means the dress remains draggable even when handles are invisible
