import fastify from "fastify"
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"

import { env } from '@/env'

import { errorHandler } from "@/error-handler"

import { createUser } from "./routes/auth-user"
import { updateProfile } from "./routes/update-profile"
import { createTicket } from "./routes/create-ticket"
import { getTicketsExtract } from "./routes/get-tickets-extract"
import { setTicketAsPayed } from "./routes/set-ticket-as-payed"
import { verifyTicket } from "./routes/verify-tickets"

const app = fastify()

app.register(cors, {
  origin: true, //url da aplicação front
})

app.register(jwt, {
  secret: env.JWT_SECRET
})

//routes
app.register(createUser)
app.register(updateProfile)
app.register(createTicket)
app.register(getTicketsExtract)
app.register(setTicketAsPayed)
app.register(verifyTicket)


app.setErrorHandler(errorHandler)

app
  .listen({
    port: 3333,
    host: '0.0.0.0'
  })
  .then(() => console.log('🔥 HTTP Server Running...'))