'use client'
import React, { FC } from 'react'
import { IProductProps } from '@/app/types'
import s from './catalog-items.module.scss'
import dynamic from 'next/dynamic'
import { ProductSkeleton } from '../product/product-skeleton'

const Product = dynamic(() => import('../product/product').then(mod => mod.Product), {
  ssr: false,
  loading: () => <ProductSkeleton />
})

export const CatalogItems: FC<{ products: IProductProps[] }> = ({ products }) => {
  return (
    <div className={s.products}>
      {products.map((product) => (
        <Product
          key={product.id}
          {...product}
        />
      ))}
    </div>
  )
}