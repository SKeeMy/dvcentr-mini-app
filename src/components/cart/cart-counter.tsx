'use client'
import s from './cart.module.scss'
import React from 'react'
import { useCartStore } from '@/store/cart-store'
import { CountIcon } from '../shared/count-icon/count-icon'
export default function CartCounter() {
  const items = useCartStore(state => state.items)
  const getTotalItems = useCartStore(state => state.getTotalItems)
  
  const totalItems = getTotalItems()

  if (totalItems === 0) return null
  
  return <CountIcon value={totalItems} />
}