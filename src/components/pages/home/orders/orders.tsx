import React from 'react'
import s from './orders.module.scss'
import { FC } from 'react'
import { IOrdersProps } from './orders.interface'

export const Orders: FC<IOrdersProps> = (props) => {
  const { loading, orderData } = props

  if (loading || !orderData) {
    return (
      <div className={s.orders}>
        {[...Array(4)].map((_, index) => (
          <div key={index} className={s.orders_item}>
            <div className={`${s.skeleton_title} ${s.skeleton}`}></div>
            <div className={`${s.skeleton_text} ${s.skeleton}`}></div>
          </div>
        ))}
      </div>
    )
  } 

  return (
    <div className={s.orders}>
      <div className={s.orders_item}>
        <p className={s.orders_item_title}>Продукция:</p>
        <p className={s.orders_item_text}>{orderData.ItemNameAlias}</p>
      </div>
      <div className={s.orders_item}>
        <p className={s.orders_item_title}>Покупатель:</p>
        <p className={s.orders_item_text}>{orderData.ConsigneeName}</p>
      </div>
      <div className={s.orders_item}>
        <p className={s.orders_item_title}>Остаток по заказу:</p>
        <p className={s.orders_item_text}>{orderData.RemainQty}</p>
      </div>
      <div className={s.orders_item}>
        <p className={s.orders_item_title}>Остаток по доверенности:</p>
        <p className={s.orders_item_text}>{orderData.RemainAmount}</p>
      </div>
    </div>
  )
}