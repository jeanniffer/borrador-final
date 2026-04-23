import { useState, useEffect } from 'react'
import localData from '../data/discurso.json'
import { SHEETS_CSV_URL } from '../config'

function parseCSV(text) {
  const result = []
  let i = 0
  const len = text.length

  while (i < len) {
    const row = []
    while (i < len) {
      let field = ''
      if (text[i] === '"') {
        i++
        while (i < len) {
          if (text[i] === '"') {
            if (text[i + 1] === '"') { field += '"'; i += 2 }
            else { i++; break }
          } else {
            field += text[i++]
          }
        }
      } else {
        while (i < len && text[i] !== ',' && text[i] !== '\n' && text[i] !== '\r') {
          field += text[i++]
        }
      }
      row.push(field)
      if (i >= len || text[i] === '\n' || text[i] === '\r') {
        if (text[i] === '\r') i++
        if (i < len && text[i] === '\n') i++
        break
      }
      i++ // skip comma
    }
    if (row.some(f => f.trim())) result.push(row)
  }
  return result
}

function sheetToDiscurso(rows) {
  if (rows.length < 2) return localData
  const headers = rows[0].map(h => h.trim())
  const col = name => headers.indexOf(name)

  const bloqueMap = new Map()
  for (const row of rows.slice(1)) {
    const id = row[col('id')]?.trim()
    if (!id) continue
    if (!bloqueMap.has(id)) {
      bloqueMap.set(id, {
        id,
        numero: row[col('numero')],
        titulo: row[col('titulo')],
        ley: row[col('ley')],
        fecha_original: row[col('fecha_original')],
        texto_antes: row[col('texto_antes')],
        texto_despues: row[col('texto_despues')],
        revisiones: [],
      })
    }
    const fecha = row[col('revision_fecha')]?.trim()
    if (fecha) {
      bloqueMap.get(id).revisiones.push({
        fecha,
        noticia_titular: row[col('noticia_titular')],
        noticia_cuerpo: row[col('noticia_cuerpo')],
        fuente_nombre: row[col('fuente_nombre')] || '',
        fuente_url: row[col('fuente_url')] || '',
      })
    }
  }

  return { ...localData, bloques: Array.from(bloqueMap.values()) }
}

export function useDiscurso() {
  const [data, setData] = useState(localData)
  const [loading, setLoading] = useState(!!SHEETS_CSV_URL)

  useEffect(() => {
    if (!SHEETS_CSV_URL) return
    fetch(SHEETS_CSV_URL)
      .then(r => r.text())
      .then(text => setData(sheetToDiscurso(parseCSV(text))))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { data, loading }
}
