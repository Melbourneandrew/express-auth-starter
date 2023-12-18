import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IUser, User } from "../models/User";
const TOKEN_HASH = process.env.JWT_SECRET || "";
if (!TOKEN_HASH) throw new Error("JWT secret not set");

export default async function (req: Request, res: Response) {
  console.log("Login request for user " + req.body.username);
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password)
    return res
      .status(400)
      .send("Username or password not provided");

  const user: IUser | null = await User.findOne({ username });
  if (!user) return res.status(404).send("User not found");

  const validPassword = await bcrypt.compare(
    password,
    user.password
  );
  if (!validPassword)
    return res.status(400).send("Invalid password");

  const token = jwt.sign({ id: user?._id }, TOKEN_HASH);
  console.log("Login successful");
  return res
    .cookie("token", token, {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    })
    .status(200)
    .send("Logged in");
}
