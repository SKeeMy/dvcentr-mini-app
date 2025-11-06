import { IProductProps } from '@/app/types'
import { create } from 'zustand'

export type FooterContentType = 'cart' | 'qr' | 'favorites' | 'profile' | 'product' | 'registration' | 'orders' | null

export type FooterState = {
  isOpen: boolean
  contentType: FooterContentType
  openFooter: (type: FooterContentType) => void
  closeFooter: () => void
  setContentType: (type: FooterContentType) => void

}

export const useFooterStore = create<FooterState>((set) => ({
  isOpen: false,
  contentType: null,

  openFooter: (type: FooterContentType) => set({ isOpen: true, contentType: type }),

  closeFooter: () => set({ isOpen: false, contentType: null }),

  setContentType: (type: FooterContentType) => set({ contentType: type })

}))