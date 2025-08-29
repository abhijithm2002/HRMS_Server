import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    type: { type: String, required: true },
    reason: { type: String, default: "" },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    docs: [
      {
        url: { type: String, required: true },
        fileName: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Leave = mongoose.model("Leave", leaveSchema);


