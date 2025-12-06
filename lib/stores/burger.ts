import { create } from "zustand"
import { Burger, Rating, SearchFilters } from "@/types"

interface BurgerState {
  burgers: Burger[]
  selectedBurger: Burger | null
  isLoading: boolean
  filters: SearchFilters
  
  setBurgers: (burgers: Burger[]) => void
  setSelectedBurger: (burger: Burger | null) => void
  setIsLoading: (loading: boolean) => void
  setFilters: (filters: SearchFilters) => void
  addBurger: (burger: Burger) => void
  updateBurger: (id: string, burger: Partial<Burger>) => void
}

export const useBurgerStore = create<BurgerState>((set) => ({
  burgers: [],
  selectedBurger: null,
  isLoading: false,
  filters: {},
  
  setBurgers: (burgers) => set({ burgers }),
  
  setSelectedBurger: (burger) => set({ selectedBurger: burger }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  setFilters: (filters) => set({ filters }),
  
  addBurger: (burger) =>
    set((state) => ({
      burgers: [burger, ...state.burgers],
    })),
  
  updateBurger: (id, updates) =>
    set((state) => ({
      burgers: state.burgers.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    })),
}))

interface RatingState {
  userRatings: Rating[]
  isLoading: boolean
  
  setUserRatings: (ratings: Rating[]) => void
  setIsLoading: (loading: boolean) => void
  addRating: (rating: Rating) => void
  updateRating: (id: string, rating: Partial<Rating>) => void
}

export const useRatingStore = create<RatingState>((set) => ({
  userRatings: [],
  isLoading: false,
  
  setUserRatings: (ratings) => set({ userRatings: ratings }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  addRating: (rating) =>
    set((state) => ({
      userRatings: [rating, ...state.userRatings],
    })),
  
  updateRating: (id, updates) =>
    set((state) => ({
      userRatings: state.userRatings.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),
}))
