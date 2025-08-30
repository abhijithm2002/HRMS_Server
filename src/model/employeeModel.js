import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    phone: { type: String, trim: true },
    position: { type: String, enum: ["Intern", "Full Time", "Junior", "Senior", "Team Lead"], default: "Intern" },
    department: { type: String, default: null },
    role: { type: String, enum: ["HR", "Employee", "Admin"], default: "Employee" },
    status: { type: String, enum: ["Present", "Absent", "Medical Leave", "Work From Home"], required: true },
    remarks: { type: String, default: "" },
    task: { type: String, default: "General Task" },
    startDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Employee = mongoose.model("Employee", employeeSchema);


