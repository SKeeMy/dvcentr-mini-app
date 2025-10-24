import React, { useEffect, useState } from 'react'
import s from './banner-slide.module.scss'
import { FC } from 'react'
import { IBannerSlideProps } from './banner-slide.interface'
import clsx from 'clsx'
import Image from 'next/image';
export const BannerSlide: FC<IBannerSlideProps> = (props) => {
  const { background_image, sticker_image, stricker_pos = null, text = null } = props;
  const [isVisible, setIsVisible] = useState(false);
  console.log(sticker_image);

  return (
    <div className={s.slide}>
      {/* Фоновая картинка - с ограничением размера */}
      {background_image && (
        <Image
          src={background_image}
          alt=""
          width={200}
          height={200}
          quality={10}
          className={s.slide_bg}
          loading="lazy"
          decoding="async"
        // onError={(e) => {
        //   // Скрываем битое изображение
        //   e.currentTarget.style.display = 'none';
        // }}
        />
      )}

      {/* Стикер изображение - с ограничением размера */}
      {sticker_image && (
        <Image
          src={sticker_image}
          alt={text || ''}
          className={clsx(
            s.slide_image,
            stricker_pos === 'right' && s.right,
            stricker_pos === 'left' && s.left,
            stricker_pos === 'center' && s.center
          )}
          width={100}
          height={100}
          quality={30}
          loading="lazy"
          decoding="async"

        />
      )}

      {/* Текст */}
      {text && <h3>{text}</h3>}
    </div>
  );
};