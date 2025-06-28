import express from "express";
import {
  getAllPendingAdminRequests,
  approveAdminRequest,
  rejectAdminRequest,
} from "../controllers/Admin.controller";
const router = express.Router();
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

// Admin routes for managing pending admin requests
// Only accessible by superadmin
router.get("/pending-admins", verifyJWT, authorizeRoles("superadmin"), getAllPendingAdminRequests);
router.post("/approve/:userId", verifyJWT, authorizeRoles("superadmin"), approveAdminRequest);
router.delete("/reject/:userId", verifyJWT, authorizeRoles("superadmin"), rejectAdminRequest);
