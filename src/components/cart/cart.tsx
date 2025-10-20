'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React from 'react'
import { ProductSkeleton } from '../pages/catalog/product/product-skeleton'
import s from './cart.module.scss'
import { useCartStore } from '@/store/cart-store'
const Product = dynamic(() => import('../pages/catalog/product/product').then(mod => mod.Product), {
  ssr: false,
  loading: () => <ProductSkeleton />
})
export const Cart = () => {
  const { items } = useCartStore()

  return (
    <div className={s.cart}>
      <div className={s.cart_items}>
        {items.length > 0 && items.map(product => (
          <Product className={s.product} key={product.product.id} id={product.product.id} description={product.product.description} price={product.product.price} image={product.product.image} title={product.product.title} />
        ))}
      </div>

      <div className={s.order}>
        <Link href={'/cart'} className={s.order_link}>Оформить</Link>
        <span className={s.order_price}>1 000 $</span>

      </div>

    </div>
  )
}
