import React, { useEffect, useState } from 'react'
import s from './banner-slide.module.scss'
import { FC } from 'react'
import { IBannerSlideProps } from './banner-slide.interface'
import clsx from 'clsx'
import Image from 'next/image';
export const BannerSlide: FC<IBannerSlideProps> = (props) => {
  const { background_image = null, sticker_image = null, stricker_pos = null, text = null } = props;
  const [isVisible, setIsVisible] = useState(false);

  // Отложенная загрузка изображений
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={s.slide}>
      {/* Фоновая картинка - с ограничением размера */}
      {background_image && isVisible && (
        <Image
          src={background_image}
          alt=""
          width={200}
          height={200}
          quality={10}
          className={s.slide_bg}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            // Скрываем битое изображение
            e.currentTarget.style.display = 'none';
          }}
        />
      )}

      {/* Стикер изображение - с ограничением размера */}
      {sticker_image && isVisible && (
        <img
          src={sticker_image}
          alt={text || ''}
          className={clsx(
            s.slide_image,
            stricker_pos === 'right' && s.right,
            stricker_pos === 'left' && s.left,
            stricker_pos === 'center' && s.center
          )}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            // Скрываем битое изображение
            e.currentTarget.style.display = 'none';
          }}
        />
      )}

      {/* Текст */}
      {text && <h3>{text}</h3>}
    </div>
  );
};