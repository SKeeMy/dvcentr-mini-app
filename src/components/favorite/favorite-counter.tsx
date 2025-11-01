'use client'
import React from 'react'
import { useFavoriteStore } from '@/store/favorite-store'
import { CountIcon } from '../shared/count-icon/count-icon'
export default function FavoriteCounter  ()  {
  const getTotalItems = useFavoriteStore(state => state.getTotalFavorites)

  const totalItems = getTotalItems()
  if (totalItems === 0) return null
  return (
    <CountIcon value={totalItems}  />
  )
}
