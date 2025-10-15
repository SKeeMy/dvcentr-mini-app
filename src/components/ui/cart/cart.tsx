import Link from 'next/link'
import React from 'react'
import { Cart as Icon } from '@/components/shared/icons/cart'
import s from './cart.module.scss'
export const Cart = () => {
  return (
    <Link className={s.cart} href={'#'}>
        <Icon />
        <span className={s.cart_counter}>0</span>
    </Link>
  )
}
