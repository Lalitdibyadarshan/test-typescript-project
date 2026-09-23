import type { Product } from "../types";

export class ProductRepository {
  private readonly products = new Map<string, Product>([
    ["p-shirt", { id: "p-shirt", name: "Classic T-Shirt", priceInPaise: 149900, stock: 20 }],
    ["p-mug", { id: "p-mug", name: "Ceramic Mug", priceInPaise: 79900, stock: 15 }],
    ["p-cap", { id: "p-cap", name: "Everyday Cap", priceInPaise: 99900, stock: 10 }]
  ]);

  public findAll(): Product[] {
    return [...this.products.values()];
  }

  public findById(id: string): Product | undefined {
    return this.products.get(id);
  }

  public reduceStock(productId: string, quantity: number): void {
    const product = this.products.get(productId);
    if (product) product.stock -= quantity;
  }
}
