import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    phone: { type: String, trim: true },
    position: { type: String, trim: true },
    resumeUrl: { type: String, default: null },
    resumeFileName: { type: String, default: null },
    notes: { type: String, default: "" },
    status: { type: String, enum: ["Applied", "Interviewing", "Selected", "Rejected"], default: "Applied" },
  },
  { timestamps: true }
);

export const Candidate = mongoose.model("Candidate", candidateSchema);


