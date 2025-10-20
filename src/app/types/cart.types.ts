import { IProductProps } from "./product.types";

export interface CartItem {
  product: IProductProps
  quantity: number
}