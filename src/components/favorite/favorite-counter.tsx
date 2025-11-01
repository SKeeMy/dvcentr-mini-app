'use client'
import React from 'react'
import { useFavoriteStore } from '@/store/favorite-store'

import dynamic from 'next/dynamic'
export default function FavoriteCounter  ()  {
  const Counter = dynamic(() => import('../shared/count-icon/count-icon'), {
    ssr: false,
    loading: () => null
  })
  const favorites = useFavoriteStore(state => state.favorites)
  const totalItems = favorites.length
  if (totalItems === 0) return null
  return (
    <Counter value={totalItems}  />
  )
}
