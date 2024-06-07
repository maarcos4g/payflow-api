import { FastifyInstance } from "fastify";
import { auth } from "../middlewares/auth";
import { db } from "@/db/connection";
import { Unauthorized } from "./_errors/unauthorized";
import z from "zod";

export async function updateProfile(app: FastifyInstance) {
  app
    .register(auth)
    .put('/update', async (request, reply) => {
      const userId = await request.getCurrentUserId()

      const updateUserSchema = z.object({
        email: z.string().email({ message: "Insira um e-mail válido" }).optional(),
        fullName: z.string().optional(),
        avatarUrl: z.string().url().optional(),
      })

      const { avatarUrl, email, fullName } = updateUserSchema.parse(request.body)

      const user = await db.user.findUnique({
        where: {
          id: userId
        }
      })

      if (!user) {
        throw new Unauthorized('User not found.')
      }

      await db.user.update({
        data: {
          avatarUrl,
          email,
          fullName,
          publicName: fullName?.split(' ')[0]
        },
        where: {
          id: userId,
        }
      })

      return reply.status(204).send(null)
    })
}