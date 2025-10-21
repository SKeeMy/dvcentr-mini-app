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
import { Trash } from '../shared/icons/trash'
import { useEffect } from 'react'
const CartCounter = dynamic(() => import('../cart/cart-counter'), {
  ssr: false,
  loading: () => null
})
export const Footer = () => {

  const { openFooter, openFooterCart, closeFooterCart, items, clearCart } = useCartStore()

  const handleRemoveItemsFromTrash = () => {
    clearCart();
    closeFooterCart();
  }

  useEffect(() => {
    if (items.length === 0) {
      closeFooterCart()
    }
  }, [items])

  return (
    <footer className={clsx(s.footer, openFooter && s.open)}>
      {/* <Container className={s.footer_container}> */}
        <div className={s.footer_content}>
          <div className={clsx(s.footer_items, openFooter && items.length && s.footer_cart)}>
            {!openFooter ? <button onClick={items.length > 0 ? openFooterCart : undefined} className={s.footer_item} >
              <Cart />
              <CartCounter />
            </button> : <button onClick={closeFooterCart} className={s.footer_close_cart}>Закрыть</button>}
            {openFooter && items.length > 0 && <button onClick={handleRemoveItemsFromTrash} className={s.footer_cart_trash}><Trash /></button>}
          </div>
          <div className={s.footer_body}>
            <CartOrder />
          </div>
        </div>

      {/* </Container> */}
    </footer>
  )
}
