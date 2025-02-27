export interface Product {
  id: number;
  name: string;
  price: number;
  author: string;
  description: string;
  count: number;
}

export interface ProductCheckout extends Product {
  orderedCount: number;
  /** orderedCount * price */
  totalPrice: number;
}
