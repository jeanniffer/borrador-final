import { motion, AnimatePresence } from 'framer-motion'

const estiloTexto = {
  lineHeight: 1.85,
  fontSize: '1.05rem',
  fontFamily: 'var(--font-doc)',
  color: '#1a1a1a',
  textAlign: 'justify',
  display: 'inline',
}

export default function Bloque({ bloque, fechaActual }) {
  const revision = bloque.revisiones.find(r => fechaActual >= r.fecha) || null

  const fechaAprobacion = new Date(bloque.fecha_original + 'T00:00:00')
    .toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <section data-bloque-id={bloque.id} style={{ marginBottom: '3rem' }}>

      {/* Encabezado */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '0.7rem',
        borderBottom: '1px solid #e0e0e0',
        paddingBottom: '0.4rem',
        gap: 12,
      }}>
        <div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.1em',
            color: '#bbb',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: 3,
          }}>
            {bloque.ley}
          </span>
          <h2 style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#1a1a1a',
            fontFamily: 'var(--font-doc)',
          }}>
            {bloque.numero}. {bloque.titulo}
          </h2>
        </div>

        <div style={{
          flexShrink: 0,
          textAlign: 'right',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          color: '#ccc',
          lineHeight: 1.5,
          borderLeft: '2px solid #eee',
          paddingLeft: 10,
        }}>
          <div style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>En vigor desde</div>
          <div style={{ color: '#999', fontWeight: 600 }}>{fechaAprobacion}</div>
        </div>
      </div>

      {/* Cuerpo del discurso */}
      <div style={{ lineHeight: 1.85, fontSize: '1.05rem', fontFamily: 'var(--font-doc)', color: '#1a1a1a', textAlign: 'justify' }}>

        {/* Texto antes de la interrupción — siempre visible */}
        <span>{bloque.texto_antes} </span>

        {/* Interrupción de la noticia */}
        <AnimatePresence>
          {revision && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'block', margin: '1.2rem 0' }}
            >
              {/* Línea de corte */}
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ flex: 1, height: 1, background: '#cc2200', display: 'block' }} />
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.58rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#cc2200',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: '#cc2200',
                    display: 'inline-block',
                    animation: 'pulse 1.5s infinite',
                  }} />
                  En vivo
                </span>
                <span style={{ flex: 1, height: 1, background: '#cc2200', display: 'block' }} />
              </span>

              {/* Titular */}
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-doc)',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#cc2200',
                lineHeight: 1.5,
                marginBottom: 6,
              }}>
                {revision.noticia_titular}
              </span>

              {/* Cuerpo de la noticia */}
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-doc)',
                fontSize: '0.8rem',
                color: '#555',
                lineHeight: 1.7,
                marginBottom: 8,
              }}>
                {revision.noticia_cuerpo}
              </span>

              {/* Fuente */}
              {revision.fuente_nombre && (
                <span style={{ display: 'block', marginBottom: 10 }}>
                  {revision.fuente_url ? (
                    <a
                      href={revision.fuente_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.62rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#cc2200',
                        textDecoration: 'none',
                        borderBottom: '1px solid rgba(204,34,0,0.3)',
                        paddingBottom: 1,
                      }}
                    >
                      ↗ {revision.fuente_nombre}
                    </a>
                  ) : (
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'rgba(204,34,0,0.4)',
                    }}>
                      {revision.fuente_nombre}
                    </span>
                  )}
                </span>
              )}

              {/* Línea de cierre */}
              <span style={{ display: 'block', height: 1, background: '#eee' }} />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Texto después — tachado si hay revisión */}
        {revision ? (
          <motion.span
            initial={{ textDecorationColor: 'transparent' }}
            animate={{ textDecorationColor: '#cc2200' }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{
              textDecoration: 'line-through',
              textDecorationColor: '#cc2200',
              textDecorationThickness: '2px',
              color: '#aaa',
            }}
          >
            {bloque.texto_despues}
          </motion.span>
        ) : (
          <span>{bloque.texto_despues}</span>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </section>
  )
}
