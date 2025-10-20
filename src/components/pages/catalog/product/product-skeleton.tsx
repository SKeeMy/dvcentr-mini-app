// components/product/product-skeleton.tsx
import React from 'react'
import s from './product.module.scss'

export const ProductSkeleton = () => {
  return (
    <div className={s.productSkeleton}>
      <div className={s.skeletonImageContainer}>
        <div className={s.skeletonImage}></div>
      </div>
      
      <div className={s.skeletonContent}>
        <div className={s.skeletonTitle}></div>
        <div className={s.skeletonDescription}></div>
        <div className={s.skeletonPrice}></div>
        <div className={s.skeletonButton}></div>
      </div>
    </div>
  )
}