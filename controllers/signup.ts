import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IUser, User } from "../models/User";
const TOKEN_HASH = process.env.JWT_SECRET || "";
if (!TOKEN_HASH) throw new Error("JWT secret not set");

export default async function (req: Request, res: Response) {
  console.log("Signup request");
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password)
    return res
      .status(400)
      .send("Username or password not provided");

  const existingUser = await User.findOne({ username });
  if (existingUser)
    return res.status(400).send("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    password: hashedPassword,
  });
  await user.save();
  const token = jwt.sign({ id: user?._id }, TOKEN_HASH);
  return res
    .cookie("token", token, {
      secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    })
    .status(200)
    .send("Signed up");
}
