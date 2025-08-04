import express from "express";
import { createFormTemplate, getFormTemplateById, getFormTemplates,getFormTemplatesBySocietyId } from "../controllers/formTemplate.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, authorizeRoles("admin"), createFormTemplate);
router.get("/form/:formId", verifyJWT, authorizeRoles("student"), getFormTemplateById);
router.get(
  "/formForSociety/:societyId",
  verifyJWT,
  getFormTemplatesBySocietyId
);
router.get("/forms", verifyJWT, getFormTemplates);



export default router;
