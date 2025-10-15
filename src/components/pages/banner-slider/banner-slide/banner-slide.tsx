import React from 'react'
import s from './banner-slide.module.scss'
import { FC } from 'react'
import { IBannerSlideProps } from './banner-slide.interface'
import Image from 'next/image'
import clsx from 'clsx'

export const BannerSlide: FC<IBannerSlideProps> = (props) => {

  const { background_image = null, sticker_image = null, stricker_pos = null, text = null } = props
  return (
    <div className={s.slide}>
      <Image quality={10} alt={text} fill src={background_image} className={s.slide_bg} />
      {text && <h3>{text}</h3>}
      {sticker_image && <img src={sticker_image} alt={text} className={clsx(s.slide_image, stricker_pos === 'right' ? s.right : s.left, stricker_pos === 'center' && s.center)} />}
    </div>
  )
}
