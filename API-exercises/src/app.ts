import express from "express";
import "express-async-errors";
import { validationErrorMiddleware } from "./lib/middleware/validation";
import personRoutes from "./lib/routes/person-routes";
import { initCorsMiddleware } from "./lib/middleware/cors";

const app = express();

app.use(express.json());

app.use(initCorsMiddleware());

app.use("/person", personRoutes);

app.use(validationErrorMiddleware);

export default app;
