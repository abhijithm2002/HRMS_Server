import jwt from "jsonwebtoken";
import { User } from "../model/userModel.js";

const JWT_SECRET = process.env.JWT_KEY_SECRET || "dev_secret_change_me";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const userId = payload.userId || payload.sub;
    const user = await User.findById(userId).select("name email role isActive");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (user.isActive === false) {
      return res.status(403).json({ message: "User inactive" });
    }

    req.user = { id: String(user._id), role: user.role, email: user.email, name: user.name };
    return next();
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return next();
  };
};


