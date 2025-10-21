'use client'
import React from 'react'
import { formatPrice } from '@/app/utils/formatPrice'
export const CartPrice = ({ price }: { price: number | undefined }) => {
  return (
    <span>{formatPrice(price)}</span>
  )
}
