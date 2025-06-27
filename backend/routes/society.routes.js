import express from "express";
import { getAllSocieties } from "../controllers/society.controller.js";

const router = express.Router();

router.get("/", getAllSocieties); 

export default router;
