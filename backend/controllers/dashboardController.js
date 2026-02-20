import Team from "../models/Team.js";
import LeaveRequest from "../models/LeaveRequest.js";
import { getTeamAvailability } from "../services/workloadService.js";

export const getManagerSummary = async (req, res) => {
  try {
    const team = await Team.findOne({ manager: req.user._id }).populate("members");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const totalMembers = team.members.length;

    const pendingLeaves = await LeaveRequest.countDocuments({
      team: team._id,
      status: "pending"
    });

    const today = new Date();

    const todayLeaves = await LeaveRequest.countDocuments({
      team: team._id,
      status: { $in: ["approved", "auto-approved"] },
      startDate: { $lte: today },
      endDate: { $gte: today }
    });

    res.json({
      totalMembers,
      todayOnLeave: todayLeaves,
      pendingRequests: pendingLeaves
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTodayAvailability = async (req, res) => {
  try {
    const team = await Team.findOne({ manager: req.user._id });

    const today = new Date();

    const availability = await getTeamAvailability(
      team._id,
      today,
      today
    );

    res.json({ availability });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTeamCalendar = async (req, res) => {
  try {
    const team = await Team.findOne({ manager: req.user._id });

    const leaves = await LeaveRequest.find({
      team: team._id,
      status: { $in: ["approved", "auto-approved"] }
    }).populate("user", "name email");

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};