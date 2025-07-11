import express from "express";
import { createFormTemplate } from "../controllers/formTemplate.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, authorizeRoles("admin"), createFormTemplate);

export default router;
