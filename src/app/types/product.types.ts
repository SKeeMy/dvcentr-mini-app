export interface IProductProps {
  id: number,
  title: string,
  image: string
  price: number
  description?: string
  className?: string
  product_type?: 'cart' | 'catalog'
}