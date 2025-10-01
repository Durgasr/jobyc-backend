import jwt from "jsonwebtoken";
import { Recruiter, Jobseeker } from "../src/user/models/user.schema.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(403).json({ message: "Login first!" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try finding recruiter or jobseeker
    let user = await Recruiter.findById(decoded.id);
    if (!user) user = await Jobseeker.findById(decoded.id);
    if (!user) return res.status(403).json({ message: "User not found!" });

    req.user = user; // attach user to request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalid or expired" });
  }
};
