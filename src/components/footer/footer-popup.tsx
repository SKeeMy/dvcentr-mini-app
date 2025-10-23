import { useCartStore } from '@/store/cart-store'
import clsx from 'clsx'
import React from 'react'
import s from './footer.module.scss'
import { Cart as CartOrder } from '../cart/cart'
import { useState, useEffect, useRef } from 'react'

export const FooterPopup = () => {
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const popupRef = useRef(null);
  const headerRef = useRef(null);

  const { openFooter, closeFooterCart, items, clearCart } = useCartStore();

  const handleHeaderTouchStart = (e) => {
    e.stopPropagation();
    const touch = e.touches[0];
    setStartY(touch.clientY);
    setCurrentY(touch.clientY);
    setIsSwiping(true);
  };

  const handleHeaderTouchMove = (e) => {
    if (!isSwiping) return;

    const touch = e.touches[0];
    const deltaY = touch.clientY - startY;

    if (deltaY > 0) {
      setCurrentY(touch.clientY);
      e.preventDefault();
    }
  };

  const handleHeaderTouchEnd = (e) => {
    if (!isSwiping) return;

    const deltaY = currentY - startY;
    const popupHeight = popupRef.current?.offsetHeight || 0;

    if (deltaY > popupHeight * 0.3) {
      handleCloseWithAnimation();
    }

    setIsSwiping(false);
    setStartY(0);
    setCurrentY(0);
  };

  const handleCloseWithAnimation = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeFooterCart();
      setIsClosing(false);
    }, 300);
  };

  const getSwipeTransform = () => {
    if (!isSwiping) return '';
    
    const deltaY = currentY - startY;
    return `translateY(${Math.max(0, deltaY)}px)`;
  };

  const handleRemoveItemsFromTrash = () => {
    clearCart();
    handleCloseWithAnimation();
  }

  const shouldShowPopup = openFooter && !isClosing;

  return (
    <div
      ref={popupRef}
      style={{
        transform: getSwipeTransform(),
        transition: isSwiping ? 'none' : undefined
      }}
      className={clsx(
        s.footer_body, 
        shouldShowPopup && s.footer_body_show,
        isClosing && s.footer_body_closing,
        isSwiping && s.footer_body_swiping 
      )}
    >
      <div 
        ref={headerRef}
        className={s.footer_body_header}
        onTouchStart={handleHeaderTouchStart}
        onTouchMove={handleHeaderTouchMove}
        onTouchEnd={handleHeaderTouchEnd}
        style={{ cursor: 'grab', userSelect: 'none' }}
      >
        <button onClick={handleCloseWithAnimation} className={s.footer_close_cart}>Закрыть</button>
        <button onClick={handleRemoveItemsFromTrash} className={s.footer_close_cart}>Очистить</button>
      </div>
      
      <CartOrder />
    </div>
  )
}