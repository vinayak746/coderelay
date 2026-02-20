import Team from "../models/Team.js";
import LeaveRequest from "../models/LeaveRequest.js";

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

export const calculateImpactScore = async (teamId, startDate, endDate) => {
  const availability = await getTeamAvailability(
    teamId,
    startDate,
    endDate
  );

  // simple formula for now
  let impactScore = 100 - availability;

  return impactScore;
};