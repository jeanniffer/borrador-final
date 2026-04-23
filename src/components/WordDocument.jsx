import Bloque from './Bloque'

function WordToolbar() {
  return (
    <div style={{ background: '#f3f3f3', borderBottom: '1px solid #d0d0d0', flexShrink: 0 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: 30,
        padding: '0 12px',
        gap: 2,
        borderBottom: '1px solid #e0e0e0',
      }}>
        {['Archivo', 'Inicio', 'Insertar', 'Diseño', 'Disposición', 'Referencias', 'Revisar', 'Vista'].map(item => (
          <span key={item} style={{
            padding: '3px 7px',
            fontSize: '11px',
            fontFamily: 'system-ui, sans-serif',
            color: '#333',
            cursor: 'default',
          }}>{item}</span>
        ))}
        <span style={{
          marginLeft: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: '#999',
          marginRight: 8,
        }}>
          BORRADOR FINAL.docx
        </span>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: 36,
        padding: '0 12px',
        gap: 12,
      }}>
        <span style={{ fontSize: '11px', fontFamily: 'system-ui', color: '#333', border: '1px solid #ccc', padding: '1px 6px', borderRadius: 2, background: 'white' }}>IBM Plex Sans</span>
        <span style={{ fontSize: '11px', fontFamily: 'system-ui', color: '#333', border: '1px solid #ccc', padding: '1px 6px', borderRadius: 2, background: 'white' }}>12</span>
        <span style={{ fontSize: '12px', fontFamily: 'system-ui', fontWeight: 700, color: '#333', padding: '1px 5px' }}>N</span>
        <span style={{ fontSize: '12px', fontFamily: 'system-ui', fontStyle: 'italic', color: '#333', padding: '1px 5px' }}>K</span>
        <div style={{ width: 1, height: 22, background: '#d0d0d0' }} />
        <span style={{
          fontSize: '10px',
          fontFamily: 'system-ui',
          color: '#2563eb',
          border: '1px solid #2563eb',
          padding: '2px 8px',
          borderRadius: 2,
          background: '#eff6ff',
        }}>
          ● Control de cambios: activo
        </span>
      </div>
    </div>
  )
}

export default function WordDocument({ discurso, fechaActual, scrollRef }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <WordToolbar />

      {/* Scrollable paper area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          background: 'rgba(10,55,65,0.45)',
          minHeight: 0,
        }}
      >
        <div style={{
          width: 'min(960px, 100%)',
          margin: '28px auto 32px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)',
          border: '1px solid #3a5a1a',
        }}>
          <div style={{
            background: 'white',
            minHeight: '800px',
            padding: '80px 72px 100px 80px',
            position: 'relative',
            boxShadow: '0 1px 6px rgba(0,0,0,0.12)',
          }}>

            {/* Encabezado estilo comunicado oficial */}
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                <img
                  src="/escudo.png"
                  alt="Escudo República Bolivariana de Venezuela"
                  style={{ height: 90, objectFit: 'contain' }}
                  onError={e => { e.target.style.display = 'none' }}
                />
              </div>

              <p style={{
                fontFamily: "'IBM Plex Sans', Arial, sans-serif",
                fontSize: '1rem',
                fontWeight: 400,
                color: '#222',
                letterSpacing: '0.01em',
                marginBottom: '0.1rem',
              }}>
                República Bolivariana de Venezuela
              </p>

              <h1 style={{
                fontFamily: "'IBM Plex Sans', Arial, sans-serif",
                fontSize: '3.2rem',
                fontWeight: 400,
                fontStyle: 'normal',
                color: '#111',
                lineHeight: 1.1,
                marginBottom: '0.6rem',
                letterSpacing: '-0.01em',
              }}>
                {discurso.titulo}
              </h1>

              <div style={{ display: 'flex', height: 8, margin: '0 auto 6px', maxWidth: 320 }}>
                <div style={{ flex: 1, background: '#F0C619' }} />
                <div style={{ flex: 1, background: '#003082' }} />
                <div style={{ flex: 1, background: '#CC0001' }} />
              </div>
              <div style={{
                fontSize: '0.55rem',
                letterSpacing: '0.35em',
                color: '#555',
                marginBottom: 0,
              }}>
                ★ ★ ★ ★ ★ ★ ★ ★
              </div>
            </div>

            {/* Bloques */}
            {discurso.bloques.map(bloque => (
              <Bloque key={bloque.id} bloque={bloque} fechaActual={fechaActual} />
            ))}

            <div style={{
              position: 'absolute',
              bottom: 32,
              left: 0, right: 0,
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: '#ddd',
            }}>1</div>
          </div>
        </div>
      </div>
    </div>
  )
}
