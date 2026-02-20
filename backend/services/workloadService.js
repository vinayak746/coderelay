import Team from "../models/Team.js";
import LeaveRequest from "../models/LeaveRequest.js";
import Project from "../models/Project.js";

/* ---------------- TEAM AVAILABILITY ---------------- */

export const getTeamAvailability = async (teamId, startDate, endDate) => {
  const team = await Team.findById(teamId).populate("members");

  const totalMembers = team.members.length;

  const overlappingLeaves = await LeaveRequest.find({
    team: teamId,
    status: { $in: ["approved", "auto-approved"] },
    $or: [
      {
        startDate: { $lte: endDate },
        endDate: { $gte: startDate }
      }
    ]
  });

  const membersOnLeave = new Set(
    overlappingLeaves.map(l => l.user.toString())
  );

  const availableMembers = totalMembers - membersOnLeave.size;

  const availabilityPercent =
    (availableMembers / totalMembers) * 100;

  return availabilityPercent;
};

/* ---------------- USER WORKLOAD ---------------- */

export const getUserWorkload = async (userId) => {
  const projects = await Project.find({
    "members.user": userId
  });

  let totalLoad = 0;

  projects.forEach(project => {
    const member = project.members.find(
      m => m.user.toString() === userId.toString()
    );

    const userPoints =
      (project.workloadPoints * member.allocation) / 100;

    totalLoad += userPoints;
  });

  return totalLoad;
};

/* ---------------- WORKLOAD IMPACT ---------------- */

export const calculateWorkloadImpact = async (userId) => {
  const userLoad = await getUserWorkload(userId);

  if (userLoad >= 80) return 40; // high impact
  if (userLoad >= 40) return 20; // medium impact
  return 0; // low impact
};

/* ---------------- FINAL IMPACT SCORE ---------------- */

export const calculateImpactScore = async (
  teamId,
  startDate,
  endDate,
  userId
) => {
  const availability = await getTeamAvailability(
    teamId,
    startDate,
    endDate
  );

  const availabilityImpact = 100 - availability;

  const workloadImpact = await calculateWorkloadImpact(userId);

  return availabilityImpact + workloadImpact;
};