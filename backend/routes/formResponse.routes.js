import express from "express";
import { submitResponse } from "../controllers/formResponse.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/:templateId", verifyJWT, authorizeRoles("student"), submitResponse);




export default router;
