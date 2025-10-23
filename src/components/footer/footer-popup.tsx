import { useCartStore } from '@/store/cart-store'
import clsx from 'clsx'
import React from 'react'
import s from './footer.module.scss'
import { Sheet } from 'react-modal-sheet'
import { Cart as CartOrder } from '../cart/cart'
import { useState, useEffect, useRef } from 'react'

export const FooterPopup = () => {


  const { openFooter, closeFooterCart, items, clearCart } = useCartStore();


  const handleRemoveItemsFromTrash = () => {
    clearCart();
    closeFooterCart()
  }


  return (
    <Sheet
      isOpen={openFooter}
      onClose={closeFooterCart}
      detent="content"
      snapPoints={[0, 1]}
      initialSnap={1}
      tweenConfig={{ ease: 'easeOut', duration: 0.3 }}
      disableDrag={false}
      modalEffectRootId="root"
    >
      <Sheet.Container
        className={s.sheet_container}
        style={{
          background: 'white',
          borderTopLeftRadius: '30px',
          borderTopRightRadius: '30px',
        }}
      >
        <Sheet.Header
          className={s.sheet_header}
          disableDrag={false}
        >
          <div className={s.footer_body_header}>
            <button onClick={closeFooterCart} className={s.footer_close_cart}>
              Закрыть
            </button>
            <button onClick={handleRemoveItemsFromTrash} className={s.footer_close_cart}>
              Очистить
            </button>
          </div>
        </Sheet.Header>


        <CartOrder />
      </Sheet.Container>

      <Sheet.Backdrop
        onTap={closeFooterCart}
        style={{ background: 'rgba(0, 0, 0, 0.5)' }}
      />
    </Sheet>
  )
}