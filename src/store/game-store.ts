import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Player {
  id: number
  name: string
  score: number
  position: number
}

interface ApiResponse {
  STATUS: string
  MESSAGE: string
  DATA: any
}

interface GameStatsState {
  isLoadingRaiting: boolean
  isSendingResult: boolean
  showRaiting: boolean
  players: Player[] | null
  apiError: string | null
  currentResult: number | null
  current_player: Player| null;
  count_players: number | null
  // Setters
  setLoadingRaiting: (loading: boolean) => void
  setSendingResult: (loading: boolean) => void
  setShowRaiting: (show: boolean) => void

  // Actions
  getRaiting: (bitrix_id: string) => Promise<void>
  sendResult: (phone: string, score: number, bitrix_id: string) => Promise<void>
}

export const useGameStore = create<GameStatsState>()(
  persist(
    (set, get) => ({
      isLoadingRaiting: false,
      isSendingResult: false,
      showRaiting: false,
      players: null,
      apiError: null,
      currentResult: null,
      current_player: null,
      count_players: null,
      // setters
      setLoadingRaiting: (isLoadingRaiting) => set({ isLoadingRaiting }),
      setSendingResult: (isSendingResult) => set({ isSendingResult }),
      setShowRaiting: (showRaiting) => set({ showRaiting }),

      // actions
      getRaiting: async (bitrix_id: string) => {
        set({ isLoadingRaiting: true, apiError: null })

        try {
          const response = await fetch('/api/tg-react-app/get-raiting', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN ?? '3C7D5B2F9A1E4D6C8B2A5F7E3D1C9B2A'}`
            },
            body: JSON.stringify({ bitrix_id })
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const result: ApiResponse = await response.json()

          if (result.STATUS === 'SUCCESS') {
            set({
              players: result.DATA.top_players.length > 0 ? result.DATA.top_players : null,
              count_players: result.DATA.count_players,
              current_player: result.DATA.current_player || null,
              apiError: null
            })
          } else {
            set({
              apiError: result.MESSAGE,
            })
          }

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'
          set({ apiError: errorMessage })
          console.error('Ошибка при запросе данных', error)
        } finally {
          set({ isLoadingRaiting: false })
        }
      },

      sendResult: async (phone: string, score: number, bitrix_id: string) => {
        set({ isSendingResult: true, apiError: null })

        try {
          const response = await fetch('/api/tg-react-app/update-user-game-score', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN ?? '3C7D5B2F9A1E4D6C8B2A5F7E3D1C9B2A'}`
            },
            body: JSON.stringify({ phone, score, bitrix_id })
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const result: ApiResponse = await response.json()

          if (result.STATUS === 'SUCCESS') {
            set({
              apiError: null,
              currentResult: result.DATA
            })
          } else {
            set({
              apiError: result.MESSAGE,
            })
          }

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'
          set({ apiError: errorMessage })
          console.error('Ошибка при отправке данных:', error)
        } 
        finally {
          set({ isSendingResult: false })
        }
      }
    }),
    {
      name: 'game-stats-storage',
      partialize: (state) => ({
        players: state.players,
        // showRaiting: state.showRaiting,
       
      })
    }
  )
)