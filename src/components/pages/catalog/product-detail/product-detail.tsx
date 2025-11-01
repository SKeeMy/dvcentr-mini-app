'use client'
import React, { useEffect, useRef, useState } from 'react'
import s from './product-detail.module.scss'
import { useCartStore } from '@/store/cart-store'
import { Container } from '@/components/container/container'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import { Pagination, Zoom } from 'swiper/modules'
import { formatPrice } from '@/app/utils/formatPrice'
import clsx from 'clsx'
import { Sheet, SheetRef } from 'react-modal-sheet'
import { useFooterStore } from '@/store/footer-strore'
import { Spinner } from '@/components/ui/spinner/spinner'
import { ProductDetailImage as Slide } from './product-detail-image'
export const ProductDetail = () => {
  const { currentProduct, addToCart, getItemQuantity } = useCartStore()
  const { isOpen, closeFooter, contentType, openFooter } = useFooterStore()
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
        
        pagination={{
          dynamicBullets: true,
          horizontalClass: s.swiper_pagination,
          bulletActiveClass: s.swiper_pagination_active,
          bulletClass: s.swiper_pagination_bullet
        }}
        modules={[Zoom, Pagination]}
      >
        {currentProduct?.additional.images.map((src, idx) => (
          <SwiperSlide  className={s.product_slide}>
            <Slide key={idx} src={src} title={currentProduct.title} />
            
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
        {!isInCart ? <button onClick={handleAddToCart} disabled={isInCart} className={clsx(s.product_info_bottom_cart,)}>
          В корзину
        </button>
        :
        <button onClick={() => openFooter('cart')}  className={clsx(s.product_info_bottom_cart)}>
          Оформить
        </button>}
      </div>

    </div>

  )
}