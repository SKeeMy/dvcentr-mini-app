import { Thunder } from '@/components/shared/icons/thunder'
import React from 'react'
import s from './catalog-tag.module.scss'
export const CatalogTag = () => {
  return (
    <div className={s.tag}>
      <span><Thunder /></span> Хит
    </div>
  )
}
