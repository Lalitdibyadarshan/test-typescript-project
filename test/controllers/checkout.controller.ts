import type { FastifyReply, FastifyRequest } from "fastify";
import { CheckoutService } from "../services/checkout.service";

interface CartParams { cartId: string; }
interface CheckoutBody { customerEmail: string; }

export class CheckoutController {
  public constructor(private readonly checkoutService: CheckoutService) {}

  public checkout = async (request: FastifyRequest<{ Params: CartParams; Body: CheckoutBody }>, reply: FastifyReply): Promise<void> => {
    await reply.code(201).send({ order: this.checkoutService.checkout(request.params.cartId, request.body.customerEmail) });
  };
}
