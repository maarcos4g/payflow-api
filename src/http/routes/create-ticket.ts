import { FastifyInstance } from "fastify";
import { auth } from "../middlewares/auth";
import z from "zod";
import { db } from "@/db/connection";

export async function createTicket(app: FastifyInstance) {
  app
    .register(auth)
    .post('/ticket', async (request, reply) => {
      const userId = await request.getCurrentUserId()

      const createTicketSchema = z.object({
        name: z.string(),
        value: z.number().int(),
        dueDate: z.string().datetime(),
        barcode: z.string(),
      })

      const { barcode, dueDate, name, value } = createTicketSchema.parse(request.body)

      //100 -> 1r
      //32,99 -> 3299

      const ticket = await db.ticket.create({
        data: {
          barcode,
          dueDate,
          name,
          valueInCents: value,
          userId,
        }
      })

      return reply.status(201).send({ ticketId: ticket.id })
    })
}