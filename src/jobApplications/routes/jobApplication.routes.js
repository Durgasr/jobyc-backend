// routes/jobApplicationRoutes.js
import express from "express";
import {
  applyToJob,
  checkIfApplied,
  getJobApplications,
  getApplicationsCount,
  getJobApplicants,
  viewResume,
  viewProfile,
} from "../controller/jobApplication.controller.js";
import { isAuthenticated } from "../../../middlewares/auth.js";

const router = express.Router();

router.route("/apply/:jobId").post(isAuthenticated, applyToJob);
router.route("/check/:jobId").get(isAuthenticated, checkIfApplied);

// recruiter only
router.route("/:jobId/applications").get(isAuthenticated, getJobApplications);

router.get("/:jobId/count", isAuthenticated, getApplicationsCount);

// Get all applicants
router.get("/:jobId/applicants", isAuthenticated, getJobApplicants);

router.get("/:id/view-resume", isAuthenticated, viewResume);
router.get("/:id/view-profile", isAuthenticated, viewProfile);
export default router;
