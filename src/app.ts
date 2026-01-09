import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { auth } from "./lib/auth";
import errorHandler from "./middleware/errorHandler";
import notFound from "./middleware/notFound";
import router from "./router/router";
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_ORIGIN,
    credentials: true,
  })
);

app.use("/api/v1", router);
app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req, res) => {
  res.send("blog server is running");
});

// not found
app.use(notFound);
// global error
app.use(errorHandler);
export default app;
