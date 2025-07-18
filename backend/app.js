import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import societyRoutes from "./routes/society.routes.js";
import formTemplateRoutes from "./routes/formTemplates.routes.js";
import formResponseRoutes from "./routes/formResponse.routes.js"
import superAdminRoutes from "./routes/superAdmin.routes.js"
import {errorHandler} from "./middleware/error.middleware.js";

//Cors configuration
app.use(cors(
  {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }
))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


app.use("/api/v1/users",userRouter);
app.use("/api/societies", societyRoutes);
app.use("/api/formTemplate",formTemplateRoutes);
app.use("/api/response/", formResponseRoutes);
app.use("/api/superadmin", superAdminRoutes);

app.use(errorHandler);

export default app;