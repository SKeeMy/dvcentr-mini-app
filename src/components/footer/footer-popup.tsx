import { useFooterStore } from '@/store/footer-strore'
import { useCartStore } from '@/store/cart-store'
import clsx from 'clsx'
import React from 'react'
import s from './footer.module.scss'
import { Sheet } from 'react-modal-sheet'

export const FooterPopup = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, closeFooter, contentType } = useFooterStore()
  const { clearCart } = useCartStore()

  const handleRemoveItemsFromTrash = () => {
    clearCart()
    closeFooter()
  }

  const showClearButton = contentType === 'cart'

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
    >
      <Sheet.Container
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