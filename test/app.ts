import Fastify, { type FastifyInstance } from "fastify";
import { CartController } from "./controllers/cart.controller";
import { CatalogController } from "./controllers/catalog.controller";
import { CheckoutController } from "./controllers/checkout.controller";
import { AppError } from "./errors";
import { CartRepository } from "./repositories/cart.repository";
import { OrderRepository } from "./repositories/order.repository";
import { ProductRepository } from "./repositories/product.repository";
import { CartService } from "./services/cart.service";
import { CatalogService } from "./services/catalog.service";
import { CheckoutService } from "./services/checkout.service";

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });
  const productRepository = new ProductRepository();
  const cartRepository = new CartRepository();
  const orderRepository = new OrderRepository();
  const catalogController = new CatalogController(new CatalogService(productRepository));
  const cartController = new CartController(new CartService(cartRepository, productRepository));
  const checkoutController = new CheckoutController(new CheckoutService(cartRepository, productRepository, orderRepository));

  app.get("/health", async () => ({ status: "ok" }));
  app.get("/products", catalogController.list);
  app.post("/carts", cartController.create);
  app.get("/carts/:cartId", cartController.get);
  app.post("/carts/:cartId/items", cartController.addItem);
  app.patch("/carts/:cartId/items/:productId", cartController.updateItem);
  app.delete("/carts/:cartId/items/:productId", cartController.removeItem);
  app.post("/carts/:cartId/checkout", checkoutController.checkout);

  app.setErrorHandler((error, _request, reply) => {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    reply.code(statusCode).send({ error: error instanceof AppError ? error.message : "Internal server error" });
  });
  return app;
}
