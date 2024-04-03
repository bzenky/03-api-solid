import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeFetchUserCheckInsHistoryUseCase } from "@/use-cases/factories/make-fetch-user-check-ins-history-use-case";

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const userCheckInsHistoryBodySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = userCheckInsHistoryBodySchema.parse(request.body);

  const userCheckInsUseCase = makeFetchUserCheckInsHistoryUseCase();

  const { checkIns } = await userCheckInsUseCase.execute({
    userId: request.user.sub,
    page,
  });

  return reply.status(201).send({
    checkIns,
  });
}
