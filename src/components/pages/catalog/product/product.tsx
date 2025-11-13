import { IProductProps } from '@/app/types'
import React, { FC, useState } from 'react'
import { useCartStore } from '@/store/cart-store'
import s from './product.module.scss'
import clsx from 'clsx'
import { Trash } from '@/components/shared/icons/trash'
import { formatPrice } from '@/app/utils/formatPrice'
import Image from 'next/image'
import { ProductCounter } from './product-counter'
import { useFooterStore } from '@/store/footer-strore'
import { Heart } from '@/components/shared/icons/heart'
import { useFavoriteStore } from '@/store/favorite-store'
import { useRef } from 'react'
import { Close } from '@/components/shared/icons/close'
export const Product: FC<IProductProps> = (props) => {
  const {
    id,
    title,
    image,
    price,
    description,
    className,
    product_type,
    additional
  } = props

  const product = { ...props }

  const items = useCartStore(state => state.items)
  const addToCart = useCartStore(state => state.addToCart)
  const getItemQuantity = useCartStore(state => state.getItemQuantity)
  const removeFromCart = useCartStore(state => state.removeFromCart)
  const quantityInCart = getItemQuantity(id)
  const isInCart = quantityInCart > 0
  const openCartFooter = useFooterStore(state => state.openFooter)
  const selectProduct = useCartStore(state => state.selectProduct)
  const refFavorite = useRef<HTMLDivElement>(null)
  const {
    addToFavorites,
    removeFromFavorites,
    isInFavorites
  } = useFavoriteStore()

  const isFavorite = isInFavorites(product.id)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isFavorite) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart(product)
    openCartFooter('cart')
  }

  const handleProductClick = () => {
    openCartFooter('product')
    selectProduct(product)

  }

  if (!title || !image) {
    return null
  }

  const handleRemoveItemFromCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeFromCart(id)
  }

  const [translateX, setTranslateX] = useState(0)
  const [isRemoving, setIsRemoving] = useState(false)
  const isSwiping = useRef(false)
  const touchStartX = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    isSwiping.current = true
  }
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping.current) return
    
    const currentX = e.touches[0].clientX
    const diff = touchStartX.current - currentX
    if (diff > 0) {
      const resistance = 0.7
      setTranslateX(Math.min(diff * resistance, 120))
    }
  }
  
  const handleTouchEnd = () => {
    isSwiping.current = false
    
    if (translateX > 80) {
      setIsRemoving(true)
      setTimeout(() => {
        handleRemoveItemFromCart({ stopPropagation: () => {} } as React.MouseEvent)
      }, 300)
    } else {
      setTranslateX(0)
    }
  }

  if (product_type === 'cart') {
    return (
      <div style={{
        transform: `translateX(-${translateX}px)`,
        transition: isRemoving ? 'all 0.3s ease' : 'transform 0.2s ease'
      }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd} className={clsx(s.product, className, s.product_cart,  isRemoving && s.removing)}>
        <div className={s.product_cart_left}>
          <div>

            <div className={clsx(s.imageContainer, s.imageContainer_cart)}>
              <Image
                src={image}
                alt={title}
                width={100}
                height={100}
                loading={'lazy'}
                quality={10}
                className={s.image}
                onError={(e) => {
                  e.currentTarget.src = '/images/product-placeholder.jpg'
                }}
              />
            </div>
            <div className={s.price}>{formatPrice(price)}</div>
          </div>

          <div className={s.content}>
            <h3 className={s.title}>{title}</h3>
          </div>
        </div>
        <div className={s.product_cart_right}>
          <button onClick={handleRemoveItemFromCart} className={s.remove_item}><Trash /></button>
          <ProductCounter productId={id} />
        </div>
      </div>
    )
  }
  return (
    <div className={clsx(s.product, className)} onClick={handleProductClick}>

      <div className={s.imageContainer}>
        <Image
          src={image}
          alt={title}
          width={100}
          height={100}
          quality={10}
          className={s.image}
          onError={(e) => {
            e.currentTarget.src = '/images/product-placeholder.jpg'
          }}
        />


      </div>

      <div className={s.content}>
        <h3 className={s.title}>{title}</h3>
        {/* {description && (
          <p className={s.description}>{description}</p>
        )} */}
        <div className={s.bottom_card_wraper}>
          <div className={s.price}>{formatPrice(price)}</div>
          <div className={s.buttons}>

            {product_type !== 'favorite' ? <button className={clsx(s.product_favorite_btn, isFavorite && s.favorite)} onClick={toggleFavorite}><Heart /></button> :
              <button className={clsx(s.product_favorite_btn, isFavorite && s.favorite, s.favorite_remove)} onClick={toggleFavorite}>
                <Close />
              </button>}
            <button
              className={`${s.addButton} ${isInCart ? s.inCart : ''}`}
              onClick={handleAddToCart}
              disabled={!price}
            >
              {isInCart ? `✓︎ ` : '🛒'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}