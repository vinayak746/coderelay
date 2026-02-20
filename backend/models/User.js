import mongoose from "mongoose";

const leaveBalanceSchema = new mongoose.Schema({
  casual: { type: Number, default: 5 },
  sick: { type: Number, default: 5 },
  paid: { type: Number, default: 10 }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["employee", "manager", "admin"],
    default: "employee"
  },

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    default: null
  },

  leaveBalance: {
    type: leaveBalanceSchema,
    default: () => ({})
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);