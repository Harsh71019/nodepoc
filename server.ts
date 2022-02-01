import express, { RequestHandler } from "express";
const app = express();
import dotenv from "dotenv";
import connectDB from "./utils/Connectdb";
import errorHandler from "./middleware/errorMiddleware";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
var bodyParser = require("body-parser");
import notFound from "./middleware/notFoundMiddleware";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

app.use(express.json() as RequestHandler);
app.use(
  express.urlencoded({
    extended: true,
  }) as RequestHandler
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

declare var process: {
  env: {
    NODE_ENV: string;
    PORT: number;
  };
};
const port = process.env.PORT || 5000;

app.listen(
  port
  // console.log(`Server running in ${process.env.NODE_ENV} on port ${port}`)
);

module.exports = app;
