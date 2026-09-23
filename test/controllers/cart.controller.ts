import type { FastifyReply, FastifyRequest } from "fastify";
import { CartService } from "../services/cart.service";

interface CartParams { cartId: string; }
interface ItemParams extends CartParams { productId: string; }
interface AddItemBody { productId: string; quantity: number; }
interface QuantityBody { quantity: number; }

export class CartController {
  public constructor(private readonly cartService: CartService) {}

  public create = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    await reply.code(201).send({ cart: this.cartService.createCart() });
  };

  public get = async (request: FastifyRequest<{ Params: CartParams }>, reply: FastifyReply): Promise<void> => {
    await reply.send({ cart: this.cartService.getCart(request.params.cartId) });
  };

  public addItem = async (request: FastifyRequest<{ Params: CartParams; Body: AddItemBody }>, reply: FastifyReply): Promise<void> => {
    const { productId, quantity } = request.body;
    await reply.send({ cart: this.cartService.addItem(request.params.cartId, productId, quantity) });
  };

  public updateItem = async (request: FastifyRequest<{ Params: ItemParams; Body: QuantityBody }>, reply: FastifyReply): Promise<void> => {
    await reply.send({ cart: this.cartService.updateItem(request.params.cartId, request.params.productId, request.body.quantity) });
  };

  public removeItem = async (request: FastifyRequest<{ Params: ItemParams }>, reply: FastifyReply): Promise<void> => {
    await reply.send({ cart: this.cartService.removeItem(request.params.cartId, request.params.productId) });
  };
}
