import React from 'react'
import s from './product.module.scss'
import { useCartStore } from '@/store/cart-store'

export const ProductCounter = ({ productId }: { productId: string }) => {
  const { updateQuantity, getItemQuantity, removeFromCart } = useCartStore()
  const count = getItemQuantity(productId)

  const handleIncrement = () => {
    updateQuantity(productId, count + 1)
  }

  const handleDecrement = () => {
    if (count > 1) {
      updateQuantity(productId, count - 1)
    } else {
      removeFromCart(productId)
    }
  }

  return (
    <div className={s.counter}>
      <button onClick={handleDecrement} >-</button>
      <span>{count}</span>
      <button onClick={handleIncrement}>+</button>
    </div>
  )
}