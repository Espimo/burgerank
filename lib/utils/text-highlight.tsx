import React from 'react'

export function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text

  // Normalize both strings for comparison
  const normalizedText = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const normalizedQuery = query.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  // Create regex for case-insensitive search
  const regex = new RegExp(`(${normalizedQuery})`, 'gi')
  const parts = normalizedText.split(regex)

  return (
    <>
      {parts.map((part, index) => {
        // Check if this part matches the query
        const matches = regex.exec(part)
        if (matches) {
          // Find original text matching this part
          let originalIndex = 0
          let matched = 0
          for (let i = 0; i < text.length; i++) {
            const normalized = text[i].normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            if (normalizedText[originalIndex] === normalized) {
              if (originalIndex >= normalizedText.indexOf(part)) {
                if (matched === part.length) break
                matched++
              }
              originalIndex++
            }
          }
          return (
            <mark key={index} className="bg-yellow-200 font-semibold">
              {part}
            </mark>
          )
        }
        return <span key={index}>{part}</span>
      })}
    </>
  )
}

// Simpler version that works reliably
export function highlightTextSimple(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text

  const parts = text.split(new RegExp(`(${query})`, 'gi'))

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className="bg-yellow-200 font-semibold">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  )
}
