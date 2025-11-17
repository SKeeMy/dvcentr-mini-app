'use client'
import Link from 'next/link'
import React, { useState } from 'react'
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
import { GetRemains } from '../get-remains/get-remains'
import { SlideDescription } from '../pages/banner-slider/banner-slide/slide-description'
import { Gamepad } from '../shared/icons/gamepad'
import { Plus } from '../shared/icons/plus'
import { Close } from '../shared/icons/close'

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
const GetRemainsContent = () => <GetRemains />
const RegistrationContent = () => <UserRegistration />

export const Footer = () => {
  const { items } = useCartStore()
  const { isOpen, contentType, openFooter, closeFooter } = useFooterStore()
  const [isShowAdds, setShowAdds] = useState<boolean>(false)
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

  const toggleAddsMenu = () => {
    setShowAdds(!isShowAdds)
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('light')
    }
  }

  const closeAddsMenu = () => {
    setShowAdds(false)
  }

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
      case 'remains':
        return <GetRemainsContent />
      case 'slide':
        return <SlideDescription />
      default:
        return null
    }
  }

  const handlerOpenScanner = async () => {
    closeAddsMenu()
    if (qrScanner.open.isAvailable()) {
      try {
        qrScanner.isOpened();
        let promise = qrScanner.open({ text: 'Отсканируйте QR-код' });
        qrScanner.isOpened();
        await promise;
        qrScanner.isOpened();
        await promise;
        qrScanner.isOpened();
      } catch (error) {
        console.error('QR Scanner error:', error);
      }
    } else {
      console.log('QR Scanner is not available');
    }
  }

  const openGame = () => {
    closeAddsMenu()
    // Здесь логика открытия игры
    console.log('Open game')
  }
  if (pathname === '/game') return null
  return (
    <footer className={clsx(s.footer, isOpen && s.open)}>
      <div className={s.footer_content}>
        <div className={clsx(s.footer_items)}>
          <Link href={'/'} className={s.footer_item}>
            <Home />
            <span>Главная</span>
          </Link>
          <Link href={'/game'}
            className={s.footer_item}
            onClick={openGame}
          >
            <Gamepad />
            <span>Игра</span>
          </Link>
          {/* <div
            onClick={toggleAddsMenu}
            className={clsx(
              s.footer_item,
              s.functions_button,
              isShowAdds && s.functions_button_active
            )}
          >
            <div className={s.button_icon}>
              <Plus className={s.plus_icon} />
              <Close className={s.close_icon} />
            </div>
            <span className={s.button_text}>
              {isShowAdds ? 'Закрыть' : 'Функции'}
            </span>

            <div className={clsx(s.footer_adds, isShowAdds && s.show_adds)}>
              <button
                className={s.footer_add_item}
                onClick={handlerOpenScanner}
              >
                <QRIcon />
                <span>Скан QR</span>
              </button>
              <Link href={'/game'}
                className={s.footer_add_item}
                onClick={openGame}
              >
                <Gamepad />
                <span>Игра</span>
              </Link>
            </div>
          </div> */}

          <button
            onClick={() => openFooter('cart')}
            className={s.footer_item}
          >
            <Cart />
            <CartCounter />
            <span>Корзина</span>
          </button>

          <button
            className={s.footer_item}
            onClick={() => openFooter('favorites')}
          >
            <FavoriteCounter />
            <Heart />
            <span>Избранное</span>
          </button>

          <button
            className={s.footer_item}
            onClick={() => openFooter('profile')}
          >
            <Profile />
            <span>Профиль</span>
          </button>
        </div>

        <FooterPopup>
          {renderContent()}
        </FooterPopup>
      </div>
    </footer>
  )
}