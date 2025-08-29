import { User } from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "dev_refresh_secret";

export default class AuthController {
  constructor() {}

  register = async (req, res) => {
    try {
      const { name, email, password, role } = req.body || {};
      console.log('body data', req.body)
      if (!name || !email || !password) {
        return res.status(400).json({ message: "name, email and password are required" });
      }

      const existing = await User.findOne({ email: String(email).trim().toLowerCase() });
      if (existing) {
        return res.status(409).json({ message: "User already exists" });
      }

      const hashed = await bcrypt.hash(String(password), 10);
      const user = await User.create({
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        password: hashed,
        role: role || "HR",
      });
      console.log('user created succesffully', user)
      return res.status(201).json({
        message: "User registered successfully",
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  
  // LOGIN USER
  login = async (req, res) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ message: "email and password are required" });
      }

      const user = await User.findOne({ email: email.trim().toLowerCase() });
      if (!user) return res.status(404).json({ message: "User not found" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: "Invalid credentials" });

      const payload = { userId: user._id.toString() };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      // ✅ Store refresh token in HTTP-only cookie for better security
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(200).json({
        message: "Login successful",
        accessToken,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // REFRESH TOKEN
  refresh = async (req, res) => {
    try {
      const token = req.cookies?.refreshToken || req.body?.refreshToken; // Prefer cookie
      if (!token) return res.status(400).json({ message: "refreshToken is required" });

      let payload;
      try {
        payload = jwt.verify(token, REFRESH_SECRET);
      } catch {
        return res.status(401).json({ message: "Invalid or expired refresh token" });
      }

      const user = await User.findById(payload.userId).select("_id role");
      if (!user) return res.status(401).json({ message: "User not found" });

      const newAccessToken = await generateAccessToken({ userId: user._id.toString() });
      return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // LOGOUT USER
  logout = async (req, res) => {
    try {
      res.clearCookie("refreshToken");
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  
}


