import React, { useEffect } from 'react'
import s from './product.module.scss'
import { useCartStore } from '@/store/cart-store'
import { useState } from 'react'
export const ProductCounter = ({ productId }: { productId: number }) => {
  const [count, setCount] = useState<number>(1);
  const { updateQuantity } = useCartStore()

  const handleIncrement = () => {
    setCount(value => value + 1)
    updateQuantity(productId, count)
  }
  const handleDecrement = () => {
    setCount(value => value - 1)
  }
  
  useEffect(() => {
    updateQuantity(productId, count)
  }, [count])

  return (
    <div className={s.counter}>
      <button onClick={handleDecrement}>-</button>
      <span>{count}</span>
      <button onClick={handleIncrement}>+</button>
    </div>
  )
}
