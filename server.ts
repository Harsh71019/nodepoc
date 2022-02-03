import express, { RequestHandler } from "express";
import dotenv from "dotenv";
import connectDB from "./utils/Connectdb";
import errorHandler from "./middleware/errorMiddleware";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import notFound from "./middleware/notFoundMiddleware";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import bodyParser from "body-parser";
//Security Packages
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
// use helmet for security

const app = express();

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

//Sanitize Data
app.use(mongoSanitize());

//Set Security Headers

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
// Prevent CrossSite Scripting XSS

app.use(xss());

//Rate Limiting

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //Minutes
  max: 1000,
});

app.use(limiter);

//Prevent HPP param pollution

app.use(hpp());

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
  port,
  //@ts-ignore
  console.log(`Server running in ${process.env.NODE_ENV} on port ${port}`)
);

export { app };
