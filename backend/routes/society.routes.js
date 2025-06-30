import express from "express";
import { getAllSocieties, getSocietyDetails } from "../controllers/society.controller.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllSocieties); 
router.get("/currentSociety",verifyJWT,authorizeRoles("admin"),getSocietyDetails);
export default router;
