import { randomUUID } from "node:crypto";
import { AppError } from "../errors";
import { CartRepository } from "../repositories/cart.repository";
import { OrderRepository } from "../repositories/order.repository";
import { ProductRepository } from "../repositories/product.repository";
import type { Order, OrderItem } from "../types";

export class CheckoutService {
  public constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
    private readonly orderRepository: OrderRepository
  ) {}

  public checkout(cartId: string, customerEmail: string): Order {
    const cart = this.cartRepository.findById(cartId);
    if (!cart) throw new AppError(404, "Cart not found");
    if (cart.items.length === 0) throw new AppError(400, "Cannot checkout an empty cart");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) throw new AppError(400, "A valid customerEmail is required");

    const items: OrderItem[] = cart.items.map((cartItem) => {
      const product = this.productRepository.findById(cartItem.productId);
      if (!product) throw new AppError(404, "Product not found");
      if (cartItem.quantity > product.stock) throw new AppError(409, `${product.name} no longer has enough stock`);
      return { productId: product.id, name: product.name, unitPriceInPaise: product.priceInPaise, quantity: cartItem.quantity, lineTotalInPaise: product.priceInPaise * cartItem.quantity };
    });

    for (const item of cart.items) this.productRepository.reduceStock(item.productId, item.quantity);
    const order: Order = {
      id: randomUUID(), cartId, customerEmail: customerEmail.toLowerCase(), items,
      totalInPaise: items.reduce((sum, item) => sum + item.lineTotalInPaise, 0),
      status: "confirmed", createdAt: new Date().toISOString()
    };
    this.orderRepository.save(order);
    this.cartRepository.delete(cartId);
    return order;
  }
}
