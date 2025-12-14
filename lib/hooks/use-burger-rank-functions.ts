'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useBurgeRankFunctions() {
  const router = useRouter()
  
  // Navigation State
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Rate Wizard State
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedConsumption, setSelectedConsumption] = useState<'local' | 'delivery'>('local')
  const [selectedAppetizers, setSelectedAppetizers] = useState<string[]>([])
  const [sectionRatings, setSectionRatings] = useState<Record<string, number>>({
    pan: 0,
    carne: 0,
    toppings: 0,
    salsa: 0,
  })
  const [sectionTags, setSectionTags] = useState<Record<string, string[]>>({})
  const [selectedRating, setSelectedRating] = useState(0)

  // Profile State
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<any>(null)
  const [showBadgeModal, setShowBadgeModal] = useState(false)
  const [selectedReward, setSelectedReward] = useState<any>(null)
  const [showRewardModal, setShowRewardModal] = useState(false)

  // ========== GRUPO A: Navegación (4 funciones) ==========

  const showPage = useCallback((pageName: string) => {
    const pageMap: Record<string, string> = {
      ranking: '/app/ranking',
      rate: '/app/rate',
      profile: '/app/profile',
      restaurant: '/app/restaurant',
      about: '/about',
      notifications: '/app/notifications',
      search: '/app/search',
      myranking: '/app/profile/ranking',
      myratings: '/app/profile/ratings',
    }
    const path = pageMap[pageName]
    if (path) {
      router.push(path)
      setSidebarOpen(false)
    }
  }, [router])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  const toggleTheme = useCallback(() => {
    const html = document.documentElement
    const isDark = html.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    toast.success(`Tema ${isDark ? 'oscuro' : 'claro'} activado`)
  }, [])

  // ========== GRUPO B: Ranking (7 funciones) ==========

  const filterRanking = useCallback((type: string) => {
    toast.success(`Filtro aplicado: ${type}`)
  }, [])

  const switchRankingView = useCallback((view: 'all' | 'trending' | 'new') => {
    const viewNames = {
      all: 'Todos',
      trending: 'Tendencias',
      new: 'Nuevas'
    }
    toast.success(`Vista: ${viewNames[view]}`)
  }, [])

  const showCityModal = useCallback(() => {
    toast.info('Abriendo selector de ciudades...')
  }, [])

  const showTagFiltersModal = useCallback(() => {
    toast.info('Abriendo filtros por tags...')
  }, [])

  const showAllergensModal = useCallback(() => {
    toast.info('Abriendo filtros por alergenos...')
  }, [])

  const filterByView = useCallback((view: 'all' | 'trending' | 'new') => {
    const viewText = view === 'all' ? 'Todos' : view === 'trending' ? 'Tendencias' : 'Nuevas'
    toast.success(`Ordenando por: ${viewText}`)
  }, [])

  // ========== GRUPO C: Rate Wizard (7 funciones) ==========

  const advanceStep = useCallback((step: number) => {
    setCurrentStep(step)
  }, [])

  const selectConsumption = useCallback((type: 'local' | 'delivery') => {
    setSelectedConsumption(type)
    const text = type === 'local' ? 'En el local' : 'A domicilio'
    toast.success(`Consumo: ${text}`)
  }, [])

  const toggleAppetizer = useCallback((type: string) => {
    setSelectedAppetizers(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }, [])

  const selectBurgerToRate = useCallback((burgerId: string) => {
    toast.success('Hamburguesa seleccionada')
    advanceStep(2)
  }, [])

  const setSectionRating = useCallback((section: string, rating: number) => {
    setSectionRatings(prev => ({ ...prev, [section]: rating }))
  }, [])

  const toggleSectionTag = useCallback((section: string, tag: string) => {
    setSectionTags(prev => {
      const tags = prev[section] || []
      return {
        ...prev,
        [section]: tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag],
      }
    })
  }, [])

  const setRating = useCallback((stars: number) => {
    setSelectedRating(stars)
  }, [])

  // ========== GRUPO D: Profile Settings (5 funciones) ==========

  const showProfileSettings = useCallback(() => {
    setShowSettingsModal(true)
  }, [])

  const hideProfileSettings = useCallback(() => {
    setShowSettingsModal(false)
  }, [])

  const saveSettings = useCallback(async (data: any) => {
    try {
      // API call aquí
      toast.success('Configuración guardada correctamente')
      setShowSettingsModal(false)
    } catch (error) {
      toast.error('Error al guardar la configuración')
    }
  }, [])

  const togglePublicLink = useCallback((isPublic: boolean) => {
    const text = isPublic ? 'Perfil público' : 'Perfil privado'
    toast.success(text)
  }, [])

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Enlace copiado al portapapeles')
    } catch (error) {
      toast.error('Error al copiar')
    }
  }, [])

  // ========== GRUPO E: Badges & Rewards (2 funciones) ==========

  const showBadgeInfo = useCallback((badgeName: string, description: string) => {
    setSelectedBadge({ name: badgeName, description })
    setShowBadgeModal(true)
  }, [])

  const showRewardInfo = useCallback((rewardName: string, description: string, points: number) => {
    setSelectedReward({ name: rewardName, description, points })
    setShowRewardModal(true)
  }, [])

  // ========== GRUPO F: UI General (2 funciones) ==========

  const switchTab = useCallback((tabId: string) => {
    // Manejado por componentes de tabs individuales
  }, [])

  const toggleAccordion = useCallback((id: string) => {
    // Manejado por componentes de acordeón individuales
  }, [])

  // ========== GRUPO G: Detail Pages (2 funciones) ==========

  const showBurgerDetail = useCallback((burgerId: string) => {
    router.push(`/app/burger/${burgerId}`)
  }, [router])

  const markAllRead = useCallback(async () => {
    try {
      // API call para marcar notificaciones como leídas
      toast.success('Notificaciones marcadas como leídas')
    } catch (error) {
      toast.error('Error')
    }
  }, [])

  return {
    // Navigation
    showPage,
    toggleSidebar,
    closeSidebar,
    toggleTheme,
    sidebarOpen,

    // Ranking
    filterRanking,
    switchRankingView,
    showCityModal,
    showTagFiltersModal,
    showAllergensModal,
    filterByView,

    // Rate Wizard
    currentStep,
    selectedConsumption,
    selectedAppetizers,
    sectionRatings,
    sectionTags,
    selectedRating,
    advanceStep,
    selectConsumption,
    toggleAppetizer,
    selectBurgerToRate,
    setSectionRating,
    toggleSectionTag,
    setRating,

    // Profile
    showProfileSettings,
    hideProfileSettings,
    saveSettings,
    togglePublicLink,
    copyToClipboard,
    showSettingsModal,

    // Badges & Rewards
    showBadgeInfo,
    showRewardInfo,
    selectedBadge,
    showBadgeModal,
    setShowBadgeModal,
    selectedReward,
    showRewardModal,
    setShowRewardModal,

    // UI General
    switchTab,
    toggleAccordion,

    // Detail
    showBurgerDetail,
    markAllRead,
  }
}
