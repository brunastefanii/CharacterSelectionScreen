import { useState, useEffect, useRef, useCallback } from 'react'
import { removeBackground } from '@imgly/background-removal'
import './FittingRoom.css'
import weddingMarch from '../assets/Classicals.de - Mendelssohn, Felix - Wedding March - Op. 61, No. 9 - Arranged for Piano.mp3'

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
import logoHanger from '../assets/logo-hanger.png'
import logoText from '../assets/logo-text.png'
import faceInput from '../assets/face-input.png'
import iconHair from '../assets/icon-hair-new.png'
import iconMakeup from '../assets/icon-makeup-new.png'
import iconJewelry from '../assets/icon-jewelry-new.png'
import iconDress from '../assets/icon-dress-new.png'
import iconVeil from '../assets/icon-veil.png'
import iconShoes from '../assets/icon-shoes-new.png'
import iconBouquet from '../assets/icon-bouquet-new.png'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

const DROP_ZONE = { left: 668, top: 202, right: 1464, bottom: 1000 }

const ACCESSORY_ICONS = [
  { id: 'hair',    label: 'Hair',    icon: iconHair,    left: 792.94,  top: 240.57 },
  { id: 'dress',   label: 'Dress',   icon: iconDress,   left: 953.03,  top: 175.19 },
  { id: 'veil',    label: 'Veil',    icon: iconVeil,    left: 1104.28, top: 236.56 },
  { id: 'shoes',   label: 'Shoes',   icon: iconShoes,   left: 1157.63, top: 363.37 },
  { id: 'bouquet', label: 'Bouquet', icon: iconBouquet, left: 1118.27, top: 505.04 },
  { id: 'jewelry', label: 'Jewelry', icon: iconJewelry, left: 760.58,  top: 505.04 },
  { id: 'makeup',  label: 'Makeup',  icon: iconMakeup,  left: 727.35,  top: 363.37 },
]

// Default drop size per category
const ITEM_DEFAULTS = {
  dress: { width: 200, height: 420 },
  hair:  { width: 150, height: 200 },
}
const FALLBACK_DEFAULTS = { width: 150, height: 200 }

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

const PANEL_ICONS = ['dress', 'hair', 'shoes', 'makeup', 'bouquet', 'jewelry', 'accessory']

const INITIAL_CATEGORY_ITEMS = {
  dress:   INITIAL_DRESSES.map(d => ({ ...d })),
  hair:    HAIR_OPTIONS.map(h => ({ ...h })),
  veil:    [],
  shoes:   [],
  makeup:  [],
  bouquet: [],
  jewelry: [],
}

export default function FittingRoom() {
  const wrapperRef = useRef(null)
  const canvasRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [activeIcon, setActiveIcon] = useState(null)
  const [categoryItems, setCategoryItems] = useState(INITIAL_CATEGORY_ITEMS)
  const [isProcessing, setIsProcessing] = useState(false)
  const [saidYes, setSaidYes] = useState(false)
  const audioRef = useRef(null)
  const audioTimerRef = useRef(null)

  // Face camera
  const [faceSrc, setFaceSrc] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  function openCamera() {
    setShowCamera(true)
  }

  useEffect(() => {
    if (!showCamera) return
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then(stream => {
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
      })
      .catch(err => {
        console.error('Camera access denied:', err)
        setShowCamera(false)
      })
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
        streamRef.current = null
      }
    }
  }, [showCamera])

  function capturePhoto() {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    setFaceSrc(canvas.toDataURL('image/png'))
    closeCamera()
  }

  function closeCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }

  function playWeddingMarch() {
    if (!audioRef.current) {
      audioRef.current = new Audio(weddingMarch)
      audioRef.current.volume = 0.7
    }
    audioRef.current.currentTime = 8
    audioRef.current.play()
    clearTimeout(audioTimerRef.current)
    audioTimerRef.current = setTimeout(() => {
      audioRef.current.pause()
      audioRef.current.currentTime = 8
    }, 12000)
  }

  // Confetti
  const [showConfetti, setShowConfetti] = useState(false)
  const confettiCanvasRef = useRef(null)
  const confettiAnimRef = useRef(null)

  useEffect(() => {
    if (!showConfetti) return
    const canvas = confettiCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const COLORS = ['#FFD700', '#FFC200', '#C8A97E', '#E5B800', '#FFE566', '#D4AF37', '#FFF0A0']
    const particles = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height * 0.6,
      w: Math.random() * 14 + 6,
      h: Math.random() * 7 + 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.18,
      vx: (Math.random() - 0.5) * 2.5,
      vy: Math.random() * 2.5 + 1.5,
      shape: Math.random() > 0.4 ? 'rect' : 'circle',
      opacity: 1,
    }))

    const DURATION = 4200
    let startTime = null

    function animate(ts) {
      if (!startTime) startTime = ts
      const elapsed = ts - startTime
      const progress = elapsed / DURATION

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.06
        p.rotation += p.rotSpeed
        p.opacity = progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.fillStyle = p.color
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        }
        ctx.restore()
      }

      if (elapsed < DURATION) {
        confettiAnimRef.current = requestAnimationFrame(animate)
      } else {
        setShowConfetti(false)
      }
    }

    confettiAnimRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(confettiAnimRef.current)
  }, [showConfetti])

  // Ghost drag from panel: { src, ghostX, ghostY, category }
  const [panelDrag, setPanelDrag] = useState(null)

  // Placed items per category: { [category]: { src, x, y, width, height, rotation } }
  const [placedItems, setPlacedItems] = useState({})

  // Active adjustment gesture
  const adjustDrag = useRef(null)

  // Which category's handles are currently visible (auto-hides after 5 s)
  const [showHandlesFor, setShowHandlesFor] = useState(null)
  const handlesTimer = useRef(null)

  function revealHandles(category) {
    setShowHandlesFor(category)
    clearTimeout(handlesTimer.current)
    handlesTimer.current = setTimeout(() => setShowHandlesFor(null), 5000)
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
      const cat = adj.category

      if (adj.type === 'move') {
        setPlacedItems(prev => {
          const item = prev[cat]
          if (!item) return prev
          return { ...prev, [cat]: { ...item, x: adj.origX + dx, y: adj.origY + dy } }
        })
      } else if (adj.type === 'rotate') {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return
        const cx = adj.pivotX * scale + rect.left
        const cy = adj.pivotY * scale + rect.top
        const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI)
        setPlacedItems(prev => {
          const item = prev[cat]
          if (!item) return prev
          return { ...prev, [cat]: { ...item, rotation: adj.origRot + (angle - adj.startAngle) } }
        })
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

        setPlacedItems(prev => {
          const item = prev[cat]
          if (!item) return prev
          return { ...prev, [cat]: { ...item, x: (fixedX + dragX) / 2, y: (fixedY + dragY) / 2, width: newW, height: newH } }
        })
      }
    }

    function onMouseUp(e) {
      if (panelDrag) {
        const pt = toCanvas(e.clientX, e.clientY)
        const inZone =
          pt.x >= DROP_ZONE.left && pt.x <= DROP_ZONE.right &&
          pt.y >= DROP_ZONE.top  && pt.y <= DROP_ZONE.bottom

        if (inZone) {
          const cat = panelDrag.category
          const defaults = ITEM_DEFAULTS[cat] ?? FALLBACK_DEFAULTS
          setPlacedItems(prev => ({
            ...prev,
            [cat]: { src: panelDrag.src, x: pt.x, y: pt.y, ...defaults, rotation: 0 },
          }))
          revealHandles(cat)
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
  function startMove(e, category) {
    e.stopPropagation()
    const item = placedItems[category]
    if (!item) return
    revealHandles(category)
    adjustDrag.current = {
      type: 'move', category,
      startClientX: e.clientX, startClientY: e.clientY,
      origX: item.x, origY: item.y,
    }
  }

  function startResize(e, corner, category) {
    e.stopPropagation()
    const item = placedItems[category]
    if (!item) return
    revealHandles(category)
    adjustDrag.current = {
      type: corner, category,
      startClientX: e.clientX, startClientY: e.clientY,
      origX: item.x, origY: item.y,
      origW: item.width, origH: item.height,
    }
  }

  function startRotate(e, category) {
    e.stopPropagation()
    const item = placedItems[category]
    if (!item) return
    revealHandles(category)
    const rect = canvasRef.current?.getBoundingClientRect()
    const cx = item.x * scale + (rect?.left ?? 0)
    const cy = item.y * scale + (rect?.top  ?? 0)
    adjustDrag.current = {
      type: 'rotate', category,
      startClientX: e.clientX, startClientY: e.clientY,
      origRot: item.rotation,
      startAngle: Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI),
      pivotX: item.x, pivotY: item.y,
    }
  }

  function removeItem(category) {
    setPlacedItems(prev => {
      const next = { ...prev }
      delete next[category]
      return next
    })
  }

  // ── Upload image for the active category ─────────────────────────────────
  function handleAddItem() {
    const category = activeIcon
    if (!category) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return
      setIsProcessing(true)
      try {
        const blob = await removeBackground(file)
        const url = URL.createObjectURL(blob)
        setCategoryItems(prev => ({
          ...prev,
          [category]: [...prev[category], { id: Date.now(), src: url, isUploaded: true }],
        }))
      } catch (err) {
        console.error('Background removal failed:', err)
        setCategoryItems(prev => ({
          ...prev,
          [category]: [...prev[category], { id: Date.now(), src: URL.createObjectURL(file), isUploaded: true }],
        }))
      } finally {
        setIsProcessing(false)
      }
    }
    input.click()
  }

  function handleDeleteItem(category, id) {
    setCategoryItems(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id),
    }))
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

        {/* Logo */}
        <div className="fr-logo">
          <div className="fr-logo-hanger">
            <img src={logoHanger} alt="" draggable={false} />
          </div>
          <div className="fr-logo-text">
            <img src={logoText} alt="Say Yes to the Dress" draggable={false} />
          </div>
        </div>

        {/* Podium */}
        <div className="fr-podium">
          <img src={podium} alt="podium" draggable={false} />
        </div>

        {/* Wheel */}
        <div className="fr-wheel">
          <img src={wheel} alt="" draggable={false} />
        </div>

        {/* Processing overlay */}
        {isProcessing && (
          <div className="fr-processing">
            <div className="fr-processing-card">
              <div className="fr-processing-spinner" />
              <p className="fr-processing-label">Removing background…</p>
              <p className="fr-processing-sub">Your dress will be ready in a moment</p>
            </div>
          </div>
        )}

        {/* Body silhouette */}
        <div className="fr-body">
          <img src={body} alt="character" draggable={false} />
        </div>

        {/* Face input — click to capture */}
        <div className="fr-face-input" onClick={openCamera} title="Click to take a photo">
          <img
            src={faceSrc ?? faceInput}
            alt="face"
            draggable={false}
            className={faceSrc ? 'fr-face-captured' : ''}
          />
        </div>

        {/* Placed items — one per category */}
        {Object.entries(placedItems).map(([category, item]) => (
          <div
            key={category}
            className="fr-placed"
            style={{
              left: item.x - item.width / 2,
              top:  item.y - item.height / 2,
              width: item.width,
              height: item.height,
              transform: `rotate(${item.rotation}deg)`,
            }}
            onMouseDown={e => startMove(e, category)}
          >
            <img src={item.src} alt={`placed ${category}`} draggable={false} />

            <div className={`fr-controls ${showHandlesFor === category ? 'fr-controls--visible' : ''}`}>
              <div className="fr-rot-handle" onMouseDown={e => startRotate(e, category)} title="Rotate" />
              <div className="fr-handle fr-handle--tl" onMouseDown={e => startResize(e, 'tl', category)} />
              <div className="fr-handle fr-handle--tr" onMouseDown={e => startResize(e, 'tr', category)} />
              <div className="fr-handle fr-handle--bl" onMouseDown={e => startResize(e, 'bl', category)} />
              <div className="fr-handle fr-handle--br" onMouseDown={e => startResize(e, 'br', category)} />
              <button
                className="fr-remove-btn"
                onClick={e => { e.stopPropagation(); removeItem(category) }}
                title="Remove"
              >×</button>
            </div>
          </div>
        ))}

        {/* Accessory icon buttons */}
        {ACCESSORY_ICONS.map(({ id, label, icon, left, top }) => (
          <button
            key={id}
            className={`fr-icon-btn ${activeIcon === id ? 'fr-icon-btn--active' : ''}`}
            style={{ left, top }}
            onClick={() => {
              setActiveIcon(activeIcon === id ? null : id)
              setSaidYes(false)
            }}
            title={label}
          >
            <img src={icon} alt={label} draggable={false} />
          </button>
        ))}

        {/* Say yes CTA */}
        {placedItems.dress && (
          <button
            className={`fr-cta ${saidYes ? 'fr-cta--fadeout' : ''}`}
            onClick={() => { setShowConfetti(true); setSaidYes(true); playWeddingMarch() }}
          >SAY YES!</button>
        )}

        {/* Congratulations message — appears after confetti finishes */}
        {saidYes && !showConfetti && (
          <div className="fr-congrats">
            <p className="fr-congrats-text">CONGRATULATIONS!</p>
            <p className="fr-congrats-sub">It's official. You said YES to the dress</p>
          </div>
        )}

        {/* Right panel — visible when dress or hair icon is active */}
        <div className={`fr-panel ${PANEL_ICONS.includes(activeIcon) && !saidYes ? 'fr-panel--visible' : ''}`}>

          {/* Item grid — shared across all categories */}
          {activeIcon && (
            <div className="fr-item-grid">
              {(categoryItems[activeIcon] ?? []).map((item, i) => (
                <button
                  key={item.id}
                  className={`fr-item-card ${activeIcon === 'dress' && i === 2 ? 'fr-item-card--wide' : ''}`}
                  onMouseDown={e => {
                    e.preventDefault()
                    setPanelDrag({ src: item.src, ghostX: e.clientX, ghostY: e.clientY, category: activeIcon })
                  }}
                  title="Drag to body to try on"
                >
                  <img src={item.src} alt={`${activeIcon} ${i + 1}`} draggable={false} />
                  <div
                    role="button"
                    className="fr-item-delete"
                    onMouseDown={e => e.stopPropagation()}
                    onClick={e => { e.stopPropagation(); handleDeleteItem(activeIcon, item.id) }}
                    title="Remove"
                  >×</div>
                </button>
              ))}
            </div>
          )}

          <div className="fr-panel-footer">
            <button className="fr-add-btn" onClick={handleAddItem} title="Upload image">
              <span className="fr-plus-h" />
              <span className="fr-plus-v" />
            </button>
          </div>
        </div>
      </div>

      {/* Camera modal — fixed to viewport */}
      {showCamera && (
        <div className="fr-camera-overlay">
          <div className="fr-camera-modal">
            <video
              ref={videoRef}
              className="fr-camera-video"
              autoPlay
              playsInline
              muted
            />
            <div className="fr-camera-actions">
              <button className="fr-camera-capture" onClick={capturePhoto} title="Take photo" />
              <button className="fr-camera-cancel" onClick={closeCamera}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Confetti — fixed to viewport */}
      {showConfetti && (
        <canvas ref={confettiCanvasRef} className="fr-confetti" />
      )}

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
