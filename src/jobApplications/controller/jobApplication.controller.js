import {
  findApplication,
  createApplication,
  getApplicationsByJob,
  getApplicationsCountByJob,
  findApplicationById,
} from "../models/jobApplication.repository.js";
import { findJobDetailsById } from "../../jobs/models/job.repository.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";
import { sendEmail } from "../../../utils/sendEmail.js";

// ✅ Apply to Job
export const applyToJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;

    const existing = await findApplication(jobId, userId);
    if (existing) {
      return next(new ErrorHandler(400, "Already applied to this job"));
    }

    const application = await createApplication(jobId, userId);
    res.status(201).json({ success: true, application });
  } catch (err) {
    next(new ErrorHandler(500, err.message));
  }
};

// ✅ Check if user applied
export const checkIfApplied = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;

    const existing = await findApplication(jobId, userId);
    res.json({ applied: !!existing });
  } catch (err) {
    next(new ErrorHandler(500, err.message));
  }
};

// ✅ Recruiter: Get applications for a job
export const getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const applications = await getApplicationsByJob(jobId);
    res.json({ success: true, applications });
  } catch (err) {
    next(new ErrorHandler(500, err.message));
  }
};

export const getApplicationsCount = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const count = await getApplicationsCountByJob(jobId);
    res.json({ success: true, count });
  } catch (err) {
    next(new ErrorHandler(500, err.message));
  }
};

// ✅ Get applicants for a job
export const getJobApplicants = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const applications = await getApplicationsByJob(jobId);
    const jobDetails = await findJobDetailsById(jobId);
    res.json({
      success: true,
      applicants: applications,
      jobDetails: jobDetails,
    });
  } catch (err) {
    next(new ErrorHandler(500, err.message));
  }
};

export const viewResume = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await findApplicationById(id);
    if (!application) {
      return next(new ErrorHandler(404, "Application not found"));
    }

    const job = await findJobDetailsById(application.job);

    await sendEmail(
      application.applicant.email,
      "Your Resume Was Viewed",
      "resume",
      application.applicant.name,
      job.designation,
      job.companyName
    );

    res.json({
      success: true,
      message: "Applicant notified about resume view",
    });
  } catch (err) {
    next(new ErrorHandler(500, err.message));
  }
};

// ✅ Recruiter views applicant profile
export const viewProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await findApplicationById(id);
    if (!application) {
      return next(new ErrorHandler(404, "Application not found"));
    }

    const job = await findJobDetailsById(application.job);
    console.log(application, job);

    await sendEmail(
      application.applicant.email,
      "Your Profile Was Viewed",
      "profile",
      application.applicant.name,
      job.designation,
      job.companyName
    );

    res.json({
      success: true,
      message: "Applicant notified about profile view",
    });
  } catch (err) {
    next(new ErrorHandler(500, err.message));
  }
};
