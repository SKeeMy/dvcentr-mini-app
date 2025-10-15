import Image from 'next/image'
import React from 'react'
import s from './catalog-category.module.scss'
import { CatalogTag } from './ui/catalog-tag/catalog-tag'
export const CatalogCategory = () => {
  return (
    <div className={s.card}>
      <div className={s.card_tags}>
        <CatalogTag />
      </div>
        <Image fill objectFit='contain' src={'/images/catalog-toys.png'} alt='Категория'/>
        <p className={s.card_name}>
          Игрушки
        </p>
    </div>
  )
}
