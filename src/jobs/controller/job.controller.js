import fs from "fs";
import path from "path";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { fileURLToPath } from "url";
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
import { getMatchScore } from "../../../utils/matchScore.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export const jobMatchScore = async (req, res) => {
  try {
    const { description } = req.body;
    const user = await User.findById(req.user.id);

    if (!user || !user.resumeUrl) {
      return res.status(400).json({ error: "Resume not found" });
    }

    // build absolute file path instead of URL
    const resumePath = path.join(__dirname, "../../../", user.resumeUrl);

    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({ error: "Resume file not found" });
    }

    // Read PDF binary
    const data = new Uint8Array(fs.readFileSync(resumePath));
    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let resumeText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      resumeText += content.items.map((item) => item.str).join(" ") + "\n";
    }

    if (!resumeText.trim()) {
      return res.status(400).json({ error: "Failed to extract text from PDF" });
    }

    // Get AI match score
    const score = await getMatchScore(resumeText, description);

    res.json({ matchScore: score });
  } catch (err) {
    console.error("Error in jobMatchScore:", err);
    res.status(500).json({ error: "Failed to calculate match score" });
  }
};
