import express, { Router } from "express";
import { loginUser, registerUser } from "../../controllers/authController.js";

const authRoutes = Router();

authRoutes.post("/login", loginUser);
authRoutes.post("/register", registerUser);

export default authRoutes;
