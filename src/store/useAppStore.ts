import { create } from "zustand";
import { persist } from 'zustand/middleware'
import { IProductProps, CartItem } from "@/app/types";


interface AppState {

  cart: CartItem[]

  //cart actions

  addToCart: (product: IProductProps) => void
  removeFromCart: (productId: number) => void
  upadteQuantity: (productId: number, quantity: number) => void
  clearCart: () => void


  //getters

  getTotalPrice: () => number
  getTotalItems: () => number
  getItemQuantity: (productId: number) => void
  isInCart: (productId: number) => boolean

}