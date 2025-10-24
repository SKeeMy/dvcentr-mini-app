import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserData {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code: string
  is_premium?: boolean
  phone?: string
}

interface AuthState {
  user: UserData | null
  accessGranted: boolean
  isLoading: boolean
  setUser: (user: UserData | null) => void
  setAccessGranted: (granted: boolean) => void
  setIsLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessGranted: false,
      isLoading: true,
      
      setUser: (user) => set({ user }),
      setAccessGranted: (accessGranted) => set({ accessGranted }),
      setIsLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, accessGranted: false })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessGranted: state.accessGranted
      }),
    }
  )
)