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

  login = async (req, res) => {
    try {
      const { email, password } = req.body || {};
      console.log('req.body', req.body)
      if (!email || !password) {
        return res.status(400).json({ message: "email and password are required" });
      }

      const user = await User.findOne({ email: String(email).trim().toLowerCase() });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const valid = await bcrypt.compare(String(password), user.password);
      if (!valid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const payload = { userId: String(user._id) };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      return res.status(200).json({
        message: "Login successful",
        accessToken,
        refreshToken,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  refresh = async (req, res) => {
    try {
      const { refreshToken } = req.body || {};
      if (!refreshToken) {
        return res.status(400).json({ message: "refreshToken is required" });
      }

      let payload;
      try {
        payload = jwt.verify(refreshToken, REFRESH_SECRET);
      } catch (e) {
        return res.status(401).json({ message: "Invalid or expired refresh token" });
      }

      const userId = payload.userId || payload.sub;
      const user = await User.findById(userId).select("_id role");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const newAccessToken = await generateAccessToken({ userId: String(user._id) });
      return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  logout = async (_req, res) => {
    try {
      // Stateless JWT: client should discard tokens. Optionally, implement blacklist if required.
      return res.status(200).json({ message: "Logged out" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  me = async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await User.findById(userId).select("name email role");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}


