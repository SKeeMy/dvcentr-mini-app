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
            src: '/images/slides-content/howtobuy/1.jpg',
            alt: 'Как купить'
          })}
        </Box>
        <Box>
          <h3>Добавить товар в корзину. Для этого:</h3>
          <ul className={s.markers}>
            <li>
              Выберите подходящий товар
            </li>
            <li>
              Нажмите на кнопку корзины у товара
            </li>
          </ul>
          {RenderImage({
            src: '/images/slides-content/howtobuy/2.jpg',
            alt: 'Как купить'
          })}
        </Box>
        <Box>
          <h3>Нажмите на кнопку "Оформить заказ"</h3>

          {RenderImage({
            src: '/images/slides-content/howtobuy/3.jpg',
            alt: 'Как купить'
          })}
          <h3>Примечение:</h3>
          <p className={s.description}>Если у вас нет аккаунта на нашем сайте DVCENTR.RU, вы можете:</p>
          <ul className={s.markers}>
            <li>Пройти быструю регистрацию в Мини-приложении</li>
            <li>Зарегистировать на сайте <strong>dvcentr.ru</strong></li>
          </ul>
          <p className={s.description}>
            Приложение автоматически предолжит зарегестрировать аккаунт при оформлении заказа
          </p>

        </Box>
        <Box>
          <h3>В моменте оформления заказа:</h3>
          <ul className={s.markers}>
            <li>Не закрывайте приложение</li>
            <li>Дождитесь выслывающего уведомления о статусе оформления заказа</li>
          </ul>
          {RenderImage({
            src: '/images/slides-content/howtobuy/4.jpg',
            alt: 'Как купить'
          })}
          <ul className={s.markers}>
            <li>Если произошла ошибка: попробуйте оформить заказ снова</li>
            <li>После успешного статуса, нажмите кнопку "Понятно!", вам придет сообщение в чат с ботом, а приложение автоматически закроется</li>
          </ul>
        </Box>
        <Box>
          <h3>Оплата заказа</h3>
          <p className={s.description}>Для оплаты заказа:</p>
          <ul className={s.markers}>
            <li>Перейдите в чат с ботом <strong>DVCENTR.RU.ИНФО</strong></li>
            <li>В чате должна быть вся информация по вашему заказу</li>
            {RenderImage({
              src: '/images/slides-content/howtobuy/5.jpg',
              alt: 'Как купить',
              disabled: true
            })}
            <li>Нажмите на кнопку "Оплатить" для перехода по ссылке на страницу оплаты</li>
            <li>Через платежную систему ЮКасса выполните оплату заказа</li>
          </ul>
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
