const express = require("express")
const morgan = require("morgan")
const dotenv = require("dotenv")
const bootcamps = require("./router/bootcamps")
dotenv.config({ path: "./config/config.env" })
const ConnectDB = require("./config/db")
const errorHandler = require("./middleware/errorHandler")

ConnectDB()

const app = express()
app.use(express.json())
app.use(morgan("dev"))
app.use("/api/v1/bootcamps", bootcamps)
app.use(errorHandler)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE" // what matters here is that OPTIONS is present
  )
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  next()
})
const PORT = process.env.PORT
const server = app.listen(
  PORT,
  console.log(`Server is running in ${process.env.NODE_ENV} port on ${PORT}`)
)

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`)
  server.close(() => process.exit(1))
})
