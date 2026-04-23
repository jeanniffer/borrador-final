import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import Desktop from './components/Desktop'
import Timeline from './components/Timeline'
import WordDocument from './components/WordDocument'
import { useDiscurso } from './hooks/useDiscurso'
import { SUBMIT_URL } from './config'

const MS_PER_STEP = 280

function buildTimeline(data) {
  const revDates = [...new Set(
    data.bloques.flatMap(b => b.revisiones.map(r => r.fecha))
  )].sort()

  if (revDates.length === 0) return {
    fechaInicio: '2026-01-02',
    fechaFin: '2026-01-02',
    min: new Date('2026-01-02T00:00:00').getTime(),
    max: new Date('2026-01-02T00:00:00').getTime(),
    milestones: [],
  }

  const firstDate = new Date(revDates[0] + 'T00:00:00')
  firstDate.setDate(firstDate.getDate() - 1)
  const fechaInicio = firstDate.toISOString().slice(0, 10)
  const fechaFin = revDates[revDates.length - 1]

  const milestones = revDates.map(fecha => {
    const bloque = data.bloques.find(b => b.revisiones.some(r => r.fecha === fecha))
    const rev = bloque?.revisiones.find(r => r.fecha === fecha)
    return {
      fecha,
      descripcion: rev?.noticia_titular?.slice(0, 60) || fecha,
    }
  })

  return {
    fechaInicio,
    fechaFin,
    min: new Date(fechaInicio + 'T00:00:00').getTime(),
    max: new Date(fechaFin + 'T00:00:00').getTime(),
    milestones,
  }
}

function addDay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

function MobileGate() {
  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#0a0a0a',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 32px', textAlign: 'center',
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 28 }}>🖥</div>
      <p style={{
        fontFamily: "'IBM Plex Sans', Arial, sans-serif",
        fontSize: '1rem', lineHeight: 1.7,
        maxWidth: 300, color: '#888',
        margin: 0,
      }}>
        Este proyecto está diseñado para verse desde una computadora.
      </p>
    </div>
  )
}

export default function App() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768)
  const [screen, setScreen] = useState('desktop')
  const { data } = useDiscurso()
  const { fechaInicio, fechaFin, min, max, milestones } = buildTimeline(data)
  const [fechaActual, setFechaActual] = useState(fechaInicio)
  const [playing, setPlaying] = useState(false)
  const activeIds = useRef(new Set())
  const scrollRef = useRef(null)
  const containerRef = useRef(null)
  const windowRef = useRef(null)
  const dragControls = useDragControls()
  const [windowW, setWindowW] = useState(null)
  const [windowH, setWindowH] = useState(null)

  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  useEffect(() => { setFechaActual(fechaInicio) }, [fechaInicio])

  useEffect(() => {
    if (screen === 'document') setPlaying(true)
    else setPlaying(false)
  }, [screen])

  useEffect(() => {
    if (!playing || screen !== 'document') return
    const id = setInterval(() => {
      setFechaActual(prev => {
        if (prev >= fechaFin) {
          activeIds.current = new Set()
          if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
          return fechaInicio
        }
        return addDay(prev)
      })
    }, MS_PER_STEP)
    return () => clearInterval(id)
  }, [playing, screen, fechaFin, fechaInicio])

  useEffect(() => {
    if (!data || screen !== 'document') return
    const nowActive = new Set(
      data.bloques
        .filter(b => b.revisiones.some(r => fechaActual >= r.fecha))
        .map(b => b.id)
    )
    const newId = [...nowActive].find(id => !activeIds.current.has(id))
    if (newId && scrollRef.current) {
      const el = scrollRef.current.querySelector(`[data-bloque-id="${newId}"]`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    activeIds.current = nowActive
  }, [fechaActual, data, screen])

  if (mobile) return <MobileGate />

  function handleClose() {
    setScreen('desktop')
    setPlaying(false)
    setWindowW(null)
    setWindowH(null)
  }

  function handleResizePointerDown(e) {
    e.stopPropagation()
    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    const rect = windowRef.current?.getBoundingClientRect()
    const startW = rect?.width || 500
    const startH = rect?.height || 400

    function onMove(ev) {
      const containerRect = containerRef.current?.getBoundingClientRect()
      const maxW = containerRect ? containerRect.width * 0.97 : 900
      const maxH = containerRect ? containerRect.height * 0.97 : 700
      setWindowW(Math.min(maxW, Math.max(280, startW + ev.clientX - startX)))
      setWindowH(Math.min(maxH, Math.max(200, startH + ev.clientY - startY)))
    }
    function onUp() {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Laptop container — maintains canaima.png aspect ratio (1540:843) */}
      <div style={{
        position: 'relative',
        width: 'min(100vw, calc(100vh * 1540 / 843))',
        height: 'min(100vh, calc(100vw * 843 / 1540))',
        flexShrink: 0,
      }}>
        {/* Screen content — positioned within the transparent screen opening */}
        <div
          ref={containerRef}
          style={{
            position: 'absolute',
            left: '13.8%',
            top: '18.0%',
            width: '66.0%',
            height: '61.8%',
            overflow: 'hidden',
          }}
        >
          {/* Desktop always visible as background */}
          <Desktop onOpen={() => setScreen('document')} />

          {/* Document window — floats over desktop */}
          <AnimatePresence>
            {screen === 'document' && (
              <motion.div
                ref={windowRef}
                drag
                dragControls={dragControls}
                dragListener={false}
                dragMomentum={false}
                dragConstraints={containerRef}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                style={{
                  position: 'absolute',
                  top: '2%',
                  left: '2%',
                  width: windowW ? `${windowW}px` : '96%',
                  height: windowH ? `${windowH}px` : '96%',
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.4)',
                  overflow: 'hidden',
                  border: '1px solid #1a9aad',
                  borderRadius: 2,
                }}
              >
                {/* LibreOffice title bar — drag handle */}
                <div
                  onPointerDown={e => dragControls.start(e)}
                  style={{
                    background: 'linear-gradient(to bottom, #0d7a8a, #0a5f6e)',
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 8px',
                    borderBottom: '1px solid #1a9aad',
                    cursor: 'grab',
                    flexShrink: 0,
                    userSelect: 'none',
                  }}
                >
                  <div style={{ display: 'flex', gap: 4, marginRight: 10 }}>
                    <div
                      onClick={handleClose}
                      style={{
                        width: 14, height: 14, borderRadius: 2,
                        background: '#c0392b', border: '1px solid #922b21',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, color: '#fff', cursor: 'pointer',
                      }}
                    >✕</div>
                    <div style={{ width: 14, height: 14, borderRadius: 2, background: '#e67e22', border: '1px solid #b06010' }} />
                    <div style={{ width: 14, height: 14, borderRadius: 2, background: '#27ae60', border: '1px solid #1a7a40' }} />
                  </div>
                  <span style={{
                    flex: 1, textAlign: 'center',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '11px', color: '#c8e8a0',
                    letterSpacing: '0.05em', fontWeight: 600,
                  }}>
                    BORRADOR FINAL.docx — LibreOffice Writer
                  </span>
                </div>

                <WordDocument
                  discurso={data}
                  fechaActual={fechaActual}
                  scrollRef={scrollRef}
                />

                <Timeline
                  fechaActual={fechaActual}
                  onChange={f => { setFechaActual(f); setPlaying(false) }}
                  playing={playing}
                  onTogglePlay={() => setPlaying(p => !p)}
                  milestones={milestones}
                  min={min}
                  max={max}
                  submitUrl={SUBMIT_URL}
                />

                {/* Resize corner handle */}
                <div
                  onPointerDown={handleResizePointerDown}
                  style={{
                    position: 'absolute',
                    bottom: 0, right: 0,
                    width: 18, height: 18,
                    cursor: 'se-resize',
                    zIndex: 20,
                    background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.18) 40%)',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Laptop frame overlay */}
        <img
          src="/canaima.png"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 50,
            display: 'block',
          }}
        />
      </div>
    </div>
  )
}
