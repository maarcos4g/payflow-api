import { FastifyInstance } from "fastify";
import { auth } from "../middlewares/auth";
import { z } from 'zod'
import { db } from "@/db/connection";
import { BadRequest } from "./_errors/bad-request";

export async function deleteTicket(app: FastifyInstance) {
  app
    .register(auth)
    .delete('/ticket/:ticketId/delete', async (request, reply) => {
      const userId = await request.getCurrentUserId()

      const deleteTicketSchema = z.object({
        ticketId: z.string().cuid(),
      })

      const { ticketId } = deleteTicketSchema.parse(request.params)
      
      const ticket = await db.ticket.findUnique({
        where: {
          id: ticketId,
        }
      })

      if (!ticket) {
        throw new BadRequest('The ticket you are trying to delete, does not exist.')
      }

      await db.ticket.delete({
        where: {
          id: ticketId,
        }
      })

      return reply.status(202).send()
    })
}