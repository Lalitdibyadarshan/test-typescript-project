import type { Order } from "../types";

export class OrderRepository {
  private readonly orders = new Map<string, Order>();

  public save(order: Order): Order {
    this.orders.set(order.id, order);
    return order;
  }
}
