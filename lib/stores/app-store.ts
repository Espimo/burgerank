"use client"

import { create } from "zustand"
import type { BurgerFilters, RestaurantFilters } from "@/types"

interface Location {
  latitude: number
  longitude: number
  city: string
}

interface AppState {
  // State
  isOnline: boolean
  currentLocation: Location | null
  burgerFilters: BurgerFilters
  restaurantFilters: RestaurantFilters
  isDarkMode: boolean

  // Actions
  setOnline: (online: boolean) => void
  setCurrentLocation: (location: Location | null) => void
  setBurgerFilters: (filters: BurgerFilters) => void
  setRestaurantFilters: (filters: RestaurantFilters) => void
  clearBurgerFilters: () => void
  clearRestaurantFilters: () => void
  setDarkMode: (dark: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  currentLocation: null,
  burgerFilters: {},
  restaurantFilters: {},
  isDarkMode: false,

  setOnline: (online) => set({ isOnline: online }),

  setCurrentLocation: (location) => set({ currentLocation: location }),

  setBurgerFilters: (filters) =>
    set((state) => ({
      burgerFilters: { ...state.burgerFilters, ...filters },
    })),

  setRestaurantFilters: (filters) =>
    set((state) => ({
      restaurantFilters: { ...state.restaurantFilters, ...filters },
    })),

  clearBurgerFilters: () => set({ burgerFilters: {} }),

  clearRestaurantFilters: () => set({ restaurantFilters: {} }),

  setDarkMode: (dark) => set({ isDarkMode: dark }),
}))

// Hooks derivados
export const useIsOnline = () => useAppStore((state) => state.isOnline)
export const useCurrentLocation = () => useAppStore((state) => state.currentLocation)
export const useBurgerFilters = () => useAppStore((state) => state.burgerFilters)
export const useRestaurantFilters = () =>
  useAppStore((state) => state.restaurantFilters)
export const useDarkMode = () => useAppStore((state) => state.isDarkMode)

// Hook para obtener todas las acciones
export const useAppActions = () => {
  return useAppStore((state) => ({
    setOnline: state.setOnline,
    setCurrentLocation: state.setCurrentLocation,
    setBurgerFilters: state.setBurgerFilters,
    setRestaurantFilters: state.setRestaurantFilters,
    clearBurgerFilters: state.clearBurgerFilters,
    clearRestaurantFilters: state.clearRestaurantFilters,
    setDarkMode: state.setDarkMode,
  }))
}
