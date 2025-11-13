'use client'
import { Container } from '@/components/container/container';
import React from 'react'
import { BannerSlide } from './banner-slide/banner-slide';
import { IBannerSlideProps } from './banner-slide/banner-slide.interface';
import s from './banner-slider.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules';
import 'swiper/css/pagination';
import { Box } from '@/components/shared/box/box';
import { SlidesContent } from './slides-content/slides-content';



export const BannerSlider = () => {

  const slides: IBannerSlideProps[] = [
    {
      id: 3,
      text: 'Как оформить заказ?',
      background_image: '/images/ykassa.jpg',
      sticker_image: null,
      description: <SlidesContent content='howToBuy' />

    },
    {
      id: 1,
      text: 'Мини-приложение от DVCENTR👋',
      background_image: '/images/i.webp',
      sticker_image: '/images/ecs.png',
      stricker_pos: 'right'
    },

    {
      id: 2,
      text: 'Фирменный мерч в наличии!',
      background_image: '/images/banner.jpg',
      sticker_image: '/images/toy-sticker.png',
      stricker_pos: 'center'
    }

  ]


  return (
    <div className={s.slider_wrapper}>
      <Swiper
        className={s.swiper}
        spaceBetween={10}
        slidesPerView={1.1}
        centeredSlides={true}
        resistance={true}
        speed={300}
        pagination={{
          dynamicBullets: true,
          horizontalClass: s.swiper_pagination,
          bulletActiveClass: s.swiper_pagination_active,
          bulletClass: s.swiper_pagination_bullet
        }}

        observer={true}
        observeParents={true}
        observeSlideChildren={true}
        touchStartPreventDefault={false}
        touchMoveStopPropagation={false}
        shortSwipes={true}
        longSwipes={false}
        followFinger={true}
        threshold={5}
        watchOverflow={true}
        resizeObserver={false}
        onInit={(swiper) => {
          setTimeout(() => {
            swiper.update();
          }, 100);
        }}
        modules={[Pagination]}
      >
        {slides.map(slide => (
          <SwiperSlide>
            <BannerSlide key={slide.id}
              text={slide.text}
              sticker_image={slide.sticker_image}
              background_image={slide.background_image}
              id={slide.id}
              stricker_pos={slide.stricker_pos}
              description={slide.description}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
