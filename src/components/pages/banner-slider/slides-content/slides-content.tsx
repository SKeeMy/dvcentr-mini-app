import { Box } from '@/components/shared/box/box'
import { Close } from '@/components/shared/icons/close'
import { Spinner } from '@/components/ui/spinner/spinner'
import clsx from 'clsx'
import Image from 'next/image'
import React, { useState } from 'react'
import s from './slides-content.module.scss'
export const SlidesContent = ({ content }: { content: 'howToBuy' }) => {


  const RenderImage = ({ src, alt, disabled }: { src: string, alt: string, disabled?: boolean }) => {
    const [isShow, setShow] = useState<boolean>(false)
    const [isLoaded, setLoaded] = useState<boolean>(false)
    return <>
      {isShow && <div className={s.image_overlay}></div>}
      <div onClick={() => setShow(!isShow)} className={clsx(s.image_wrapper, disabled && s.disabled)}>
        <Image onLoadingComplete={() => setLoaded(true)} quality={50} className={clsx(s.image, isShow && s.show_image,)} src={src} alt={alt} loading='lazy' fill />
        <span className={clsx(s.skeleton_loading, isLoaded && s.hidden)}></span>
        {isShow && <button onClick={() => setShow(false)} className={s.close}><Close /></button>}
      </div>
    </>

  }


  if (content === 'howToBuy') {
    return (
      <>
        <Box>  <h3 className={s.title}>Как оформить заказ?</h3></Box>
        <Box>
          <h3 >Перейдите в каталог</h3>
          {RenderImage({
            src: '/images/slides-content/howtobuy/1.png',
            alt: 'Как купить'
          })}
        </Box>
        <Box>
          <h3>Выберите товар. Нажмите на кнопку «в корзину»</h3>
          <p className={s.description}>⭐️ Заинтересованный вами товар, можно добавить в раздел «Избранное», нажав на значок «сердечко».</p>
          {RenderImage({
            src: '/images/slides-content/howtobuy/2.png',
            alt: 'Как купить'
          })}
        </Box>
        <Box>
          <h3>Оформление заказа</h3>
          <ul className={s.markers}>
            <li>Укажите количество товаров, используя копки «плюс» и «минус». Изменяя количество товаров, оно обновляется и в корзине.</li>
            <li>Чтобы продолжить оформление кликните на кнопку «Оформить заказ».</li>
          </ul>
          {RenderImage({
            src: '/images/slides-content/howtobuy/3.png',
            alt: 'Как купить'
          })}
          <h3>Важно!</h3>
          <ul className={s.markers_button}>
            <li>В моменте оформления заказа не закрываете приложение.</li>
            <li>Дождитесь уведомления об успешном статусе оформления заказа.</li>
            <li>Нажмите кнопку «Понятно», Вам придет сообщение для оплаты в чат бот, а приложение автоматически закроется.</li>
          </ul>
        </Box>
        <Box>
          <h3>Оплата заказа</h3>
          <ul className={s.markers}>
            <li>В чат <strong>DVCENTR.RU.ИНФО</strong> будет отправлена вся информация по заказу</li>
            <li>Нажмите на кнопку «Оплатить».</li>
            <li>Выберите удобный для Вас способ оплаты. Подтвердите операцию с помощью кода из SMS от вашего банка. </li>
          </ul>
          {RenderImage({
            src: '/images/slides-content/howtobuy/4.jpg',
            alt: 'Как купить'
          })}
          <ul className={s.markers}>
            <li>По готовности заказа к выдачи, Вам поступит SMS с кодом</li>
          </ul>
          {RenderImage({
              src: '/images/slides-content/howtobuy/5.png',
              alt: 'Как купить',
              disabled: true
            })}
        </Box>
        <Box>
          <h3 className={s.title}>Желаем вам приятных покупок и <br />
            Спасибо что доверяете нам!</h3>
          {RenderImage({
            src: '/images/ecs.png',
            alt: 'Как купить',
            disabled: true
          })}
        </Box>
      </>
    )
  }


}
