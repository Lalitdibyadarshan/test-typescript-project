export interface Product {
  id: string;
  name: string;
  priceInPaise: number;
  stock: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
}

export interface OrderItem {
  productId: string;
  name: string;
  unitPriceInPaise: number;
  quantity: number;
  lineTotalInPaise: number;
}

export interface Order {
  id: string;
  cartId: string;
  customerEmail: string;
  items: OrderItem[];
  totalInPaise: number;
  status: "confirmed";
  createdAt: string;
}

export interface CartView {
  id: string;
  items: Array<CartItem & { product: Product; lineTotalInPaise: number }>;
  totalInPaise: number;
}
