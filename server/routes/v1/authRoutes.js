import express, { Router } from "express";
import { registerTeacher, loginTeacher } from "../../controllers/teacherController.js";

const authRoutes = Router();

authRoutes.post("/login", loginTeacher);
authRoutes.post("/register", registerTeacher);

export default authRoutes;
