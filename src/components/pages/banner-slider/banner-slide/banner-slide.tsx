import React, { useEffect } from 'react'
import s from './banner-slide.module.scss'
import { FC } from 'react'
import { IBannerSlideProps } from './banner-slide.interface'
import clsx from 'clsx'
import Image from 'next/image';

export const BannerSlide: FC<IBannerSlideProps> = (props) => {
  const { background_image = null, sticker_image = null, stricker_pos = null, text = null } = props;
  
  // Функция для нормализации путей изображений
  const normalizeImagePath = (path: string | null) => {
    if (!path) return null;
    // Если путь относительный без ведущего слеша - добавляем его
    if (path.startsWith('images/') || path.startsWith('assets/')) {
      return `/${path}`;
    }
    return path;
  };

  const normalizedBgImage = normalizeImagePath(background_image);
  const normalizedStickerImage = normalizeImagePath(sticker_image);
  
  return (
    <div className={s.slide}>
      {/* Фоновая картинка */}
      {normalizedBgImage && (
        <Image 
          src={normalizedBgImage}
          alt={text || ''}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={70}
          priority={false}
          className={s.slide_bg}
        />
      )}
      
      {/* Стикер изображение */}
      {normalizedStickerImage && (
        <div className={clsx(
          s.slide_image_container,
          stricker_pos === 'right' && s.right,
          stricker_pos === 'left' && s.left,
          stricker_pos === 'center' && s.center
        )}>
          <Image
            src={normalizedStickerImage}
            alt={text || ''}
            width={100}
            height={100}
            quality={80}
            priority={false}
            className={s.slide_image}
          />
        </div>
      )}
      
      {/* Текст */}
      {text && <h3>{text}</h3>}
    </div>
  );
};