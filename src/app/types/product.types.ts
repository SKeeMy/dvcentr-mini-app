export interface IProductProps {
  id: string,
  title: string,
  image: string
  price: number
  description?: string
  className?: string
  product_type?: 'cart' | 'catalog' | 'favorite'
  additional?: productInfo | null
}

interface productInfo {
  images: string[]
  description?: string
}