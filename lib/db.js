import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "ai_learning_platform",
    });
    console.log("MongoDB Connected ");
  } catch (error) {
    console.log("MongoDB Error ", error);
  }
};
