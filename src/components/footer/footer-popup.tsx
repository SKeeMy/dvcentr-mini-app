import { useFooterStore } from '@/store/footer-strore'
import { useCartStore } from '@/store/cart-store'
import clsx from 'clsx'
import React from 'react'
import s from './footer.module.scss'
import { Sheet } from 'react-modal-sheet'
import { useAuthStore } from '@/store/auth-store'
import { useFavoriteStore } from '@/store/favorite-store'

export const FooterPopup = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, closeFooter, contentType } = useFooterStore()
  const { clearCart } = useCartStore()
  const { fetchUserData, user } = useAuthStore()
  const { clearFavorites } = useFavoriteStore()

  const handleRemoveItemsFromTrash = () => {
    clearCart()
    closeFooter()
  }

  const handleRemoveFavorites = () => {
    clearFavorites()
    closeFooter()
  }


  const requestPhoneNumber = async () => {
    try {
      await fetchUserData(user?.phone)
    } catch (error) {
      console.error('Ошибка запроса контакта:', error)
    }
  }

  const showClearButton = contentType === 'cart'
  const showRefreshButton = contentType === 'profile'
  const showProduct = contentType === 'product'

  const showClearButtonFavorite = contentType === 'favorites'

  return (
    <Sheet
      isOpen={isOpen}
      onClose={closeFooter}
      detent="content"
      snapPoints={[0, 1]}
      initialSnap={1}
      tweenConfig={{ ease: 'easeOut', duration: 0.3 }}
      disableDrag={false}
      modalEffectRootId="root"
      dragCloseThreshold={0.4}
      dragVelocityThreshold={200}
    >
      <Sheet.Container
        className={clsx(s.sheet_container, showProduct && s.sheet_container_full)}
        style={{
          background: 'white',
          borderTopLeftRadius: '30px',
          borderTopRightRadius: '30px',
        }}
      >
        <Sheet.Header disableDrag={false}>
          <div className={s.footer_body_header}>
            <button onClick={closeFooter} className={s.footer_close_cart}>
              Закрыть
            </button>
            {showClearButton && (
              <button onClick={handleRemoveItemsFromTrash} className={s.footer_close_cart}>
                Очистить
              </button>
            )}
            {showClearButtonFavorite && (
              <button onClick={handleRemoveFavorites} className={s.footer_close_cart}>
                Очистить
              </button>
            )}
            {showRefreshButton && (
              <button onClick={requestPhoneNumber} className={s.footer_close_cart}>
                Обновить
              </button>
            )}
          </div>
        </Sheet.Header>

        {children}
      </Sheet.Container>

      <Sheet.Backdrop
        onTap={closeFooter}
        style={{ background: 'rgba(0, 0, 0, 0.5)' }}
      />
    </Sheet>
  )
}