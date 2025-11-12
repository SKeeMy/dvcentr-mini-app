import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IProductProps } from '@/app/types'

export type FavoriteState = {
  favorites: IProductProps[]
  currentProduct: IProductProps | null
  addToFavorites: (product: IProductProps) => void
  removeFromFavorites: (productId: string) => void
  clearFavorites: () => void
  getTotalFavorites: () => number
  isInFavorites: (productId: string) => boolean
  selectProduct: (product: IProductProps) => void
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      currentProduct: null,
      
      addToFavorites: (product: IProductProps) => {
        const { favorites } = get()
        
        const isAlreadyFavorite = favorites.some(fav => fav.id === product.id)
        
        if (!isAlreadyFavorite) {
          set({ favorites: [...favorites, product] })
        }
      },

      removeFromFavorites: (productId: string) => {
        const { favorites } = get()
        set({ favorites: favorites.filter(product => product.id !== productId) })
      },

      clearFavorites: () => set({ favorites: [] }),

      getTotalFavorites: () => {
        const { favorites } = get()
        return favorites.length
      },

      isInFavorites: (productId: string) => {
        const { favorites } = get()
        return favorites.some(product => product.id === productId)
      },
      
      selectProduct: (product: IProductProps) => {
        set({ currentProduct: product })
      },
    }),
    {
      name: 'favorites-storage',
      partialize: (state) => ({
        favorites: state.favorites
      }),
    }
  )
)