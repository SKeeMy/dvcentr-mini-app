'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React from 'react'
import { ProductSkeleton } from '../pages/catalog/product/product-skeleton'
import s from './cart.module.scss'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/app/utils/formatPrice'
import { useAuthStore } from '@/store/auth-store'
import { useFooterStore } from '@/store/footer-strore'
import { popup, miniApp } from '@telegram-apps/sdk'
import { useOrdersStore } from '@/store/orders-store'

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
    MethodDelivery: '',
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
    // OrderData.ConsigneeMobilePhone = apiUserData.personal_phone
    // OrderData.ClientBitrixId = apiUserData.bitrix_id

    const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

     


    OrderData.OrderList = items.map(item => ({
      axCode: item.product.id,
      AmountOneWithTax: item.product.price,
      Qty: item.quantity
    }))

    // const response = await fetch('/api/tg-react-app/register-user', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'X-Forwarded-Proto': 'https',
    //     'X-Forwarded-Ssl': 'on',
    //     'HTTPS': 'YES',
    //     'X-Requested-With': 'XMLHttpRequest',
    //   },
    //   body: JSON.stringify(OrderData),
    //   signal: controller.signal
    // });

    // clearTimeout(timeoutId);

    console.log(OrderData)

    closeFooter()
    setIsOrdering(true)

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
        setIsOrdering(false)
      }
     
    } catch (error) {
      console.error(error)

    }
    
  }





  const renderButton = () => {
    if (apiUserData === null) return <div className={s.reg}>Для продолжения<button onClick={handleOpenRegistration} className={s.order_link}> зарегистрируйтесь</button></div>
    else return <button onClick={handleCreateOrder} className={s.order_link}>Оформить заказ на
      <TotalPrice price={totalPrice} />
    </button>
  }

  return (
    <div className={s.cart}>
      <div className={s.cart_items}>
        {items.length > 0 && items.map(product => (
          <Product product_type='cart' className={s.product} key={product.product.id} id={product.product.id} description={product.product.description} price={product.product.price} image={product.product.image} title={product.product.title} />
        ))}
      </div>

      <div className={s.order}>
        {renderButton()}

      </div>

    </div>
  )
}
