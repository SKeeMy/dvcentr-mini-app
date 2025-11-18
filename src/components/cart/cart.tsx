'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { ProductSkeleton } from '../pages/catalog/product/product-skeleton'
import s from './cart.module.scss'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/app/utils/formatPrice'
import { useAuthStore } from '@/store/auth-store'
import { useFooterStore } from '@/store/footer-strore'
import { popup, miniApp } from '@telegram-apps/sdk'
import { useOrdersStore } from '@/store/orders-store'
import { Box } from '../shared/box/box'
import { usePathname } from 'next/navigation'
import { PrimaryButton } from '../shared/buttons/primary-button/primary-button'
import AnimateHeight from 'react-animate-height'
import { Arrow } from '../shared/icons/arrow'
import clsx from 'clsx'
const Product = dynamic(() => import('../pages/catalog/product/product').then(mod => mod.Product), {
  ssr: false,
  loading: () => <ProductSkeleton />
})

const TotalPrice = dynamic(() => import('./cart-price').then(mod => mod.CartPrice), {
  ssr: false,
  loading: () => 'Подсчет'
})

export const Cart = () => {
  const { items, clearCart } = useCartStore()
  const totalPrice = useCartStore(state => state.getTotalPrice())
  const { apiUserData } = useAuthStore()
  const { openFooter, closeFooter } = useFooterStore()
  const { setIsOrdering } = useOrdersStore()


  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  const toggleHeight = () => {
    if (height === 0) {
      setHeight(contentRef.current.scrollHeight + 20);
    } else {
      setHeight(0);
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight + 20)
    }
  }, [])


  
  const pathname = usePathname()
  const handleOpenRegistration = () => {
    closeFooter()
    setTimeout(() => {
      openFooter('registration')

    }, 100);
  }

  let OrderData = {
    ConsigneeMobilePhone: '',
    DateShip: '',
    TransTime: '',
    ClientBitrixId: '', //
    MethodDelivery: 'СВ',
    Geo: {
      Address: '',
      ZoneDlv: '',
      FiasAddressStateOrProvince: '',
      FiasAddressTown: '',
      FiasAddressSettlement: '',
      FiasAddressStreet: '',
      FiasAddressHouse: '',
      FiasAddressCode: '',
      Zip: '',
      Latitude: '',
      Longitude: '',
      CoordinateCode: ''
    },
    OrderList: []
  }


  const handleCreateOrder = async () => {
    OrderData.ConsigneeMobilePhone = apiUserData.personal_phone
    OrderData.ClientBitrixId = apiUserData.bitrix_id
    // OrderData.ConsigneeMobilePhone = '79025067430' 
    // OrderData.ClientBitrixId = '351'

    closeFooter()
    setIsOrdering(true)

    OrderData.OrderList = items.map(item => ({
      axCode: item.product.id,
      AmountOneWithTax: item.product.price,
      Qty: item.quantity
    }))


    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    try {
      const response = await fetch('/api/tg-react-app/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-Proto': 'https',
          'X-Forwarded-Ssl': 'on',
          'HTTPS': 'YES',
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN ?? '3C7D5B2F9A1E4D6C8B2A5F7E3D1C9B2A'}`
        },
        body: JSON.stringify(OrderData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        alert('Возникла ошибка, попробуйте еще раз')
        throw new Error(`HTTP error! status: ${response.status}`);

      }
      const result = await response.json();

      if (result.STATUS === 'SUCCESS') {
        setIsOrdering(false)
        try {
          const result = await popup.open({
            title: 'Заказ оформлен',
            message: 'В чат придет инструкция по оплате',
            buttons: [{
              id: 'ok',
              type: 'default',
              text: 'Понятно!'
            }

            ]
          })
          if (result === 'ok') {
            miniApp.close()
            clearCart()

          }

        } catch (error) {
          console.error(error)
        }
      } else {
        alert('Возникла ошибка, попробуйте еще раз')
        setIsOrdering(false)
      }
    } catch (error) {
      console.log(error)
      alert('Возникла ошибка, попробуйте еще раз')
      setIsOrdering(false)
    }

  }





  const renderButton = () => {
    if (apiUserData === null) return <div className={s.reg}>Для продолжения<button onClick={handleOpenRegistration} className={s.order_link}> зарегистрируйтесь</button></div>
    else return <button onClick={handleCreateOrder} className={s.order_link}>Оформить заказ на
      <TotalPrice price={totalPrice} />
    </button>
  }

  if (pathname === '/catalog' && items.length === 0) {
    return <Box>
      <h3 className={s.title}>Здесь пока пусто. <br /> Добавьте товар в корзину</h3>
    </Box>
  }

  if (items.length === 0) {
    return <Box>
      <h3 className={s.title}>Здесь пока пусто. <br /> Перейдите в каталог</h3>
      <PrimaryButton onClick={closeFooter} href='/catalog' >Каталог</PrimaryButton>
    </Box>
  }

  return (
    <div className={s.cart}>
      <div className={s.cart_items}>
        {items.length > 0 && items.map(product => (
          <Product product_type='cart' className={s.product} key={product.product.id} id={product.product.id} description={product.product.description} price={product.product.price} image={product.product.image} title={product.product.title} />
        ))}
      </div>

      <div className={s.order}>
        <span onClick={toggleHeight} className={clsx(s.order_arrow, height !== 0 && s.open)}><Arrow /></span>
        <div style={{height: height}}  ref={contentRef} className={clsx(s.notification, height !== 0 && s.open)}>
            <span>Забрать оплаченный заказ можно по адресу:</span>
            <span><strong> г. Владивосток, ул. Русская, 65, 3 этаж, оф. 4</strong></span>
            <span>Перед покупкой, просим ознакомиться с <br /><strong><Link className={s.notification_link} target={'_blank'} href={"https://dvcentr.ru/oferta/?main=0&additional=2"}>Договором оферты</Link></strong> </span>
        </div>
        {renderButton()}

      </div>

    </div>
  )
}
