import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true
  },

  deadline: { type: Date },

  workloadPoints: {
    type: Number,
    required: true
  },

  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      allocation: {
        type: Number,
        required: true
      }
    }
  ]

}, { timestamps: true });

export default mongoose.model("Project", projectSchema);