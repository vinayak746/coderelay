import express from "express";
import {
  createProject,
    getTeamProjects,
  getMyProjects
} from "../controllers/projectController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/create", protect, allowRoles("manager", "admin"), createProject);
router.get("/team-projects", protect, allowRoles("manager", "admin"), getTeamProjects);
router.get("/my-projects", protect, getMyProjects);

export default router;