import express from "express";
import { createTeam, addMember, getMyTeam } from "../controllers/teamController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/create", protect, allowRoles("manager", "admin"), createTeam);
router.post("/add-member", protect, allowRoles("manager", "admin"), addMember);
router.get("/my-team", protect, getMyTeam);

export default router;