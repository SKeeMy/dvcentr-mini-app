'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React from 'react'
import { ProductSkeleton } from '../pages/catalog/product/product-skeleton'
import s from './cart.module.scss'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/app/utils/formatPrice'
import { useAuthStore } from '@/store/auth-store'
import { useFooterStore } from '@/store/footer-strore'
const Product = dynamic(() => import('../pages/catalog/product/product').then(mod => mod.Product), {
  ssr: false,
  loading: () => <ProductSkeleton />
})

const TotalPrice = dynamic(() => import('./cart-price').then(mod => mod.CartPrice), {
  ssr: false,
  loading: () => 'Подсчет'
})

export const Cart = () => {
  const { items } = useCartStore()
  const totalPrice = useCartStore(state => state.getTotalPrice())
  const { apiUserData } = useAuthStore()
  const { openFooter, closeFooter } = useFooterStore()

  const handleOpenRegistration = () => {
    closeFooter()
    setTimeout(() => {
      openFooter('registration')

    }, 100);
  }


  const renderButton = () => {
    if (apiUserData === null) return <div className={s.reg}>Для продолжения,<button onClick={handleOpenRegistration} className={s.order_link}> зарегистрируйтесь</button></div>
    else return <Link href={'/cart'} className={s.order_link}>Оформить заказ на  <TotalPrice price={totalPrice} /></Link>
  }

  return (
    <div className={s.cart}>
      <div className={s.cart_items}>
        {items.length > 0 && items.map(product => (
          <Product product_type='cart' className={s.product} key={product.product.id} id={product.product.id} description={product.product.description} price={product.product.price} image={product.product.image} title={product.product.title} />
        ))}
      </div>

      <div className={s.order}>
        {renderButton()}

      </div>

    </div>
  )
}
