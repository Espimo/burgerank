import { create } from "zustand"
import { User, UserStats } from "@/types"

interface UserStore {
  userProfile: User | null
  userStats: UserStats | null
  isLoading: boolean
  
  setUserProfile: (user: User | null) => void
  setUserStats: (stats: UserStats | null) => void
  setIsLoading: (loading: boolean) => void
  updateUserProfile: (updates: Partial<User>) => void
  addPoints: (points: number) => void
}

export const useUserStore = create<UserStore>((set) => ({
  userProfile: null,
  userStats: null,
  isLoading: false,
  
  setUserProfile: (user) => set({ userProfile: user }),
  
  setUserStats: (stats) => set({ userStats: stats }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  updateUserProfile: (updates) =>
    set((state) => ({
      userProfile: state.userProfile
        ? { ...state.userProfile, ...updates }
        : null,
    })),
  
  addPoints: (points) =>
    set((state) => ({
      userStats: state.userStats
        ? {
            ...state.userStats,
            total_points: state.userStats.total_points + points,
          }
        : null,
    })),
}))
