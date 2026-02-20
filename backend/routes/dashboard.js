import express from "express";
import {
  getManagerSummary,
  getTodayAvailability,
  getTeamCalendar
} from "../controllers/dashboardController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/summary", protect, allowRoles("manager", "admin"), getManagerSummary);
router.get("/availability-today", protect, allowRoles("manager", "admin"), getTodayAvailability);
router.get("/calendar", protect, allowRoles("manager", "admin"), getTeamCalendar);

export default router;