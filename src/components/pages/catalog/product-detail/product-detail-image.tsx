'use clint'
import Image from 'next/image'
import React from 'react'
import s from './product-detail.module.scss'
import { useState } from 'react'
import { SwiperSlide } from 'swiper/react'
import { Spinner } from '@/components/ui/spinner/spinner'
import clsx from 'clsx'
interface Props {
  title: string
  src: string
}

export const ProductDetailImage: React.FC<Props> = ({ title, src }) => {
  const [isImageLoading, setImageLoading] = useState<boolean>(true)
  return (
    <div className="swiper-zoom-container">
      <Image
        alt={title}
        src={src}
        width={600}
        height={600}
        quality={50}
        loading="lazy"
        className={s.image}
        onLoadStart={() => setImageLoading(true)}
        onLoadingComplete={() => setImageLoading(false)}
      />
      <Spinner className={clsx(s.spinner, isImageLoading && s.visible)} />
      <div className='swiper-lazy-preloader'></div>

    </div>

  )
}
