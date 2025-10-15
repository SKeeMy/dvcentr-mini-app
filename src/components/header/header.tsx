'use client'
import React from 'react'
import { SearchInput } from '../ui/search-input/search-input'
import { useRouter, usePathname } from 'next/navigation'
import { Container } from '../container/container'

import s from './header.module.scss'
import { Cart } from '../ui/cart/cart'
import { Profile } from '../ui/profile/profile'


export const Header = () => {
  const pathname = usePathname()
  if (pathname === '/') return null
  return (
    <header className={s.header}>
      <Container >
        <div className={s.header_items}>
          <SearchInput />
          <Cart />
          <Profile />
        </div>

      </Container>
    </header>
  )
}
