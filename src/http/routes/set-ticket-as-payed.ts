import { db } from "@/db/connection";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { BadRequest } from "./_errors/bad-request";
import { auth } from "../middlewares/auth";

export async function setTicketAsPayed(app: FastifyInstance) {
  app
    .register(auth)
    .put('/ticket/:ticketId', async (request, reply) => {
      const userId = await request.getCurrentUserId()

      const updateTicketSchema = z.object({
        ticketId: z.string().cuid(),
      })

      const { ticketId } = updateTicketSchema.parse(request.params)

      const ticket = await db.ticket.findUnique({
        where: {
          id: ticketId,
          userId,
        }
      })

      if (!ticket) {
        throw new BadRequest('The ticket that you want to set as paid, does not exist.')
      }

      if (ticket.isPayed === true) {
        throw new BadRequest('The ticket was paid.')
      }

      await db.ticket.update({
        data: {
          isPayed: true,
          payedDate: new Date(),
        },
        where: {
          id: ticketId,
        }
      })

      return reply.status(204).send(null)
    })
}