import express from "express";
import Attendance from "../models/Attendance.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my-attendance", protect, async (req, res) => {
  try {
    const records = await Attendance.find({ user: req.user._id })
      .select("date status");

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;