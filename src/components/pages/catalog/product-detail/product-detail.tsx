'use client'
import React, { useEffect, useRef, useState } from 'react'
import s from './product-detail.module.scss'
import { useCartStore } from '@/store/cart-store'
import { Container } from '@/components/container/container'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import { Zoom } from 'swiper/modules'
import { formatPrice } from '@/app/utils/formatPrice'
import clsx from 'clsx'
import { Sheet, SheetRef } from 'react-modal-sheet'
import { useFooterStore } from '@/store/footer-strore'
export const ProductDetail = () => {
  const { currentProduct, addToCart, getItemQuantity } = useCartStore()
  const { isOpen, closeFooter, contentType } = useFooterStore()
  const [descriptionShow, setDescriptionShow] = useState(false)
  const quantityInCart = getItemQuantity(currentProduct.id)
  const isInCart = quantityInCart > 0
  const handleAddToCart = () => {
    addToCart(currentProduct)
  }

  const ref = useRef<SheetRef>(null);
  const snapPoints = [0, 1];


 


  return (
    <div className={s.product}>
      <span onClick={() => setDescriptionShow(true)} className={s.btn}>Описание</span>
        <Swiper
          className={s.swiper}
          spaceBetween={10}
          slidesPerView={1}
          centeredSlides={true}
          resistance={true}
          speed={300}
          wrapperClass={s.wrapper_swiper}
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
      <Sheet
        isOpen={descriptionShow}
        onClose={() => setDescriptionShow(false)}
        // unstyled
        ref={ref}
        snapPoints={snapPoints}
        initialSnap={1}
        tweenConfig={{ ease: 'easeOut', duration: 0.3 }}
        disableDrag={false}
        modalEffectRootId="root"
        dragCloseThreshold={0.4}
        dragVelocityThreshold={200}>
        <Sheet.Container className={s.product_info}>
          {/* <h3 className={s.product_title}>{currentProduct.title}</h3> */}

          <div className={s.product_info_wrapper}>

            <Sheet.Header className={s.header} disableDrag={false} ><span onClick={() => setDescriptionShow(false)} className={s.header_close}>Закрыть</span></Sheet.Header>

            <div className={s.product_info_top}>
              <div dangerouslySetInnerHTML={{ __html: currentProduct.additional.description }} />
            </div>

          </div>
        </Sheet.Container>
      </Sheet>

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

  )
}