import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IProductProps } from '@/app/types'

export type CartItem = {
  product: IProductProps
  quantity: number
}

export type CartState = {
  items: CartItem[]
  currentProduct: IProductProps | null
  addToCart: (product: IProductProps) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  getItemQuantity: (productId: number) => number
  isInCart: (productId: number) => boolean

  selectProduct: (product: IProductProps) => void
  
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      currentProduct: null,
      
      addToCart: (product: IProductProps) => {
        const { items } = get()
        const existingItem = items.find(item => item.product.id === product.id)

        if (existingItem) {
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          })
        } else {
          set({ items: [...items, { product, quantity: 1 }] })
        }
      },

      removeFromCart: (productId: number) => {
        const { items } = get()
        set({ items: items.filter(item => item.product.id !== productId) })
      },

      updateQuantity: (productId: number, quantity: number) => {
        const { items } = get()

        if (quantity <= 0) {
          get().removeFromCart(productId)
        } else {
          set({
            items: items.map(item =>
              item.product.id === productId
                ? { ...item, quantity }
                : item
            )
          })
        }
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        const { items } = get()
        return items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
      },

      getTotalItems: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },

      getItemQuantity: (productId: number) => {
        const { items } = get()
        return items.find(item => item.product.id === productId)?.quantity || 0
      },

      isInCart: (productId: number) => {
        const { items } = get()
        return items.some(item => item.product.id === productId)
      },
      
      selectProduct: (product: IProductProps) => {
        set({ currentProduct: product })
      },

    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items
      }),
    }
  )
)