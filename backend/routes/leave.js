import express from "express";
import {
  submitLeave,
  getMyLeaves,
  approveLeave,
  rejectLeave,
  getTeamLeaves
} from "../controllers/leaveController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/request", protect, submitLeave);
router.get("/my-leaves", protect, getMyLeaves);

router.get("/team-leaves", protect, allowRoles("manager", "admin"), getTeamLeaves);
router.put("/approve/:id", protect, allowRoles("manager", "admin"), approveLeave);
router.put("/reject/:id", protect, allowRoles("manager", "admin"), rejectLeave);

export default router;