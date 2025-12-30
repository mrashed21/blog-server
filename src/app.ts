import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "./lib/auth";
import router from "./router/router";
const app = express();

app.use(express.json());

app.use("/api/v1", router);
app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req, res) => {
  res.send("blog server is running");
});
export default app;
