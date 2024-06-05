import { FastifyInstance } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import { Unauthorized } from "../routes/_errors/unauthorized";

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub: userId } = await request.jwtVerify<{ sub: string }>()

        return userId
      } catch (error) {
        throw new Unauthorized('Invalid token.')
      }
    }
  })
})