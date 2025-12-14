// Navigation utility functions

export const showPage = (pageName: string): void => {
  const pages = document.querySelectorAll('.page')
  pages.forEach(p => p.classList.remove('active'))
  document.getElementById(pageName)?.classList.add('active')

  // Update nav items
  const navItems = document.querySelectorAll('.nav-item')
  navItems.forEach(item => item.classList.remove('active'))

  // Find and activate the corresponding nav item
  const navMap: Record<string, number> = {
    ranking: 0,
    rate: 1,
    profile: 2,
  }

  if (navMap[pageName] !== undefined) {
    navItems[navMap[pageName]].classList.add('active')
  }

  // Load ranking data when showing ranking page
  if (pageName === 'ranking') {
    loadRanking()
  }

  // Close sidebar
  closeSidebar()
}

export const loadRanking = (): void => {
  const list = document.getElementById('rankingList')
  if (!list) return

  list.innerHTML = ''
  // Mock burgers data would be handled by React state in actual implementation
}

export const filterRanking = (type: string): void => {
  const btns = document.querySelectorAll('.ranking-filters .filter-btn')
  btns.forEach(btn => btn.classList.remove('active'))
}

export const switchRankingView = (element: HTMLElement, view: string): void => {
  const triggers = element.parentElement?.querySelectorAll('.tab-trigger')
  triggers?.forEach(t => t.classList.remove('active'))
  element.classList.add('active')
  loadRanking()
}

export const showCityModal = (): void => {
  alert('Seleccionar ciudad (Madrid, Barcelona, Valencia, Sevilla...)')
}

export const showTagFiltersModal = (): void => {
  alert(
    'Filtros por tags:\n- Carne: Pollo, Ternera, Smash, Pescado, Vegana\n- Salsa: BBQ, Ketchup, Mostaza, Mayo, Sriracha\n- Toppings: Bacon, Queso, Cebolla, Lechuga, Tomate\n- Precio: Económica, Media, Premium'
  )
}

export const showAllergensModal = (): void => {
  alert(
    'Alergenos:\n- Gluten\n- Lactosa\n- Frutos secos\n- Marisco\n- Soja'
  )
}

export const viewRestaurant = (burgerId: number): void => {
  showPage('restaurant')
}

export const rateBurger = (burgerId: number): void => {
  showPage('rate')
}

export const showBurgerDetail = (burgerId: number): void => {
  alert(`Ver detalles de burger ${burgerId}`)
}

// Sidebar navigation
export const toggleSidebar = (): void => {
  const sidebar = document.getElementById('sidebar')
  const overlay = document.getElementById('sidebarOverlay')
  sidebar?.classList.toggle('active')
  overlay?.classList.toggle('active')
}

export const closeSidebar = (): void => {
  const sidebar = document.getElementById('sidebar')
  const overlay = document.getElementById('sidebarOverlay')
  sidebar?.classList.remove('active')
  overlay?.classList.remove('active')
}
