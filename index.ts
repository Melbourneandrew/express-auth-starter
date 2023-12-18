import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import { Request, Response } from "express";
import verifyJWT from "./auth/verifyJWT";
import login from "./controllers/login";
import signup from "./controllers/signup";
import cors from "cors";
import cookieParser from "cookie-parser";
const MONGO_DB_URI = process.env.MONGO_DB_URI || "";
if (!MONGO_DB_URI) throw new Error("MongoDB URI not set");

mongoose.connect(MONGO_DB_URI).then(() => {
  console.log("Connected to MongoDB");
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
app.post("/login", login);
app.post("/signup", signup);
app.get(
  "/protected",
  verifyJWT,
  (req: Request, res: Response) => {
    res.send("Protected route. You are logged in.");
  }
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
