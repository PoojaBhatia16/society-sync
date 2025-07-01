import express from "express";
import { AddEvents, getAllSocieties, getSocietyDetails } from "../controllers/society.controller.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { getEvents } from "../controllers/event.controller.js";

const router = express.Router();

router.get("/", getAllSocieties); 
router.get("/currentSociety",verifyJWT,authorizeRoles("admin"),getSocietyDetails);
router.get(
  "/currentSociety/getEvents",
  verifyJWT,
  authorizeRoles("admin"),
  getEvents
);
router.post(
  "/addEvent",
  verifyJWT,
  authorizeRoles("admin"),
  upload.single("banner"),
  AddEvents
);
export default router;
