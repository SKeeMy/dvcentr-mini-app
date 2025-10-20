'use client'
import s from './cart.module.scss'
import React from 'react'
import { useCartStore } from '@/store/cart-store'

export default function CartCounter() {
  const items = useCartStore(state => state.items)
  const getTotalItems = useCartStore(state => state.getTotalItems)
  
  const totalItems = getTotalItems()

  if (totalItems === 0) return null
  
  return <span className={s.cart_counter}>{totalItems}</span>
}