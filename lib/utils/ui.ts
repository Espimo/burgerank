// UI utility functions

export const toggleTheme = (): void => {
  const html = document.documentElement
  html.classList.toggle('dark')
  const isDark = html.classList.contains('dark')
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
}

export const initTheme = (): void => {
  if (localStorage.getItem('theme') === 'light') {
    document.documentElement.classList.remove('dark')
  } else {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  }
}

export const switchTab = (element: HTMLElement, tabId: string): void => {
  // Remove active from all triggers and contents
  const triggers = element.parentElement?.querySelectorAll('.tab-trigger')
  triggers?.forEach(t => t.classList.remove('active'))

  const container = element.closest('.tabs')
  const contents = container?.querySelectorAll('.tab-content')
  contents?.forEach(c => c.classList.remove('active'))

  // Add active to clicked trigger and corresponding content
  element.classList.add('active')
  document.getElementById(tabId)?.classList.add('active')
}

export const toggleAccordion = (header: HTMLElement): void => {
  header.classList.toggle('active')
  const content = header.nextElementSibling as HTMLElement
  if (content) {
    content.classList.toggle('active')
  }
}

export const markAllRead = (): void => {
  alert('Todas las notificaciones marcadas como leídas')
}

export const showProfileSettings = (): void => {
  const section = document.getElementById('settingsSection')
  if (section) {
    section.style.display = 'block'
  }
}

export const hideProfileSettings = (): void => {
  const section = document.getElementById('settingsSection')
  if (section) {
    section.style.display = 'none'
  }
}

export const saveSettings = (): void => {
  alert('Configuración guardada correctamente')
  hideProfileSettings()
}

export const togglePublicLink = (): void => {
  const checkbox = document.getElementById('publicProfile') as HTMLInputElement
  const link = document.getElementById('publicLink') as HTMLElement

  if (checkbox && link) {
    if (checkbox.checked) {
      link.style.display = 'block'
    } else {
      link.style.display = 'none'
    }
  }
}

export const copyToClipboard = (): void => {
  const link = document.querySelector('#publicLink input') as HTMLInputElement
  if (link) {
    link.select()
    document.execCommand('copy')
    alert('Enlace copiado al portapapeles')
  }
}

export const showBadgeInfo = (badgeName: string, description: string): void => {
  alert(`🏅 ${badgeName}\n\n${description}`)
}

export const showRewardInfo = (rewardName: string, description: string, points: number): void => {
  alert(`🎁 ${rewardName}\n\n${description}\n\nCosto: ${points} puntos`)
}

export const filterByView = (element: HTMLElement, view: string): void => {
  const btns = element.parentElement?.querySelectorAll('.filter-btn')
  btns?.forEach(b => b.classList.remove('active'))
  element.classList.add('active')

  const viewText = view === 'all' ? 'Todos' : view === 'trending' ? 'Tendencias' : 'Nuevas'
  alert(`Ordenando ranking por: ${viewText}`)
}
