import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SSECRET } from "./config";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, request) => {
  const url = request.url;
  // urls in form of array ["localhost:3000", "token=asdasd"]
  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token")!;
  const decoded = jwt.verify(token, JWT_SSECRET) as jwt.JwtPayload & {
    userId?: string;
  };

  if (!decoded || !(decoded as jwt.JwtPayload).userId) {
    ws.close();
    return;
  }

  ws.on("message", (message) => {
    ws.send("pong");
  });
});
