

import { IBannerSlideProps } from '@/components/pages/banner-slider/banner-slide/banner-slide.interface'
import { create } from 'zustand'

export type SlideState = {
  currentSlide: IBannerSlideProps | null

  setCurrentSlide: (slide: IBannerSlideProps) => void
}

export const useSlideStore = create<SlideState>((set) => ({
  currentSlide: null,

  setCurrentSlide: (slide: IBannerSlideProps) => set({currentSlide: slide})

})) 