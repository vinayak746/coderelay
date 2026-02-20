import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["present", "absent", "leave"],
    default: "present"
  },
  checkInTime: Date,
  checkOutTime: Date
}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);