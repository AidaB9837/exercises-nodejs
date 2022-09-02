import express from "express";
import "express-async-errors";
import { validationErrorMiddleware } from "./lib/middleware/validation";
import personRoutes from "./routes/person-routes";
import { initCorsMiddleware } from "./lib/middleware/cors";
import { initSessionMiddleware } from "./lib/middleware/session";
import { passport } from "./lib/middleware/passport";
import authRoutes from "./routes/auth";
import {
  notFoundMiddleware,
  initErrorMiddleware,
} from "./lib/middleware/error";

const app = express();

app.use(initSessionMiddleware(app.get("env")));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use(initCorsMiddleware());

app.use("/person", personRoutes);
app.use("/auth", authRoutes);
app.use(notFoundMiddleware);

app.use(validationErrorMiddleware);
app.use(initErrorMiddleware(app.get("env")));

export default app;
