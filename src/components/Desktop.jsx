import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function TopPanel() {
  const now = new Date()
  const fecha = now.toLocaleDateString('es-VE', { day: 'numeric', month: 'short' })
  const hora = now.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{
      height: 28,
      flexShrink: 0,
      background: 'rgba(10, 10, 10, 0.85)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      fontSize: '12px',
      fontFamily: "'IBM Plex Sans', Arial, sans-serif",
      color: '#e8e8e8',
      userSelect: 'none',
      position: 'relative',
    }}>
      {/* Izquierda — menú */}
      <div style={{ display: 'flex', gap: 16, zIndex: 1 }}>
        <span style={{ cursor: 'default', opacity: 0.9 }}>Aplicaciones</span>
        <span style={{ cursor: 'default', opacity: 0.9 }}>Lugares</span>
      </div>

      {/* Centro — absolutamente centrado */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0,
        textAlign: 'center',
        fontSize: '11px',
        opacity: 0.85,
        pointerEvents: 'none',
      }}>
        {fecha} &nbsp; {hora}
      </div>

      {/* Derecha — íconos sistema */}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, opacity: 0.7, fontSize: '13px', zIndex: 1 }}>
        <span>🔊</span>
        <span>🌐</span>
        <span>⏻</span>
      </div>
    </div>
  )
}

function FileIcon({ onDoubleClick }) {
  const [selected, setSelected] = useState(false)

  return (
    <motion.div
      drag
      dragMomentum={false}
      onClick={() => setSelected(true)}
      onDoubleClick={onDoubleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        cursor: 'default',
        width: 72,
        padding: '6px 4px',
        borderRadius: 6,
        background: selected ? 'rgba(255,255,255,0.15)' : 'transparent',
        userSelect: 'none',
      }}
    >
      <div style={{
        width: 44,
        height: 52,
        position: 'relative',
        filter: selected ? 'brightness(1.15)' : 'none',
      }}>
        <div style={{
          width: 38,
          height: 47,
          background: 'white',
          borderRadius: '2px 7px 2px 2px',
          border: '1px solid rgba(0,0,0,0.2)',
          position: 'absolute',
          bottom: 0, left: 3,
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: 5,
        }}>
          {[70, 85, 70, 85, 60].map((w, i) => (
            <div key={i} style={{
              width: `${w}%`, height: 2,
              background: '#ddd',
              borderRadius: 1,
              marginBottom: 2,
            }} />
          ))}
          <div style={{
            background: '#1565C0',
            color: 'white',
            fontSize: '7px',
            fontFamily: "'IBM Plex Sans', Arial, sans-serif",
            fontWeight: 600,
            padding: '1px 4px',
            borderRadius: 2,
            letterSpacing: '0.05em',
          }}>DOCX</div>
        </div>
        <div style={{
          position: 'absolute',
          top: 0, right: 3,
          width: 0, height: 0,
          borderLeft: '8px solid #e0e0e0',
          borderTop: '8px solid transparent',
        }} />
      </div>

      <span style={{
        fontFamily: "'IBM Plex Sans', Arial, sans-serif",
        fontSize: '10px',
        color: 'white',
        textAlign: 'center',
        textShadow: '0 1px 3px rgba(0,0,0,0.6)',
        background: selected ? 'rgba(30,120,180,0.6)' : 'transparent',
        padding: '1px 3px',
        borderRadius: 3,
        lineHeight: 1.4,
      }}>
        BORRADOR<br />FINAL.docx
      </span>
    </motion.div>
  )
}

function FolderIcon() {
  const [selected, setSelected] = useState(false)
  return (
    <motion.div
      drag dragMomentum={false}
      onClick={() => setSelected(true)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 6, cursor: 'default', width: 72, padding: '6px 4px',
        borderRadius: 6, userSelect: 'none',
        background: selected ? 'rgba(255,255,255,0.15)' : 'transparent',
      }}
    >
      <div style={{ width: 44, height: 38, position: 'relative' }}>
        <div style={{
          width: 40, height: 32, background: '#f5c842',
          borderRadius: '2px 7px 4px 4px',
          border: '1px solid rgba(0,0,0,0.15)',
          position: 'absolute', bottom: 0, left: 2,
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        }} />
        <div style={{
          width: 18, height: 5, background: '#e8b830',
          borderRadius: '3px 3px 0 0',
          position: 'absolute', top: 0, left: 2,
        }} />
      </div>
      <span style={{
        fontFamily: "'IBM Plex Sans', Arial, sans-serif",
        fontSize: '10px', color: 'white', textAlign: 'center',
        textShadow: '0 1px 3px rgba(0,0,0,0.6)',
        background: selected ? 'rgba(30,120,180,0.6)' : 'transparent',
        padding: '1px 3px', borderRadius: 3, lineHeight: 1.4,
      }}>
        IMÁGENES
      </span>
    </motion.div>
  )
}

const CONTEXTO = `BORRADOR FINAL

Este documento reúne fragmentos reales de decretos, leyes y discursos oficiales de la Revolución Bolivariana de Venezuela (2001–2020), confrontados con hechos ocurridos desde el 3 de enero de 2026 hasta la actualidad.

La línea de tiempo es navegable. Cada fecha señala el momento en que el discurso oficial fue contradicho por los hechos.

Fuentes: Reuters, AP News, Bloomberg, El País.

¿Hay una noticia que debería estar aquí?
Envíala desde la barra de reproducción.

— 2026`

function ContextIcon({ onOpen }) {
  const [selected, setSelected] = useState(false)
  return (
    <motion.div
      drag dragMomentum={false}
      onClick={() => setSelected(true)}
      onDoubleClick={onOpen}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 6, cursor: 'default', width: 72, padding: '6px 4px',
        borderRadius: 6, userSelect: 'none',
        background: selected ? 'rgba(255,255,255,0.15)' : 'transparent',
      }}
    >
      <div style={{ width: 44, height: 52, position: 'relative' }}>
        <div style={{
          width: 38, height: 47, background: '#f0f0f0',
          borderRadius: '2px 7px 2px 2px',
          border: '1px solid rgba(0,0,0,0.2)',
          position: 'absolute', bottom: 0, left: 3,
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', justifyContent: 'center',
          padding: '0 6px', gap: 3,
        }}>
          {[80, 95, 75, 90, 65, 85, 70].map((w, i) => (
            <div key={i} style={{ width: `${w}%`, height: 2, background: '#ccc', borderRadius: 1 }} />
          ))}
        </div>
        <div style={{
          position: 'absolute', top: 0, right: 3,
          width: 0, height: 0,
          borderLeft: '8px solid #d8d8d8',
          borderTop: '8px solid transparent',
        }} />
      </div>
      <span style={{
        fontFamily: "'IBM Plex Sans', Arial, sans-serif",
        fontSize: '10px', color: 'white', textAlign: 'center',
        textShadow: '0 1px 3px rgba(0,0,0,0.6)',
        background: selected ? 'rgba(30,120,180,0.6)' : 'transparent',
        padding: '1px 3px', borderRadius: 3, lineHeight: 1.4,
      }}>
        CONTEXTO.txt
      </span>
    </motion.div>
  )
}

function ContextModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#1e1e1e',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 4,
          width: '80%', maxWidth: 420,
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
      >
        <div style={{
          background: '#2d2d2d', height: 26,
          display: 'flex', alignItems: 'center',
          padding: '0 10px', gap: 6,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div onClick={onClose} style={{
            width: 12, height: 12, borderRadius: 2,
            background: '#c0392b', cursor: 'pointer',
            border: '1px solid #922b21',
          }} />
          <span style={{
            flex: 1, textAlign: 'center',
            fontFamily: 'monospace', fontSize: '10px', color: '#888',
          }}>
            CONTEXTO.txt — Gedit
          </span>
        </div>
        <pre style={{
          fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
          fontSize: '10px', lineHeight: 1.8,
          color: '#d4d4d4', margin: 0,
          padding: '16px 20px',
          whiteSpace: 'pre-wrap',
          maxHeight: 280, overflowY: 'auto',
        }}>
          {CONTEXTO}
        </pre>
      </motion.div>
    </motion.div>
  )
}

export default function Desktop({ onOpen }) {
  const [showContext, setShowContext] = useState(false)
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #1fb3c8 0%, #1a9aad 40%, #0d7a8a 100%)',
      backgroundImage: 'url(/background.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <TopPanel />

      <div style={{ flex: 1, position: 'relative' }}>

        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <ContextIcon onOpen={() => setShowContext(true)} />
          <FileIcon onDoubleClick={onOpen} />
          <FolderIcon />
        </div>

        <AnimatePresence>
          {showContext && <ContextModal onClose={() => setShowContext(false)} />}
        </AnimatePresence>

      </div>
    </div>
  )
}
