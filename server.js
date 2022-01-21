const express = require("express");
const app = express();
const posts = require("./data/posts");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const jwt = require("jsonwebtoken");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
var bodyParser = require("body-parser");

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

dotenv.config();
connectDB();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nodejs PoC Api Project MongoDB",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:5000/",
      },
    ],
  },
  apis: [
    "./server.js",
    "./controllers/userController.js",
    "./controllers/postController.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(
  port,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${port}`)
);

module.exports = app;
