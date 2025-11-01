'use client'
import React from 'react'
import s from './favorite.module.scss'
import { useFavoriteStore } from '@/store/favorite-store'
import { Product } from '../pages/catalog/product/product'
import { Container } from '../container/container'
import { Box } from '../shared/box/box'
import { PrimaryButton } from '../shared/buttons/primary-button/primary-button'
import { usePathname } from 'next/navigation'
import { useFooterStore } from '@/store/footer-strore'

export const Favorite = () => {
  const { favorites } = useFavoriteStore()
  const pathname = usePathname()
  const { closeFooter } = useFooterStore()
  if (pathname === '/catalog' && favorites.length === 0) {
    return <Box>
      <h3 className={s.title}>Здесь пока пусто. <br /> Добавьте товар в избранное</h3>
    </Box>
  }

  if (favorites.length === 0) {
    return <Box>
      <h3 className={s.title}>Здесь пока пусто. <br /> Перейдите в каталог</h3>
      <PrimaryButton onClick={closeFooter} buttonText='Каталог' href='/catalog' />
    </Box>
  }
  return (
    <div style={{ overflow: 'auto' }}>
      <h3 className={s.title}>Вам понравилось</h3>
      <Container>
        <div className={s.favorites}>
          {favorites.map((item, idx) => (
            <Product key={idx} {...item} />
          ))}
        </div>
      </Container>
    </div>
  )
}
