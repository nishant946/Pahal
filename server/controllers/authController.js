import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  console.log("Login request received:", req.body);
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }
    const user = await User.find({ username }).select("+password");
    if (!user || user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user[0]._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      token,
      user: {
        id: user[0]._id,
        username: user[0].username,
        email: user[0].email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const registerUser = async (req, res) => {
  console.log("Registration request received:", req.body);
  const { name, email, password,  department, rollNumber, mobile } = req.body;
  try {
    if ([name, email, password, department, rollNumber, mobile].some(field => !field)) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.find({ email });
    if (existingUser && existingUser.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }
    const newUser = await User.create({
      username: name,
      email,
      password: password,
      department,
      rollNumber,
      mobile
    });
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        department: newUser.department,
        rollNumber: newUser.rollNumber,
        mobile: newUser.mobile
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
