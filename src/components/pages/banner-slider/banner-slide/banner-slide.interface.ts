export interface IBannerSlideProps {
  id: number
  sticker_image: string | null
  stricker_pos?: 'left' | 'right' | 'center'
  background_image?: string | null
  text: string | null
}