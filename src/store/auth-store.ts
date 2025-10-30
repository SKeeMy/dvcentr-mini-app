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

interface ApiUserData {
  bitrix_id: string
  last_name: string
  name: string
  second_name: string
  email: string
  email_approved: string
  personal_phone: string
  personal_phone_approved: string
}

interface ApiResponse {
  status: string
  message: string
  data: ApiUserData
}

interface AuthState {
  user: UserData | null
  apiUserData: ApiUserData | null
  accessGranted: boolean
  isLoading: boolean
  userLoading: boolean
  apiError: string | null
  
  // Setters
  setUser: (user: UserData | null) => void
  setApiUserData: (apiUserData: ApiUserData | null) => void
  setAccessGranted: (granted: boolean) => void
  setIsLoading: (loading: boolean) => void
  setUserLoading: (loading: boolean) => void
  setApiError: (error: string | null) => void
  
  // Actions
  logout: () => void
  fetchUserData: (phone: string) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      apiUserData: null,
      accessGranted: false,
      isLoading: true,
      userLoading: true,
      apiError: null,

      // Setters
      setUser: (user) => set({ user }),
      setApiUserData: (apiUserData) => set({ apiUserData }),
      setAccessGranted: (accessGranted) => set({ accessGranted }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setUserLoading: (userLoading) => set({ userLoading }),
      setApiError: (apiError) => set({ apiError }),

      logout: () => set({
        user: null,
        apiUserData: null,
        accessGranted: false,
        userLoading: false,
        apiError: null
      }),

      fetchUserData: async (phone: string) => {
        set({ userLoading: true, apiError: null })
        
        try {
          console.log('📞 Отправка запроса к API с номером:', phone)

          const response = await fetch('/api/tg-react-app/check-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Forwarded-Proto': 'https',
              'X-Forwarded-Ssl': 'on',
              'HTTPS': 'YES',
              'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({ phone })
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const result: ApiResponse = await response.json()
          console.log('✅ API ответ получен:', result)

          if (result.status === '1') {
            set({ 
              apiUserData: result.data,
              apiError: null 
            })
            console.log('📊 Данные пользователя сохранены:', result.data)
          } else {
            set({ apiError: result.message })
            console.warn('⚠️ Пользователь не найден в системе:', result.message)
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'
          set({ apiError: errorMessage })
          console.error('❌ Ошибка при запросе данных пользователя:', error)
        } finally {
          set({ userLoading: false })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        apiUserData: state.apiUserData,
        accessGranted: state.accessGranted
      }),
    }
  )
)