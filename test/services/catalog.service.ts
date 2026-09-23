import { ProductRepository } from "../repositories/product.repository";
import type { Product } from "../types";

export class CatalogService {
  public constructor(private readonly productRepository: ProductRepository) {}

  public listProducts(): Product[] {
    return this.productRepository.findAll();
  }
}
