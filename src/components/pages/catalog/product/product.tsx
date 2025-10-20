import { IProductProps } from '@/app/types'
import React, { FC } from 'react'
import { useCartStore } from '@/store/cart-store'
import s from './product.module.scss'
import clsx from 'clsx'
export const Product: FC<IProductProps> = (props) => {
  const {
    id,
    title,
    image,
    price,
    description,
    className
  } = props

  const product = { ...props }

  const items = useCartStore(state => state.items)
  const addToCart = useCartStore(state => state.addToCart)
  const getItemQuantity = useCartStore(state => state.getItemQuantity)

  const quantityInCart = getItemQuantity(id)
  const isInCart = quantityInCart > 0

  const formatPrice = (priceValue: number | undefined): string => {
    if (!priceValue && priceValue !== 0) return 'Цена не указана'
    return priceValue.toLocaleString('ru-RU') + ' ₽'
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart(product)
    console.log('Добавить в корзину:', { id, title, price })
  }

  const handleProductClick = () => {
    console.log('Открыть детали товара:', { id, title })
  }

  if (!title || !image) {
    return null
  }

  return (
    <div className={clsx(s.product, className)} onClick={handleProductClick}>
      <div className={s.imageContainer}>
        <img
          src={image}
          alt={title}
          className={s.image}
          onError={(e) => {
            e.currentTarget.src = '/images/product-placeholder.jpg'
          }}
        />

        
      </div>

      <div className={s.content}>
        <h3 className={s.title}>{title}</h3>
        {description && (
          <p className={s.description}>{description}</p>
        )}

        <div className={s.price}>{formatPrice(price)}</div>

        <button
          className={`${s.addButton} ${isInCart ? s.inCart : ''}`}
          onClick={handleAddToCart}
          disabled={!price}
        >
          {isInCart ? `Добавлен 🛒` : 'В корзину'}
        </button>
      </div>
    </div>
  )
}