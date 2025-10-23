'use client'
import Link from 'next/link'
import React from 'react'
import { Container } from '../container/container'
import { Cart } from '../shared/icons/cart'
import s from './footer.module.scss'
import { useCartStore } from '@/store/cart-store'
import clsx from 'clsx'

import dynamic from 'next/dynamic'
import { Trash } from '../shared/icons/trash'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { hapticFeedback } from '@telegram-apps/sdk'
import { FooterPopup } from './footer-popup'
import { useBodyLock } from '@/app/hooks/useBodyLock'
import { useAppBackButton } from '@/app/hooks/useAppBackButton'
const CartCounter = dynamic(() => import('../cart/cart-counter'), {
  ssr: false,
  loading: () => null
})
export const Footer = () => {

  const { openFooter, openFooterCart, closeFooterCart, items, clearCart } = useCartStore()

  const { showButton, hideButton, isVisible } = useAppBackButton(() => {
    closeFooterCart()
  });

  useBodyLock(openFooter)

  useEffect(() => {
    if (items.length === 0) {
      closeFooterCart()
    }
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('medium');
    }
  }, [items])

  useEffect(() => {
    if (openFooter) {
      if (hapticFeedback.impactOccurred.isAvailable()) {
        hapticFeedback.impactOccurred('rigid');
        showButton()
      }
    } else {
      hideButton()
    }
      
  }, [openFooter])

  const pathname = usePathname()
  if (pathname === '/') return null
  return (

    <footer className={clsx(s.footer, openFooter && s.open)}>
      {/* <Container className={s.footer_container}> */}
      <div className={s.footer_content}>
        <div className={clsx(s.footer_items, openFooter && items.length && s.footer_cart)}>
          {!openFooter && <button onClick={items.length > 0 ? openFooterCart : undefined} className={s.footer_item} >
            <Cart />
            <CartCounter />
          </button>}

        </div>
        <FooterPopup />
      </div>

      {/* </Container> */}
    </footer>

  )
}
