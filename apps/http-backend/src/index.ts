import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SSECRET } from "./config";

const app = express();

app.post("/signup", (req, res) => {
  // dbcall
  res.json({
    userId: 1,
  });
});

app.post("/signin", (req, res) => {
  const userId = 1;
  const token = jwt.sign({ userId }, JWT_SSECRET);
  res.json({ token });
});

app.post("/room", middleware, (req, res) => {
  res.json({
    roomId: 123,
  });
});

app.listen(3001, () => {
  console.log("http-backend listening on port 3001");
});
