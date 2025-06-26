import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import cors from "cors";
app.use(cors(
  {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }
))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



export default app;