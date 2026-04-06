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
| 1 | Started downloading assets to `/Users/brunastefani/My project/Assets/Images/FittingRoom/` — tool use was cancelled mid-execution | That path is a Unity project, not the web app. User interrupted the tool call and provided the correct path | Restarted asset download to `/Users/brunastefani/Documents/GitHub/CharacterSelectionScreen/src/assets/` |
| 2 | Rewrote the component to replace the body silhouette on click — removed all drag-and-drop code, ghost, handles, and resize/rotate logic entirely | "This is not good, I want you to go back to the previous version" — the interaction concept was wrong. Clicking is too passive; the drag-and-drop adjustment was the intended UX | Fully reverted `FittingRoom.jsx` and `FittingRoom.css` to the drag-and-drop version with ghost, overlay, corner handles, rotation, remove button, and 5-second auto-hide |
| 3 | Set handle auto-hide timer to 10 seconds | Too long — felt sluggish | Reduced to 5 seconds |
| 4 | After completing the revert, immediately attempted to fetch 8 new Figma nodes the user had shared mid-session | User cancelled the tool call — they had not yet confirmed readiness to move to the next task | Stopped and waited for user direction |

---

## Successes

- **Figma MCP → plain CSS workflow:** `get_design_context` returns React + Tailwind; converting pixel values directly to absolute CSS positions with a scaled canvas worked cleanly without installing any extra dependencies
- **Viewport scaling via `transform: scale()`:** All Figma pixel coordinates used as-is — no conversion math needed, scales perfectly to any window size
- **`useRef` for drag state instead of `useState`:** Using a ref for `adjustDrag` avoids stale closure issues in global `mousemove` / `mouseup` listeners while keeping renders minimal
- **Handles auto-hide with `pointer-events: none`:** Wrapping all handles in `.fr-controls` and toggling `pointer-events` alongside opacity means the dress remains draggable even when handles are invisible
