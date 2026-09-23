import type { FastifyReply, FastifyRequest } from "fastify";
import { CatalogService } from "../services/catalog.service";

export class CatalogController {
  public constructor(private readonly catalogService: CatalogService) {}

  public list = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    await reply.send({ products: this.catalogService.listProducts() });
  };
}
