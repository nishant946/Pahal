import mongoose from "mongoose";

const connectDB = async () => {

    await mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("🚀 MongoDB connected: ", mongoose.connection.host);
    })
    .catch((error) => {
      console.error("⚠️ MongoDB connection error:", error);
      process.exit(1);
    });
};

export default connectDB;
