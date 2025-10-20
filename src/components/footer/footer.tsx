'use client'
import Link from 'next/link'
import React from 'react'
import { Container } from '../container/container'
import { Cart } from '../shared/icons/cart'
import s from './footer.module.scss'
import { useCartStore } from '@/store/cart-store'
import clsx from 'clsx'
import { Cart as CartOrder } from '../cart/cart'
import dynamic from 'next/dynamic'
const CartCounter = dynamic(() => import('../cart/cart-counter'), {
  ssr: false,
  loading: () => null
})
export const Footer = () => {

  const { openFooter, openFooterCart } = useCartStore()
  return (
    <footer className={clsx(s.footer, openFooter && s.open)}>
      <Container>
        <div className={s.footer_content}>
          <div className={s.foooter_items}>
            <button onClick={openFooterCart} className={s.footer_item} >
              <Cart />
              <CartCounter />
            </button>
          </div>
          <div className={s.footer_body}>
            <CartOrder />
          </div>
        </div>

      </Container>
    </footer>
  )
}
