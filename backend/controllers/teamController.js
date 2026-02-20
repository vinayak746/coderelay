import Team from "../models/Team.js";
import User from "../models/User.js";

export const createTeam = async (req, res) => {
  try {
    console.log("createTeam hit");

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Team name is required" });
    }

    const existingTeam = await Team.findOne({ manager: req.user._id });
    if (existingTeam) {
      return res.status(400).json({ message: "Manager already has a team" });
    }

    const team = await Team.create({
      name,
      manager: req.user._id,
      members: [req.user._id]
    });

    await User.findByIdAndUpdate(req.user._id, { team: team._id });

    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const team = await Team.findOne({ manager: req.user._id });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.members.includes(userId)) {
      return res.status(400).json({ message: "User already in team" });
    }

    team.members.push(userId);
    await team.save();

    await User.findByIdAndUpdate(userId, { team: team._id });

    res.json({ message: "Member added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyTeam = async (req, res) => {
  try {
    let team;

    if (req.user.role === "manager") {
      team = await Team.findOne({ manager: req.user._id })
        .populate("members", "name email role");
    } else {
      team = await Team.findById(req.user.team)
        .populate("members", "name email role");
    }

    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};