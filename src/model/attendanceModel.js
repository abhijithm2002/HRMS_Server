import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["Present", "Absent", "Medical Leave", "Work From Home"], required: true },
    remarks: { type: String, default: "" },
    task: { type: String, default: "General Task" },
  },
  { timestamps: true }
);

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);


