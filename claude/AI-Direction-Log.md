# AI Direction Log
**Project:** Say Yes to the Dress — Fitting Room
**Course:** AI 201 · Spring 2026
**Student:** Bruna Stefani

This file records every significant AI interaction in this project — what was asked, what AI produced, and what decision was made. Updated at every checkpoint.

---

## Session 1 — Project Scaffold
**Date:** 2026-03-30 · Checkpoint: `01-directory-scaffold.md`

| # | What I Asked | What AI Produced | Decision & Why |
|---|---|---|---|
| 1 | Set up the project directory structure | Proposed a `docs/` folder at repo root for assignment reference markdown | **Rejected.** Kept assignment docs inside `claude/docs/` only — didn't want reference files polluting the repo root |
| 2 | Set up the project directory structure | Proposed a `public/` folder for static assets | **Rejected.** Removed it — all assets would live in `src/assets/` to keep everything inside the Vite module system |
| 3 | Scaffold the Vite + React app | Attempted `npm create vite@latest` — cancelled repeatedly because non-interactive terminal can't respond to directory conflict prompt | **Rejected approach.** Switched to manually creating all files with identical output — faster and didn't depend on interactive prompts |
| 4 | Fix npm permissions error | Suggested `npm cache clean --force` | **Rejected.** Cache was owned by root — not fixable without sudo. Abandoned the approach entirely |
| 5 | Fix npm scaffold failure | Tried `echo "y" \| npm create vite@latest` and `npx --yes create-vite@latest -- --overwrite` | **Rejected.** Neither worked — the prompt isn't yes/no, it's a menu. Dropped scaffolding tools entirely |
| 6 | Fix npm permissions | Kept suggesting `sudo` commands as the solution | **Rejected.** Sudo wasn't necessary — the real fix was to stop using `npm create` altogether. Built all files manually |
| 7 | Set up project docs | Started writing assignment reference markdown to a `docs/` folder before being asked | **Stopped mid-execution.** User wanted the directory structure confirmed before any files were written |
| 8 | Begin the project | Asked questions about Design Intent and creative direction before touching the directory | **Redirected.** User wanted the scaffold built first — creative decisions would come after infrastructure was confirmed |

---

## Session 2 — Fitting Room Implementation
**Date:** 2026-04-06 · Checkpoint: `2026-04-06-fitting-room.md`

| # | What I Asked | What AI Produced | Decision & Why |
|---|---|---|---|
| 1 | Download Figma assets to the project | Started downloading assets to `/Users/brunastefani/My project/Assets/Images/FittingRoom/` — a Unity project path | **Stopped mid-execution.** Wrong directory — provided the correct path `src/assets/` and restarted |
| 2 | Implement drag-and-drop try-on from Figma design | Rewrote the component to replace the body silhouette on click — removed all drag-and-drop code, ghost cursor, handles, and resize/rotate logic entirely | **Rejected entirely.** "This is not good, I want you to go back to the previous version." Clicking is too passive. Drag-and-drop mimics physically placing a dress — that was the intended UX. Reverted in full |
| 3 | Handle auto-hide timing | Set handle auto-hide timer to 10 seconds | **Changed.** Too long — felt sluggish. Reduced to 5 seconds |
| 4 | (No new request — completing previous revert) | After finishing the revert, immediately attempted to fetch 8 new Figma nodes shared mid-session | **Stopped.** User had not confirmed readiness to move to the next task. Waited for direction |
| 5 | Implement click-to-preview dress overlay (user re-requested) | Fetched 8 Figma dressed-body composite nodes, downloaded overlay images, removed drag-and-drop, replaced body silhouette with a scaled dress overlay on click | **Rejected.** "No, this is wrong. Revert and record this failure." The pre-composited overlay didn't match the intended interaction. Reverted via `git checkout` |
| 6 | Fix dress alignment on body | Re-attempted with dress overlaid at Figma canvas position (870.27, 315.24) | **Rejected.** "The dress needs to align with the body." Dress was not visually aligned with the silhouette. Reverted via `git revert HEAD` |
| 7 | Fix dress alignment (second attempt) | Re-centered dress on body visual center (BODY_CENTER_X = 960.62px derived from clip percentages) — moved dress ~102px left | **Rejected.** "No, the alignment is not better. You failed." Two attempts at click-to-preview both failed. Feature dropped from scope entirely |
| 8 | Add background removal for uploaded dresses | Added `@huggingface/transformers` + `Xenova/segformer-b2-clothes` two-step pipeline: remove background → clothing segmentation → canvas mask | **Rejected.** "No, it is not working." Reverted `FittingRoom.jsx`, `FittingRoom.css`, `package.json`, `package-lock.json` to HEAD via `git restore` |
| 9 | Fix background removal (revised approach) | Fixed Vite WASM issue, simplified to single-pass segmentation on original image — clothing mask applied directly, fallback chain to `removeBackground` then raw file | **Rejected.** "This is not what I wanted." Approach direction was wrong, not just a technical fix. Reverted via `git revert HEAD` |
| 10 | Separate panel grid from + footer (Figma reference nodes 31:434, 31:448) | Broke panel and + footer into two separate absolute elements with a 22px gap | **Rejected.** "+ button disappeared." The footer was placed outside the scaled canvas transform — invisible at runtime. Reverted via `git revert HEAD` |
| 11 | Show SAY YES! button only after dress is placed; fade it and panel on click | Added `saidYes` state + `useEffect` watching `placedItems.dress` to reset it; applied fadeout classes on click | **Rejected.** "The page is blank." The `useEffect` dependency on `placedItems.dress` caused a render loop that crashed the page. Reverted via `git revert HEAD`. Rebuilt without `useEffect` — pure state logic only |
| 12 | Position congratulations text from Figma node 59:847 | Positioned the text correctly but also changed the font from KyivType Sans to Inter Bold without being asked | **Rejected the font change.** KyivType Sans is a locked design rule. The font change was never requested. Reverted to KyivType Sans 400. Rule established: must confirm any unrequested design element changes before committing |
| 13 | Add drag/resize/rotate/× controls to captured face photo | Added face photo to `placedItems` system — rendered as `fr-placed` div | **Rejected.** Image appeared as a square outside the face input area, × button not visible, corner handles not showing. Root cause: `overflow: hidden` on container clipped handles; initial size too small. Reverted via `git revert HEAD` |

---

## Session 3 — Polish + Documentation
**Date:** 2026-04-08 · Checkpoint: `2026-04-06-fitting-room.md` (updated)

| # | What I Asked | What AI Produced | Decision & Why |
|---|---|---|---|
| 1 | Retry face photo drag/resize/rotate/× controls | Used `clip-path: ellipse(50% 50%)` on the `<img>` only — not `overflow: hidden` on the container — with `revealHandles('face')` called immediately on capture | **Kept.** Oval crop preserved, all four corner handles + rotation handle + × button fully visible outside element bounds. Working as intended |
| 2 | Add skin tone color picker: change body color when user clicks on it | Applied `mix-blend-mode: color` overlay div inside `.fr-body` container | **Rejected.** "It didn't work. The area changing color is around the body silhouette not inside the body." The blend mode colored the entire bounding box rectangle including transparent areas. Reverted |
| 3 | Retry body color — accurate silhouette tinting | Drew `body.png` to a `<canvas>` element, used `globalCompositeOperation: 'source-in'` to fill only opaque pixels with chosen color | **Kept.** Canvas `source-in` fills only the actual silhouette pixels — transparent areas stay transparent. Exactly right |
| 4 | Place the skin tone picker at exact Figma position | First placed at `left: 1092px, top: 723px` from `get_design_context` data | **Changed.** User said "check the file again." Fetched `get_metadata` which returned current coordinates `x: 1088, y: 683` — more accurate than the full-frame design context |
| 5 | Create README with all assignment deliverables | Built README with Design Intent summary, Mermaid diagram, AI Direction Log (5 entries), Records of Resistance (3 entries), Five Questions placeholder | **Kept with one gap.** Five Questions reflection left as a placeholder — must be written by the student in their own words |
| 6 | Create a full AI Direction Log from the complete conversation history | This file | **Kept.** Established as a standard: this log will be updated at every future checkpoint |

---

## How This Log Gets Updated

At every checkpoint, add a new session block with:
- Session number and date
- Reference to the checkpoint file
- One row per significant AI interaction: what was asked, what was produced, what decision was made and why

This log is the evidence that the student directed the work rather than followed it.
