'use client'
import React, { FC } from 'react'
import { SearchInput } from '../ui/search-input/search-input'
import { useRouter, usePathname } from 'next/navigation'
import { Container } from '../container/container'

import s from './header.module.scss'
import { Cart } from '../ui/cart/cart'
import { Profile } from '../ui/profile/profile'
import clsx from 'clsx'
type HeaderProps = {
  header_type: 'catalog' | 'any'
}
export const Header: FC<HeaderProps> = ({ header_type }) => {
  const pathname = usePathname()
  // if (pathname === '/') return null
  if (header_type === 'catalog') {
    return (
      <header className={s.catalog}>
        <Container >
          <div className={s.header_catalog}>
            {/* <SearchInput />
            <Cart />
            <Profile /> */}
            <div className={s.catalog_left}>
              <img src="/images/logo.png" alt="Logo" />
              <h2>DVCENTR.RU</h2>
            </div>

          </div>

        </Container>
      </header>
    )
  }
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
