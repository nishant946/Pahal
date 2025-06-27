import express from "express";
const app = express();
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import ApiRoutes from "./routes/index.js";
import cors from "cors";
import StudentRoutes from "./routes/v1/studentRoutes.js";
dotenv.config();

connectDB();

const PORT = process.env.PORT || 3000;

app.use(cors());
// Middleware to allow CORS for all origins
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.VITE_API_URL); // Allow all origins
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.get("/", (req, res) => {
  res.send("Server is running...");// http://localhost:3000/api
});

app.use(express.json());

app.use("/api", ApiRoutes);
app.use('/api/v1/students', StudentRoutes); // http://localhost:3000/api/v1/students

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
