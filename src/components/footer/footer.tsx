'use client'
import Link from 'next/link'
import React from 'react'
import { Container } from '../container/container'
import { Cart } from '../shared/icons/cart'
import s from './footer.module.scss'
import { useCartStore } from '@/store/cart-store'
import { useFooterStore } from '@/store/footer-strore'
import clsx from 'clsx'

import dynamic from 'next/dynamic'
import { Trash } from '../shared/icons/trash'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { hapticFeedback } from '@telegram-apps/sdk'
import { FooterPopup } from './footer-popup'
import { useBodyLock } from '@/app/hooks/useBodyLock'
import { Heart } from '../shared/icons/heart'
import { Profile } from '../shared/icons/profile'
import { QRScanner as QRIcon } from '../shared/icons/qr'
import { Home } from '../shared/icons/home'
import { Cart as CartOrder } from '../cart/cart'
import { UserProfile } from '../user-profile/user-profile'
import { ProductDetail } from '../pages/catalog/product-detail/product-detail'
import { Favorite } from '../favorite/favorite'
import { UserRegistration } from '../user-registration/user-registration'
import { GetOrder } from '../get-order/get-order'
import { qrScanner } from '@telegram-apps/sdk'

const CartCounter = dynamic(() => import('../cart/cart-counter'), {
  ssr: false,
  loading: () => null
})

const FavoriteCounter = dynamic(() => import('../favorite/favorite-counter'), {
  ssr: false,
  loading: () => null
})

const QRContent = () => <div>Контент для QR</div>
const FavoritesContent = () => <Favorite />
const ProfileContent = () => <UserProfile />
const GetOrdersContent = () => <GetOrder />

const RegistrationContent = () => <UserRegistration />

export const Footer = () => {
  const { items } = useCartStore()
  const { isOpen, contentType, openFooter, closeFooter } = useFooterStore()

  useBodyLock(isOpen)

  useEffect(() => {
    if (items.length === 0) {
      closeFooter()
    }
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('medium')
    }
  }, [items])

  useEffect(() => {
    if (isOpen && hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('rigid')
    }
  }, [isOpen])

  const pathname = usePathname()
  // if (pathname === '/') return null

  const renderContent = () => {
    switch (contentType) {
      case 'cart':
        return <CartOrder />
      case 'qr':
        return <QRContent />
      case 'favorites':
        return <FavoritesContent />
      case 'profile':
        return <ProfileContent />
      case 'product':
        return <ProductDetail />
      case 'registration':
        return <RegistrationContent />
      case 'orders':
        return <GetOrdersContent />
      default:
        return null
    }
  }


  const handlerOpenScanner = async () => {
    // openFooter('qr')

    if (qrScanner.open.isAvailable()) {
      try {
        qrScanner.isOpened(); // false
        let promise = qrScanner.open({ text: 'Scan any QR' });
        qrScanner.isOpened(); // true
        await promise;
        qrScanner.isOpened(); // false

        // qrScanner.isOpened(); // false
        // promise = qrScanner.open({
        //   text: 'Scan some specific QR',
        //   capture(qr) {
        //     return qr === 'some-specific-qr';
        //   },
        // });
        qrScanner.isOpened(); // true
        await promise;
        qrScanner.isOpened(); // false
      } catch (error) {
        console.error('QR Scanner error:', error);
      }
    } else {
      console.log('QR Scanner is not available');
    }
  }

  return (
    <footer className={clsx(s.footer, isOpen && s.open)}>
      <div className={s.footer_content}>
        <div className={clsx(s.footer_items)}>
          <Link href={'/'} className={s.footer_item}>
            <Home />
          </Link>

          <button
            className={s.footer_item}
            onClick={handlerOpenScanner}
          >
            <QRIcon />
          </button>

          <button
            onClick={() => items.length > 0 && openFooter('cart')}
            className={s.footer_item}
          >
            <Cart />
            <CartCounter />
          </button>

          <button
            className={s.footer_item}
            onClick={() => openFooter('favorites')}
          >
            <FavoriteCounter />
            <Heart />
          </button>

          <button
            className={s.footer_item}
            onClick={() => openFooter('profile')}
          >
            <Profile />
          </button>
        </div>

        <FooterPopup>
          {renderContent()}
        </FooterPopup>
      </div>
    </footer>
  )
}