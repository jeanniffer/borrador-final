function parseDate(str) {
  return new Date(str + 'T00:00:00').getTime()
}

function tsToDateStr(ts) {
  return new Date(ts).toISOString().slice(0, 10)
}

function labelFromDate(fecha) {
  const [, m, d] = fecha.split('-')
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
  return `${parseInt(d)} ${meses[parseInt(m) - 1]}`
}

export default function Timeline({ fechaActual, onChange, playing, onTogglePlay, milestones, min, max, submitUrl }) {
  const MIN = min || parseDate('2026-01-02')
  const MAX = max || parseDate('2026-02-19')
  const currentTs = parseDate(fechaActual)
  const progress = Math.max(0, Math.min(1, (currentTs - MIN) / (MAX - MIN)))

  function handleSlider(e) {
    onChange(tsToDateStr(Number(e.target.value)))
  }

  return (
    <div style={{
      background: 'rgba(10, 10, 10, 0.88)',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      height: 52,
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      userSelect: 'none',
      flexShrink: 0,
    }}>

      <button
        onClick={onTogglePlay}
        style={{
          background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.75)', fontSize: '13px',
          cursor: 'pointer', padding: '0 4px',
          flexShrink: 0, lineHeight: 1,
        }}
        title={playing ? 'Pausar' : 'Reproducir'}
      >
        {playing ? '⏸' : '▶'}
      </button>

      <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

      <div style={{ flex: 1, position: 'relative', paddingTop: 20 }}>

        {/* Milestone markers — generados desde los datos */}
        {(milestones || []).map(m => {
          const pos = (parseDate(m.fecha) - MIN) / (MAX - MIN) * 100
          const isPast = fechaActual >= m.fecha
          return (
            <div
              key={m.fecha}
              onClick={() => onChange(m.fecha)}
              title={m.descripcion}
              style={{
                position: 'absolute',
                left: `${pos}%`,
                top: 0,
                transform: 'translateX(-50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 2, cursor: 'pointer', zIndex: 2,
              }}
            >
              <span style={{
                fontFamily: "'IBM Plex Sans', Arial, sans-serif",
                fontSize: '9px', fontWeight: 600,
                color: isPast ? 'white' : 'rgba(255,255,255,0.25)',
                whiteSpace: 'nowrap', transition: 'color 0.3s', lineHeight: 1,
              }}>
                {m.label || labelFromDate(m.fecha)}
              </span>
              <div style={{
                width: isPast ? 2 : 1,
                height: 7,
                background: isPast ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s',
              }} />
            </div>
          )
        })}

        <input
          type="range"
          min={MIN}
          max={MAX}
          value={currentTs}
          onChange={handleSlider}
          style={{
            width: '100%',
            appearance: 'none', WebkitAppearance: 'none',
            height: 2, borderRadius: 2, outline: 'none',
            cursor: 'pointer', display: 'block',
            background: `linear-gradient(to right, rgba(255,255,255,0.85) ${progress * 100}%, rgba(255,255,255,0.15) ${progress * 100}%)`,
          }}
        />
      </div>

      <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

      <div style={{
        fontFamily: "'IBM Plex Sans', Arial, sans-serif",
        fontSize: '10px', color: 'rgba(255,255,255,0.7)',
        textAlign: 'right', lineHeight: 1.6, flexShrink: 0, minWidth: 44,
      }}>
        <div style={{ fontWeight: 600 }}>{fechaActual.slice(0, 4)}</div>
        <div style={{ opacity: 0.5 }}>{fechaActual.slice(5)}</div>
      </div>

      {/* Botón submit */}
      {submitUrl && (
        <>
          <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
          <a
            href={submitUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'IBM Plex Sans', Arial, sans-serif",
              fontSize: '9px', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none', flexShrink: 0,
              border: '1px solid rgba(255,255,255,0.15)',
              padding: '3px 7px', borderRadius: 3,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.color = 'white'; e.target.style.borderColor = 'rgba(255,255,255,0.4)' }}
            onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.45)'; e.target.style.borderColor = 'rgba(255,255,255,0.15)' }}
            title="Enviar una noticia"
          >
            + noticia
          </a>
        </>
      )}

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px; height: 12px; border-radius: 50%;
          background: white; border: none; cursor: pointer;
          box-shadow: 0 0 6px rgba(255,255,255,0.4);
        }
        input[type=range]::-moz-range-thumb {
          width: 12px; height: 12px; border-radius: 50%;
          background: white; border: none; cursor: pointer;
        }
      `}</style>
    </div>
  )
}
