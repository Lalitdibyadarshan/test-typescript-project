import { randomUUID } from "node:crypto";
import { AppError } from "../errors";
import { CartRepository } from "../repositories/cart.repository";
import { ProductRepository } from "../repositories/product.repository";
import type { Cart, CartView, Product } from "../types";

export class CartService {
  public constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository
  ) {}

  public createCart(): CartView {
    return this.toView(this.cartRepository.save({ id: randomUUID(), items: [] }));
  }

  public getCart(cartId: string): CartView {
    return this.toView(this.requireCart(cartId));
  }

  public addItem(cartId: string, productId: string, quantity: number): CartView {
    this.assertQuantity(quantity);
    const cart = this.requireCart(cartId);
    const product = this.requireProduct(productId);
    const currentItem = cart.items.find((item) => item.productId === productId);
    const newQuantity = (currentItem?.quantity ?? 0) + quantity;
    this.assertStock(product, newQuantity);
    if (currentItem) currentItem.quantity = newQuantity;
    else cart.items.push({ productId, quantity });
    return this.toView(this.cartRepository.save(cart));
  }

  public updateItem(cartId: string, productId: string, quantity: number): CartView {
    this.assertQuantity(quantity);
    const cart = this.requireCart(cartId);
    const product = this.requireProduct(productId);
    this.assertStock(product, quantity);
    const item = cart.items.find((candidate) => candidate.productId === productId);
    if (!item) throw new AppError(404, "Item is not in this cart");
    item.quantity = quantity;
    return this.toView(this.cartRepository.save(cart));
  }

  public removeItem(cartId: string, productId: string): CartView {
    const cart = this.requireCart(cartId);
    const itemIndex = cart.items.findIndex((item) => item.productId === productId);
    if (itemIndex === -1) throw new AppError(404, "Item is not in this cart");
    cart.items.splice(itemIndex, 1);
    return this.toView(this.cartRepository.save(cart));
  }

  private toView(cart: Cart): CartView {
    const items = cart.items.map((item) => {
      const product = this.requireProduct(item.productId);
      return { ...item, product, lineTotalInPaise: product.priceInPaise * item.quantity };
    });
    return { id: cart.id, items, totalInPaise: items.reduce((sum, item) => sum + item.lineTotalInPaise, 0) };
  }

  private requireCart(cartId: string): Cart {
    const cart = this.cartRepository.findById(cartId);
    if (!cart) throw new AppError(404, "Cart not found");
    return cart;
  }

  private requireProduct(productId: string): Product {
    const product = this.productRepository.findById(productId);
    if (!product) throw new AppError(404, "Product not found");
    return product;
  }

  private assertQuantity(quantity: number): void {
    if (!Number.isInteger(quantity) || quantity < 1) throw new AppError(400, "quantity must be a positive integer");
  }

  private assertStock(product: Product, quantity: number): void {
    if (quantity > product.stock) throw new AppError(409, `Only ${product.stock} unit(s) of ${product.name} are available`);
  }
}
