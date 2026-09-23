import type { Cart } from "../types";

export class CartRepository {
  private readonly carts = new Map<string, Cart>();

  public save(cart: Cart): Cart {
    this.carts.set(cart.id, cart);
    return cart;
  }

  public findById(id: string): Cart | undefined {
    return this.carts.get(id);
  }

  public delete(id: string): void {
    this.carts.delete(id);
  }
}
