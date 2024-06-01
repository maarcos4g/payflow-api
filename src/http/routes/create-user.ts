import { db } from "@/db/connection";
import { FastifyInstance } from "fastify";
import { z } from "zod";

import { BadRequest } from "./_errors/bad-request";

export async function createUser(app: FastifyInstance) {
  app
    .post('/user', async (request, reply) => {

      const {
        avatar,
        email,
        fullName,
        googleId
      } = z.object({
        email: z.string().email(),
        fullName: z.string().min(4, { message: "Mínino de 4 caracteres para o nome." }),
        avatar: z.string().url({ message: "Insira uma URL válida" }),
        googleId: z.string()
      }).parse(request.body)

      let user = await db.user.findUnique({
        where: {
          email,
        }
      })

      if (user) {
        throw new BadRequest('User already exist')
      }

      const publicName = fullName.split(' ')[0]

      user = await db.user.create({
        data: {
          avatarUrl: avatar,
          email,
          fullName,
          googleId,
          publicName,
        }
      })

      return reply.status(201).send({ userId: user.id })

    })
}