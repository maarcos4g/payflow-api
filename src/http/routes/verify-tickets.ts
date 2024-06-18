import { FastifyInstance } from "fastify";
import { auth } from "../middlewares/auth";
import { db } from "@/db/connection";
import { BadRequest } from "./_errors/bad-request";
import dayjs from "dayjs";

export async function verifyTicket(app: FastifyInstance) {
  app
    .register(auth)
    .get('/verify', async (request, reply) => {
      const userId = await request.getCurrentUserId()

      const ticket = await db.ticket.findFirst({
        where: {
          userId,
          isPayed: false,
          dueDate: {
            lte: new Date()
          }
        }
      })

      if (!ticket) {
        throw new BadRequest('All of your tickets are paid out.')
      }

      return reply.send({
        ticket: {
          id: ticket.id,
          name: ticket.name,
          dueDate: dayjs(ticket.dueDate).format('DD/MM/YYYY'),
          userId: ticket.userId,
        }
      })
    })
}