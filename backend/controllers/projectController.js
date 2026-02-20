import Project from "../models/Project.js";
import Team from "../models/Team.js";

/* ---------------- CREATE PROJECT ---------------- */

export const createProject = async (req, res) => {
  try {
    const { name, deadline, workloadPoints, members } = req.body;

    const team = await Team.findOne({ manager: req.user._id });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const project = await Project.create({
      name,
      team: team._id,
      deadline,
      workloadPoints,
      members
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- TEAM PROJECTS (MANAGER) ---------------- */

export const getTeamProjects = async (req, res) => {
  try {
    const team = await Team.findOne({ manager: req.user._id });

    const projects = await Project.find({ team: team._id })
      .populate("members.user", "name email");

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- EMPLOYEE MY PROJECTS ---------------- */

export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      "members.user": req.user._id
    }).select("name deadline workloadPoints members");

    const formatted = projects.map(project => {
      const member = project.members.find(
        m => m.user.toString() === req.user._id.toString()
      );

      const userPoints =
        (project.workloadPoints * member.allocation) / 100;

      return {
        _id: project._id,
        name: project.name,
        deadline: project.deadline,
        totalWorkloadPoints: project.workloadPoints,
        myAllocationPercent: member.allocation,
        myWorkloadPoints: userPoints
      };
    });

    res.json({
      count: formatted.length,
      projects: formatted
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};