import express from "express";
import {
  setupProfile,
  getLoggedInUser,
} from "../controller/profile.controller.js";
import { isAuthenticated } from "../../../middlewares/auth.js";
import upload from "../../../middlewares/fileUpload.js";

const router = express.Router();

// Get current user
router.get("/me", isAuthenticated, getLoggedInUser);

// Profile setup (handles resume upload)
// router.put("/setup", isAuthenticated, upload.single("resume"), setupProfile);

router.put(
  "/setup",
  isAuthenticated,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),
  setupProfile
);

export default router;
