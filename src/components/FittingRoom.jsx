import { useState, useEffect, useRef, useCallback } from 'react'
import './FittingRoom.css'

import dress1 from '../assets/dress1.png'
import dress2 from '../assets/dress2.png'
import dress3 from '../assets/dress3.png'
import dress4 from '../assets/dress4.png'
import dress5 from '../assets/dress5.png'
import dress6 from '../assets/dressed-5.png'
import dress7 from '../assets/dressed-6.png'
import dress8 from '../assets/dressed-8.png'
import hair1 from '../assets/hair1.png'
import hair2 from '../assets/hair2.png'
import hair3 from '../assets/hair3.png'
import hair4 from '../assets/hair4.png'
import hair5 from '../assets/hair5.png'
import hair6 from '../assets/hair6.png'
import hair7 from '../assets/hair7.png'
import hair8 from '../assets/hair8.png'
import podium from '../assets/podium.png'
import body from '../assets/body.png'
import wheel from '../assets/wheel.svg'
import iconHair from '../assets/icon-hair.png'
import iconMakeup from '../assets/icon-makeup.png'
import iconJewelry from '../assets/icon-jewelry.png'
import iconDress from '../assets/icon-dress.png'
import iconShoes from '../assets/icon-shoes.png'
import iconBouquet from '../assets/icon-bouquet.png'
import iconAccessory from '../assets/icon-accessory.png'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

const DROP_ZONE = { left: 668, top: 202, right: 1464, bottom: 1000 }

const ACCESSORY_ICONS = [
  { id: 'hair',      label: 'Hair',      icon: iconHair,      left: 797.63,  top: 263.25 },
  { id: 'dress',     label: 'Dress',     icon: iconDress,     left: 917.99,  top: 216.96 },
  { id: 'shoes',     label: 'Shoes',     icon: iconShoes,     left: 1051.18, top: 279.63 },
  { id: 'accessory', label: 'Accessory', icon: iconAccessory, left: 1094.63, top: 382.91 },
  { id: 'bouquet',   label: 'Bouquet',   icon: iconBouquet,   left: 1062.58, top: 498.29 },
  { id: 'jewelry',   label: 'Jewelry',   icon: iconJewelry,   left: 771.27,  top: 498.29 },
  { id: 'makeup',    label: 'Makeup',    icon: iconMakeup,    left: 744.21,  top: 382.91 },
]

const INITIAL_DRESSES = [
  { id: 1, src: dress1 },
  { id: 2, src: dress2 },
  { id: 3, src: dress3 },
  { id: 4, src: dress4 },
  { id: 5, src: dress5 },
  { id: 6, src: dress6 },
  { id: 7, src: dress7 },
  { id: 8, src: dress8 },
]

const HAIR_OPTIONS = [
  { id: 1, src: hair1 },
  { id: 2, src: hair2 },
  { id: 3, src: hair3 },
  { id: 4, src: hair4 },
  { id: 5, src: hair5 },
  { id: 6, src: hair6 },
  { id: 7, src: hair7 },
  { id: 8, src: hair8 },
]

const PANEL_ICONS = ['dress', 'hair']

export default function FittingRoom() {
  const wrapperRef = useRef(null)
  const canvasRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [activeIcon, setActiveIcon] = useState(null)
  const [dresses, setDresses] = useState(INITIAL_DRESSES)

  // Ghost drag from panel: { src, ghostX, ghostY }
  const [panelDrag, setPanelDrag] = useState(null)

  // Placed dress on stage: { src, x, y, width, height, rotation }
  const [placedDress, setPlacedDress] = useState(null)

  // Active adjustment gesture
  const adjustDrag = useRef(null)

  // Handles visibility with 5-second auto-hide
  const [showHandles, setShowHandles] = useState(false)
  const handlesTimer = useRef(null)

  function revealHandles() {
    setShowHandles(true)
    clearTimeout(handlesTimer.current)
    handlesTimer.current = setTimeout(() => setShowHandles(false), 5000)
  }

  // ── Viewport scaling ──────────────────────────────────────────────────────
  useEffect(() => {
    function updateScale() {
      if (!wrapperRef.current) return
      const sx = wrapperRef.current.clientWidth / DESIGN_WIDTH
      const sy = wrapperRef.current.clientHeight / DESIGN_HEIGHT
      setScale(Math.min(sx, sy))
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  // ── Canvas-coord helper ───────────────────────────────────────────────────
  const toCanvas = useCallback((clientX, clientY) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return {
      x: (clientX - rect.left) / scale,
      y: (clientY - rect.top) / scale,
    }
  }, [scale])

  // ── Global mouse move / up ────────────────────────────────────────────────
  useEffect(() => {
    function onMouseMove(e) {
      if (panelDrag) {
        setPanelDrag(prev => ({ ...prev, ghostX: e.clientX, ghostY: e.clientY }))
        return
      }

      const adj = adjustDrag.current
      if (!adj) return

      const dx = (e.clientX - adj.startClientX) / scale
      const dy = (e.clientY - adj.startClientY) / scale

      if (adj.type === 'move') {
        setPlacedDress(prev => prev && ({
          ...prev,
          x: adj.origX + dx,
          y: adj.origY + dy,
        }))
      } else if (adj.type === 'rotate') {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return
        const cx = adj.pivotX * scale + rect.left
        const cy = adj.pivotY * scale + rect.top
        const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI)
        setPlacedDress(prev => prev && ({
          ...prev,
          rotation: adj.origRot + (angle - adj.startAngle),
        }))
      } else {
        // Corner resize — opposite corner stays fixed
        const { corner, origX, origY, origW, origH } = adj
        const halfW = origW / 2
        const halfH = origH / 2

        const fixedX = (corner === 'tl' || corner === 'bl') ? origX + halfW : origX - halfW
        const fixedY = (corner === 'tl' || corner === 'tr') ? origY + halfH : origY - halfH

        const dragX = (corner === 'tl' || corner === 'bl') ? origX - halfW + dx : origX + halfW + dx
        const dragY = (corner === 'tl' || corner === 'tr') ? origY - halfH + dy : origY + halfH + dy

        const newW = Math.max(60, Math.abs(dragX - fixedX))
        const newH = Math.max(80, Math.abs(dragY - fixedY))

        setPlacedDress(prev => prev && ({
          ...prev,
          x: (fixedX + dragX) / 2,
          y: (fixedY + dragY) / 2,
          width: newW,
          height: newH,
        }))
      }
    }

    function onMouseUp(e) {
      if (panelDrag) {
        const pt = toCanvas(e.clientX, e.clientY)
        const inZone =
          pt.x >= DROP_ZONE.left && pt.x <= DROP_ZONE.right &&
          pt.y >= DROP_ZONE.top  && pt.y <= DROP_ZONE.bottom

        if (inZone) {
          setPlacedDress({
            src: panelDrag.src,
            x: pt.x,
            y: pt.y,
            width: 200,
            height: 420,
            rotation: 0,
          })
          revealHandles()
        }
        setPanelDrag(null)
        return
      }
      adjustDrag.current = null
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [panelDrag, scale, toCanvas])

  // ── Gesture starters ──────────────────────────────────────────────────────
  function startMove(e) {
    e.stopPropagation()
    if (!placedDress) return
    revealHandles()
    adjustDrag.current = {
      type: 'move',
      startClientX: e.clientX, startClientY: e.clientY,
      origX: placedDress.x, origY: placedDress.y,
    }
  }

  function startResize(e, corner) {
    e.stopPropagation()
    if (!placedDress) return
    revealHandles()
    adjustDrag.current = {
      type: corner,
      startClientX: e.clientX, startClientY: e.clientY,
      origX: placedDress.x, origY: placedDress.y,
      origW: placedDress.width, origH: placedDress.height,
    }
  }

  function startRotate(e) {
    e.stopPropagation()
    if (!placedDress) return
    revealHandles()
    const rect = canvasRef.current?.getBoundingClientRect()
    const cx = placedDress.x * scale + (rect?.left ?? 0)
    const cy = placedDress.y * scale + (rect?.top  ?? 0)
    adjustDrag.current = {
      type: 'rotate',
      startClientX: e.clientX, startClientY: e.clientY,
      origRot: placedDress.rotation,
      startAngle: Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI),
      pivotX: placedDress.x, pivotY: placedDress.y,
    }
  }

  // ── Add dress from file ───────────────────────────────────────────────────
  function handleAddDress() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      setDresses(prev => [...prev, { id: Date.now(), src: URL.createObjectURL(file) }])
    }
    input.click()
  }

  return (
    <div className="fr-wrapper" ref={wrapperRef} style={{ cursor: panelDrag ? 'grabbing' : 'default' }}>
      <div
        className="fr-canvas"
        ref={canvasRef}
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        {/* Background */}
        <div className="fr-bg" />

        {/* Title */}
        <h1 className="fr-title">
          <span className="fr-title-main">SAY YES</span>
          <span className="fr-title-sub">to the dress</span>
        </h1>

        {/* Podium */}
        <div className="fr-podium">
          <img src={podium} alt="podium" draggable={false} />
        </div>

        {/* Wheel */}
        <div className="fr-wheel">
          <img src={wheel} alt="" draggable={false} />
        </div>

        {/* Body silhouette */}
        <div className="fr-body">
          <img src={body} alt="character" draggable={false} />
        </div>

        {/* Placed dress overlay */}
        {placedDress && (
          <div
            className="fr-placed"
            style={{
              left: placedDress.x - placedDress.width / 2,
              top: placedDress.y - placedDress.height / 2,
              width: placedDress.width,
              height: placedDress.height,
              transform: `rotate(${placedDress.rotation}deg)`,
            }}
            onMouseDown={startMove}
          >
            <img src={placedDress.src} alt="placed dress" draggable={false} />

            <div className={`fr-controls ${showHandles ? 'fr-controls--visible' : ''}`}>
              <div className="fr-rot-handle" onMouseDown={startRotate} title="Rotate" />
              <div className="fr-handle fr-handle--tl" onMouseDown={e => startResize(e, 'tl')} />
              <div className="fr-handle fr-handle--tr" onMouseDown={e => startResize(e, 'tr')} />
              <div className="fr-handle fr-handle--bl" onMouseDown={e => startResize(e, 'bl')} />
              <div className="fr-handle fr-handle--br" onMouseDown={e => startResize(e, 'br')} />
              <button
                className="fr-remove-btn"
                onClick={e => { e.stopPropagation(); setPlacedDress(null) }}
                title="Remove"
              >×</button>
            </div>
          </div>
        )}

        {/* Accessory icon buttons */}
        {ACCESSORY_ICONS.map(({ id, label, icon, left, top }) => (
          <button
            key={id}
            className={`fr-icon-btn ${activeIcon === id ? 'fr-icon-btn--active' : ''}`}
            style={{ left, top }}
            onClick={() => setActiveIcon(activeIcon === id ? null : id)}
            title={label}
          >
            <img src={icon} alt={label} draggable={false} />
          </button>
        ))}

        {/* Say yes CTA */}
        <button className="fr-cta">Say, yes!</button>

        {/* Right panel — visible when dress or hair icon is active */}
        <div className={`fr-panel ${PANEL_ICONS.includes(activeIcon) ? 'fr-panel--visible' : ''}`}>

          {/* Dress grid */}
          {activeIcon === 'dress' && (
            <div className="fr-item-grid">
              {dresses.map((dress, i) => (
                <button
                  key={dress.id}
                  className={`fr-item-card ${i === 2 ? 'fr-item-card--wide' : ''}`}
                  onMouseDown={e => {
                    e.preventDefault()
                    setPanelDrag({ src: dress.src, ghostX: e.clientX, ghostY: e.clientY })
                  }}
                  title="Drag to body to try on"
                >
                  <img src={dress.src} alt={`Dress ${i + 1}`} draggable={false} />
                </button>
              ))}
            </div>
          )}

          {/* Hair grid */}
          {activeIcon === 'hair' && (
            <div className="fr-item-grid">
              {HAIR_OPTIONS.map((h) => (
                <button
                  key={h.id}
                  className="fr-item-card"
                  title="Drag to body to try on"
                  onMouseDown={e => {
                    e.preventDefault()
                    setPanelDrag({ src: h.src, ghostX: e.clientX, ghostY: e.clientY })
                  }}
                >
                  <img src={h.src} alt={`Hair ${h.id}`} draggable={false} />
                </button>
              ))}
            </div>
          )}

          <div className="fr-panel-footer">
            <button className="fr-add-btn">
              <span className="fr-plus-h" />
              <span className="fr-plus-v" />
            </button>
          </div>
        </div>
      </div>

      {/* Drag ghost — fixed to viewport */}
      {panelDrag && (
        <div
          className="fr-ghost"
          style={{ left: panelDrag.ghostX, top: panelDrag.ghostY }}
        >
          <img src={panelDrag.src} alt="" draggable={false} />
        </div>
      )}
    </div>
  )
}
