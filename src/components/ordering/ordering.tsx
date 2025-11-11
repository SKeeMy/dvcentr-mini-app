import React from 'react'
import s from './ordering.module.scss'
import clsx from 'clsx'
import { useOrdersStore } from '@/store/orders-store'
export const Ordering = () => { 
  const { isOrdering } = useOrdersStore()
  return (
    <div className={clsx(s.wrapper, isOrdering && s.visible)}>
      <div className={s.content}>
        <p>Подождите, оформляем заказ</p>
        <span className={s.loader}></span>

      </div>

    </div>
  )
}
