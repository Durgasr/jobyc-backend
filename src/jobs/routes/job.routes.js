// routes/job.routes.js
import express from "express";
import {
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getJobDetailsById,
  getAllJobs,
  jobMatchScore,
} from "../controller/job.controller.js";
import { isAuthenticated } from "../../../middlewares/auth.js";

const router = express.Router();

// jobseeker routes
router.get("/", isAuthenticated, getAllJobs);

// recruiter routes
router.post("/", isAuthenticated, createJob);
router.get("/my", isAuthenticated, getMyJobs);
router.post("/match-score", isAuthenticated, jobMatchScore);

router.get("/:id", isAuthenticated, getJobDetailsById);
router.put("/:id", isAuthenticated, updateJob);
router.delete("/:id", isAuthenticated, deleteJob);

export default router;
