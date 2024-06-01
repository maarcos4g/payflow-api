import fastify from "fastify"
import cors from "@fastify/cors"

import { errorHandler } from "@/error-handler"

import { createUser } from "./routes/create-user"

const app = fastify()

app.register(cors, {
  origin: true, //url da aplicação front
})

//routes
app.register(createUser)


app.setErrorHandler(errorHandler)

app
  .listen({
    port: 3434,
    host: '0.0.0.0'
  })
  .then(() => console.log('🔥 HTTP Server Running...'))