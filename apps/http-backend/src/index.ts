import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SigninSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  console.log(parsedData);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Incorrect inputs",
    });
    return;
  }
  // dbcall
  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data?.username ?? "",
        password: parsedData.data?.password ?? "",
        name: parsedData.data?.name ?? "",
      },
    });
    res.json({
      userId: user.id,
    });
  } catch (e) {
    console.log(e);
    res.status(411).json({
      message: "User already exists with this email",
    });
  }
});

app.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }

  // TODO: bcrypt password hashing
  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data?.username!,
    },
  });

  if (!user) {
    res.json({
      message: "User not found",
    });
    return;
  }

  const token = jwt.sign({ userId: user?.id }, JWT_SECRET);
  res.json({ token });
});

app.post("/room", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
//@ts-ignore
  const userId = req.userId;
  try {
    const room = await prismaClient.room.create({
      data: {
        Slug: parsedData.data?.name!,
        adminId: userId,
      },
    });

    res.json({
      roomId: room.id,
    });
  } catch (e) {
    console.log(e);
    res.status(411).json({
      message: "Room already exists with this name",
    });
  }
});

app.listen(3001, () => {
  console.log("http-backend listening on port 3001");
});
