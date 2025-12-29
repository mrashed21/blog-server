import express from "express";
import router from "./router/router";

const app = express();

app.use(express.json());

app.use("/api/v1", router);
app.get("/", (req, res) => {
  res.send("blog server is running");
});
export default app;
