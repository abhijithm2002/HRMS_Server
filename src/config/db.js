import mongoose from "mongoose";

const defaultUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hrms";

export const connectDB = async (uri = defaultUri) => {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error", err.message);
    process.exit(1);
  }
};


