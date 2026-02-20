import LeaveRequest from "../models/LeaveRequest.js";
import User from "../models/User.js";
import Team from "../models/Team.js";
import Attendance from "../models/Attendance.js";
import { getDatesBetween } from "../utils/dateUtils.js";
import {
  getTeamAvailability,
  calculateImpactScore
} from "../services/workloadService.js";

export const submitLeave = async (req, res) => {
  try {
    const { startDate, endDate, leaveType, reason } = req.body;

    if (!startDate || !endDate || !leaveType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(req.user._id);

    if (!user.team) {
      return res.status(400).json({
        message: "User is not assigned to any team"
      });
    }

    const leaveDates = getDatesBetween(startDate, endDate);
    const leaveDays = leaveDates.length;

    if (user.leaveBalance[leaveType] < leaveDays) {
      return res.status(400).json({
        message: "Not enough leave balance"
      });
    }

    const availability = await getTeamAvailability(
      user.team,
      startDate,
      endDate
    );

    const impactScore = await calculateImpactScore(
      user.team,
      startDate,
      endDate
    );

    let status = "pending";

    if (availability >= 60) {
      status = "auto-approved";

      user.leaveBalance[leaveType] -= leaveDays;
      await user.save();

      const attendanceRecords = leaveDates.map(date => ({
        user: user._id,
        date,
        status: "leave"
      }));

      await Attendance.insertMany(attendanceRecords);
    }

    const leave = await LeaveRequest.create({
      user: user._id,
      team: user.team,
      startDate,
      endDate,
      leaveType,
      reason,
      status,
      impactScore
    });

    res.status(201).json({
      message:
        status === "auto-approved"
          ? "Leave auto-approved"
          : "Leave request submitted",
      leave,
      availability
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("startDate endDate leaveType status impactScore createdAt");

    res.json({
      count: leaves.length,
      leaves
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const approveLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    if (leave.status !== "pending") {
      return res.status(400).json({ message: "Leave already processed" });
    }

    const user = await User.findById(leave.user);

    const leaveDates = getDatesBetween(leave.startDate, leave.endDate);
    const leaveDays = leaveDates.length;

    if (user.leaveBalance[leave.leaveType] < leaveDays) {
      return res.status(400).json({ message: "Insufficient leave balance" });
    }

    // deduct leave balance per day
    user.leaveBalance[leave.leaveType] -= leaveDays;
    await user.save();

    // mark attendance as leave
    const attendanceRecords = leaveDates.map(date => ({
      user: user._id,
      date,
      status: "leave"
    }));

    await Attendance.insertMany(attendanceRecords);

    leave.status = "approved";
    leave.approvedBy = req.user._id;
    await leave.save();

    res.json({ message: "Leave approved", leaveDays });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rejectLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    leave.status = "rejected";
    leave.approvedBy = req.user._id;
    await leave.save();

    res.json({ message: "Leave rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTeamLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ team: req.user.team })
      .populate("user", "name email");

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};