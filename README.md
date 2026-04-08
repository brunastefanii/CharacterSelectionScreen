# Say Yes to the Dress — Fitting Room

**AI 201 · Project 1 · Bruna Stefani**
**Live URL:** https://brunastefanii.github.io/CharacterSelectionScreen/

---

## Design Intent / PRD — SAY YES to the Dress: Digital Fitting Room

**Figma file:** [AI-Projects-Design-File — The Fitting Room](https://www.figma.com/proto/fTcwDkIUW4nyXE57DU8HQI/AI-Projects-Design-File?page-id=0%3A1&node-id=10-318&viewport=-3304%2C792%2C0.21&t=94g8EJtxDxuemhoQ-1&scaling=contain&content-scaling=fixed)

---

### 1. Project Overview

**Purpose**
The Fitting Room is an interactive bridal experience that allows users to explore and "try on" dresses in a digital environment that mimics the emotional and visual qualities of an in-person fitting. Beyond creating a beautiful experience, the platform is designed to help users save time and make more informed decisions before visiting a physical showroom, reducing uncertainty and improving the efficiency of in-person appointments.

This project bridges digital exploration with physical decision-making, allowing users to arrive at showrooms with clarity, confidence, and a narrowed selection.

**Goals**
- Create a high-fidelity, editorial-like experience rather than a typical e-commerce interface
- Enable users to preselect and explore dress options digitally, minimizing time spent browsing in the store
- Support direct manipulation (drag, resize, rotate) to simulate real-world interaction with garments
- Maintain visual elegance and emotional pacing aligned with bridal expectations
- Ensure the experience feels intuitive without instructions

**Success Metrics**
- Users can identify preferred dress styles before visiting a showroom
- Users successfully place and adjust at least one dress within seconds
- Reduced decision fatigue during in-person fittings (validated through feedback)
- No visual or interaction elements break immersion
- Experience maintains full fidelity with the Figma design system

---

### 2. Target Audience

**Primary Audience**
- Brides or users exploring wedding dresses digitally
- Users who value aesthetic, curated, and emotional experiences over speed

**Secondary Audience**
- Designers, stylists, or bridal brands exploring digital fitting concepts
- Users familiar with touch-based or spatial interactions

**User Mindset**
- Wants to have potential bridal dress options narrowed before entering a showroom

---

### 3. Inspiration & Conceptual Foundation

The Fitting Room is rooted in a blend of nostalgia, tactile play, and editorial storytelling.

The interaction model draws inspiration from paper dolls and magazine cutouts — the act of selecting, placing, and adjusting garments directly onto a figure. This tactile behavior informed the decision to use drag-and-drop as the primary interaction, mimicking the physical experience of layering clothing onto a body.

The experience is also influenced by early 2000s dress-up games, particularly those centered around characters like Barbie, where users could freely mix, match, and experiment with outfits in a playful, low-pressure environment. These experiences informed key design decisions:
- Emphasis on freedom over restriction
- Immediate visual feedback
- Playful experimentation without consequences

At the same time, the visual direction is grounded in bridal editorial aesthetics — soft gradients, gold accents, and minimal compositions reflecting the tone of high-end bridal campaigns and lookbooks.

**Design Translation**

These combined references translate into a system that is:
- **Tactile** like paper dolls — drag, place, adjust
- **Playful** like early dress-up games — freedom and exploration
- **Refined** like editorial fashion — calm, elegant, intentional

**Intent**
The goal is to recreate the feeling of sitting on the floor, cutting outfits from magazines, or playing dress-up — but elevated into a modern, emotionally resonant digital experience.

---

### 4. Design System

The design system for The Fitting Room was fully defined in Figma prior to any development. Every visual and structural decision — layout, typography, color, and component behavior — was created with clear intent and full design agency before being translated into code. The implementation phase focused on bringing predefined interactions to life, not generating or altering the design.

**Color Palette**
- Background: Warm gradient (`#f1f1f1 → #f9f7f1`)
- Accents: Gold (`#c8a97e`, `#D3A550`)
- Surfaces: White panels

*Intent: Create a soft, warm, editorial atmosphere. Avoid harsh contrast or sterile interfaces.*

**Typography**
- Typeface: KyivType Sans (no substitutions)
- Title: 70px · Subtitle: 50px · CTA: 26px

*Intent: Typography reinforces luxury, clarity, and calm pacing.*

**Layout System**
- Base canvas: 1920×1080
- Scaling: `transform: scale()`
- Absolute positioning from Figma coordinates

*Intent: Maintain pixel-perfect fidelity. This is a controlled, designed experience — not a responsive system.*

**Logo and Branding**
- Minimal, elegant, editorial-inspired
- Gold-based palette aligned with system
- Branding is subtle; the focus is the experience

**Asset Strategy**
- Dress assets were externally sourced and curated
- Images treated as modular content within a fixed system
- No changes were made to the core design system to accommodate assets

*Intent: Content adapts to the system, not the system to content.*

---

### 5. Features and Interaction Requirements

**Core Interaction — Dress Try-On**
- Drag-and-drop (not click-to-place)
- Drag ghost must always be visible during drag
- Dresses appear as floating overlays on drop

**Post-Placement Interactions**
- Drag to reposition
- Resize via 4 corner handles (opposite corner fixed)
- Rotate via gold circle handle
- Remove via × control

**Interaction Behavior Rules**
- Handles auto-hide after 5 seconds of inactivity
- Reappear on any interaction (click, drag, resize, rotate)
- Must remain minimal and never obstruct the dress

**Visual Hierarchy Rules**
- Body silhouette: always centered, acts as anchor
- Dresses: layer above silhouette, must remain unobstructed

**Motion and Feedback**
- No fast or aggressive animations
- Transitions should feel soft, deliberate, almost invisible

*Intent: Interactions should feel like trying on a dress — not using software.*

---

### 6. Constraints and Non-Negotiables

- No deviation from Figma layout or spacing
- Body silhouette remains centered at all times
- KyivType Sans is the only permitted typeface

---

### 7. Experience Principles

1. **Direct Manipulation Over Abstraction** — Users interact with dresses as physical objects
2. **Digital to Physical Continuity** — Supports real-world showroom decisions

---

## Mermaid Diagram

System flow: what receives input, how it processes, what it outputs.

```mermaid
flowchart TD
    U([User]) --> A[Click Accessory Icon]
    U --> B[Drag Item from Panel]
    U --> C[Click Face Input]
    U --> D[Click Body Silhouette]
    U --> E[Click SAY YES!]
    U --> F[Click × on Placed Item]

    A --> G{activeIcon state}
    G --> H[Right panel slides in\nshowing category grid]
    G --> I[Icon highlighted\nwith gold ring]

    B --> J{Dropped on stage?}
    J -- Yes --> K[placedItems state updated\nwith x, y, width, height, rotation]
    J -- No --> L[Ghost dismissed\nno state change]
    K --> M[Overlay rendered on canvas\nwith 4 resize handles + rotate + ×]
    M --> N[SAY YES! button\nappears via fade-in]
    M --> O[Handles auto-hide\nafter 5 seconds]

    C --> P[getUserMedia called\nCamera modal opens]
    P --> Q[User captures photo]
    Q --> R[Face placed in face slot\nvia placedItems.face\nwith oval clip-path]

    D --> S[Skin tone picker opens\n8 swatches + custom color input]
    S --> T[Canvas redraws body.png\nwith source-in composite fill]

    E --> V[saidYes = true\nshowConfetti = true]
    V --> W[180 gold confetti particles\nanimated via requestAnimationFrame]
    V --> X[Wedding March plays\nfrom 0:08 to 0:20]
    V --> Y[Panel + SAY YES! fade out]
    W --> Z[showConfetti = false\nafter 4.2 seconds]
    Z --> AA[CONGRATULATIONS message\nfades in at right side]

    F --> AB[Item removed from placedItems\nOverlay disappears]
```

---

## AI Direction Log

| # | What I Asked AI to Do | What AI Produced | What I Kept / Changed / Rejected — and Why |
|---|---|---|---|
| 1 | Set up the full Vite + React project scaffold, GitHub Actions deploy pipeline, and directory structure before any creative work | A proposed directory tree including a `docs/` folder at repo root and a `public/` folder for assets | Rejected both — kept docs inside `claude/docs/` only, moved assets to `src/assets/`. Approved the rest and had AI build it manually after `npm create vite` failed repeatedly due to interactive prompt conflicts |
| 2 | Implement the full Fitting Room screen from Figma (node `10:318`) — background, podium, wheel, body, accessory icons, right panel with dress grid | Full component with layout matching Figma, but drag-and-drop replaced with click-to-place overlay on the body silhouette | Rejected the click-to-place approach entirely. Directed AI to revert and rebuild with drag-from-panel → drop-on-stage interaction, ghost cursor, floating overlay with handles |
| 3 | Add drag, resize, rotate, and × controls to the captured face photo | Placed the face photo into the `placedItems` system — but image appeared as a square outside the face input area, handles were invisible, × button not visible | Rejected and reverted. Root cause: `overflow: hidden` on the container was clipping handles positioned outside the div, and the container was too small. Redirected to use `clip-path: ellipse(50% 50%)` on the `<img>` only — not the container — so handles render outside the element bounds unobstructed |
| 4 | Change the body silhouette color using a CSS color overlay when the user clicks on it | Applied `mix-blend-mode: color` overlay div inside `.fr-body` — colored the entire bounding rectangle, including transparent areas around the silhouette | Rejected. Directed AI to switch to a canvas-based approach: draw `body.png` to a `<canvas>`, then use `globalCompositeOperation: 'source-in'` to fill only the opaque silhouette pixels with the chosen color |
| 5 | Position the skin tone color picker panel at the exact location specified in the Figma design | First attempt: placed it at `left: 1092px, top: 723px` from an earlier `get_design_context` call. Second attempt after user said "check the file again": fetched `get_metadata` which returned the current coordinates `x: 1088, y: 683` | Kept the second result — `get_metadata` was more reliable than `get_design_context` for exact current coordinates when the node had been repositioned in Figma |

---

## Records of Resistance

| # | What AI Produced | Why I Rejected It | What I Did Instead |
|---|---|---|---|
| 1 | Rewrote the component to replace the body silhouette on click — removed all drag-and-drop code, the ghost cursor, handles, and resize/rotate logic entirely | The interaction concept was wrong. Clicking is too passive for a try-on experience; drag-and-drop is the intended UX because it mimics physically placing a dress on a body. The whole emotional arc of the feature was lost. | Directed AI to fully revert `FittingRoom.jsx` and `FittingRoom.css` to the drag-and-drop version. Stated explicitly that the interaction model was non-negotiable. |
| 2 | When positioning the congratulations text from Figma, also changed the font from KyivType Sans to Inter Bold without being asked | I never requested a font change. KyivType Sans is a locked rule in my Design Intent — it's the typeface that gives the screen its bridal editorial tone. Swapping it to Inter would make it look generic. | Reverted the font to KyivType Sans 400. Established a rule going forward: AI must explicitly confirm any unrequested changes to font, color, weight, or size before committing. |
| 3 | Used a `mix-blend-mode: color` overlay div inside `.fr-body` to tint the body silhouette color | The blend mode colored the entire bounding box rectangle — including the transparent areas around the silhouette shape. The result was a colored rectangle, not a colored body. It looked broken. | Directed AI to use a `<canvas>` element with `globalCompositeOperation: 'source-in'` — which fills only the opaque pixels of the PNG, leaving transparent areas untouched. This is the correct technique for tinting silhouettes. |

---

## Five Questions Reflection

**1. Can I defend this? Can I explain every major decision in this project?**
Yes, I can clearly explain and justify every major decision made throughout the project.

**2. Is this mine? Does this reflect my creative direction, or did I mostly follow AI's suggestions?**
Yes, this work is fully mine. I defined the creative direction and designed the experience intentionally in Figma before using AI. The AI supported execution, but the vision and decisions were driven by me.

**3. Did I verify? Did I check that things work the way I think they work?**
Yes, I tested each interaction as soon as it was generated to ensure it worked as intended. I evaluated whether to keep, refine, or redo elements to maintain a high-quality, functional interface.

**4. Would I teach this? Do I understand it well enough to explain it to someone else?**
Yes, I understand the process and decisions deeply enough to confidently explain and teach it to others.

**5. Is my documentation honest? Does my AI Direction Log accurately describe what I asked and what I changed?**
Yes, my documentation is accurate and transparent, clearly reflecting both my prompts and the iterations I made.

---

## How to Run Locally

```bash
npm install
npm run dev
# → http://localhost:5173/CharacterSelectionScreen/
```
