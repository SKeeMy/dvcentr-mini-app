'use client'
import React from 'react'
import s from './product-detail.module.scss'
import { useCartStore } from '@/store/cart-store'
import { Container } from '@/components/container/container'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import { Zoom } from 'swiper/modules'
import { formatPrice } from '@/app/utils/formatPrice'
import clsx from 'clsx'

export const ProductDetail = () => {
  const { currentProduct, addToCart, getItemQuantity } = useCartStore()
  const quantityInCart = getItemQuantity(currentProduct.id)
  const isInCart = quantityInCart > 0
  const handleAddToCart = () => {
    addToCart(currentProduct)
  }
  return (
    <div>
      <div className={s.product}>
        <div className={s.product_images}>
          <Swiper
            className={s.swiper}
            spaceBetween={10}
            slidesPerView={1}
            centeredSlides={true}
            resistance={true}
            speed={300}
            zoom={{
              maxRatio: 3,
              minRatio: 1,
            }}
            modules={[Zoom]}
          >
            {currentProduct?.additional.images.map((src, idx) => (
              <SwiperSlide key={idx} className={s.product_slide}>
                <div className="swiper-zoom-container">
                  <Image
                    alt={currentProduct.title}
                    src={src}
                    width={600}
                    height={600}
                    quality={50}
                    loading="lazy"
                    className={s.image}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className={s.product_info}>
          <Container className={s.container}>
            <h3 className={s.product_title}>{currentProduct.title}</h3>

            <div className={s.product_info_wrapper}>
              <div className={s.product_info_top}>
                <div dangerouslySetInnerHTML={{ __html: currentProduct.additional.description }} />
              </div>
              <div className={s.product_info_bottom}>
                <div className={s.product_info_bottom_price}>
                  Цена:
                  <span>{formatPrice(currentProduct.price)}</span>
                </div>
                <button onClick={handleAddToCart} disabled={isInCart} className={clsx(s.product_info_bottom_cart,)}>
                  {isInCart ? 'Добавлен' : 'В корзину'}
                </button>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </div>

  )
}