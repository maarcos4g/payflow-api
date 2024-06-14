import { FastifyInstance } from "fastify";
import { auth } from "../middlewares/auth";
import { db } from "@/db/connection";

import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

export async function getTicketsExtract(app: FastifyInstance) {
  app
    .register(auth)
    .get('/tickets', async (request, reply) => {
      const userId = await request.getCurrentUserId()

      const ticketsPayed = await db.ticket.findMany({
        where: {
          userId,
          // isPayed: true,
        },
      })

      const tickets = ticketsPayed.map((ticket) => {
        return {
          id: ticket.id,
          name: ticket.name,
          value: ticket.valueInCents / 100,
          dueDate: dayjs(ticket.dueDate).format('DD/MM/YYYY'),
        }
      })

      return reply.status(200).send({ tickets })
    })
}