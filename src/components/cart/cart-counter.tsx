'use client'
import s from './cart.module.scss'
import React from 'react'
import { useCartStore } from '@/store/cart-store'
import dynamic from 'next/dynamic'


export default function CartCounter() {
  const Counter = dynamic(() => import('../shared/count-icon/count-icon'), {
    ssr: false,
    loading: () => null
  })
  const items = useCartStore(state => state.items)
  const getTotalItems = useCartStore(state => state.getTotalItems)
  
  const totalItems = getTotalItems()

  if (totalItems === 0) return null
  
  return <Counter value={totalItems} />
}