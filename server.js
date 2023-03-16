const path = require("path");
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const cms = require("./router/cms");
const bootcamps = require("./router/bootcamps");
const courses = require("./router/courses");
const register = require("./router/auth");
const user = require("./router/users");
const ConnectDB = require("./dbConfig/db");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// Connect to database
ConnectDB();

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE" // what matters here is that OPTIONS is present
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(fileUpload({ useTempFiles: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use("/api/v1/users", user);
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", register);
app.use("/api/v1/cms", cms);
app.use(errorHandler);
// let express to use this
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(`Server is running in ${process.env.NODE_ENV} port on ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
