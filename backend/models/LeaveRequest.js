import mongoose from "mongoose";

const leaveRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    leaveType: {
      type: String,
      enum: ["vacation", "sick", "personal"],
      required: true,
    },

    reason: { type: String },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "auto-approved"],
      default: "pending",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    impactScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("LeaveRequest", leaveRequestSchema);

