import express from "express";
const app = express();
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import ApiRoutes from "./routes/index.js";
dotenv.config();

connectDB();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Server is running...");// http://localhost:3000/api
});

app.use(express.json());

app.use("/api", ApiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
