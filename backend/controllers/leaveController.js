import LeaveRequest from "../models/LeaveRequest.js";
import User from "../models/User.js";
import Team from "../models/Team.js";

export const submitLeave = async (req, res) => {
  try {
    const { startDate, endDate, leaveType, reason } = req.body;

    if (!startDate || !endDate || !leaveType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!req.user.team) {
      return res.status(400).json({ message: "User is not assigned to any team" });
    }

    const leave = await LeaveRequest.create({
      user: req.user._id,
      team: req.user.team,
      startDate,
      endDate,
      leaveType,
      reason
    });

    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ user: req.user._id });
    res.json(leaves);
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

    leave.status = "approved";
    leave.approvedBy = req.user._id;
    await leave.save();

    // reduce leave balance
    const user = await User.findById(leave.user);
    user.leaveBalance[leave.leaveType] -= 1;
    await user.save();

    res.json({ message: "Leave approved" });
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