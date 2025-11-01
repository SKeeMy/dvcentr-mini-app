import { IProductProps } from '@/app/types'
import React, { FC } from 'react'
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
    console.log('Добавить в корзину:', { id, title, price })
  }

  const handleProductClick = () => {
    openCartFooter('product')
    selectProduct(product)

    console.log('Открыть детали товара:', { id, title })
  }

  if (!title || !image) {
    return null
  }

  const handleRemoveItemFromCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeFromCart(id)
  }

  if (product_type === 'cart') {
    return (
      <div className={clsx(s.product, className, s.product_cart)}>
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
      {product_type !== 'favorite' ?<button className={clsx(s.product_favorite_btn, isFavorite && s.favorite)} onClick={toggleFavorite}><Heart /></button> : 
      <button className={clsx(s.product_favorite_btn, isFavorite && s.favorite)} onClick={toggleFavorite}>
        <Close/>
      </button>}
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
  )
}