import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  submitResponse,
  getResponsesForSociety,
  getResponsesForTemplate,
  exportResponsesToCSV,
} from "../controllers/formResponse.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.post("/submit/:templateId", submitResponse);
router.get("/society/:societyId", getResponsesForSociety);
router.get("/template/:templateId", getResponsesForTemplate);
router.get("/export-csv/:templateId", exportResponsesToCSV);

export default router;
