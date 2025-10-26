import { ErrorHandler } from "../../../utils/errorHandler.js";
import {
  createJobRepo,
  findJobsByRecruiterRepo,
  updateJobRepo,
  deleteJobRepo,
  findJobDetailsById,
  findAllJobsRepo,
} from "../models/job.repository.js";
import { User } from "../../user/models/user.schema.js";
import { findRecruiterDetailsById } from "../../Profile/models/profile.repository.js";

export const createJob = async (req, res, next) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can post jobs" });
    }

    const recruiter = await User.findById(req.user.id);
    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    // ✅ Progress check
    if (recruiter.progress < 80) {
      return res.status(403).json({
        message:
          "Please complete your profile (minimum 80%) before posting a job.",
      });
    }

    const job = await createJobRepo({ ...req.body, recruiter: req.user.id });
    res.status(201).json({ success: true, job });
  } catch (err) {
    next(new ErrorHandler(500, err));
  }
};

export const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await findJobsByRecruiterRepo(req.user.id);
    res.status(200).json({ success: true, jobs });
  } catch (err) {
    next(new ErrorHandler(500, err));
  }
};

export const getJobDetailsById = async (req, res, next) => {
  try {
    const jobDetails = await findJobDetailsById(req.params.id);
    const recruiterDetails = await findRecruiterDetailsById(
      jobDetails.recruiter
    );
    res.json({ success: true, job: jobDetails, recruiter: recruiterDetails });
  } catch (err) {
    next(new ErrorHandler(500, err));
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const job = await updateJobRepo(req.params.id, req.user.id, req.body);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ success: true, job });
  } catch (err) {
    next(new ErrorHandler(500, err));
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const job = await deleteJobRepo(req.params.id, req.user.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ success: true, message: "Job deleted" });
  } catch (err) {
    next(new ErrorHandler(500, err));
  }
};

export const getAllJobs = async (req, res, next) => {
  try {
    const allJobs = await findAllJobsRepo();
    res.json({ success: true, jobs: allJobs });
  } catch (err) {
    next(new ErrorHandler(500, err));
  }
};
