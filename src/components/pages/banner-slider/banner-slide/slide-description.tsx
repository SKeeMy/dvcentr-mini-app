import React from 'react'
import { useSlideStore } from '@/store/slide-store'
import { useCartStore } from '@/store/cart-store'
export const SlideDescription = () => {
  const { currentSlide } = useSlideStore()
    return (
      <div style={{overflow: 'auto'}}>
        {currentSlide.description}
      </div>
    )
  }

