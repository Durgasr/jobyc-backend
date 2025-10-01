import { JobApplication } from "./jobApplication.schema.js";

export const findApplication = async (jobId, userId) => {
  return await JobApplication.findOne({ job: jobId, applicant: userId });
};

export const createApplication = async (jobId, userId) => {
  const application = new JobApplication({ job: jobId, applicant: userId });
  return await application.save();
};

export const getApplicationsByJob = async (jobId) => {
  return await JobApplication.find({ job: jobId }).populate(
    "applicant",
    "name email location skills experience resumeUrl "
  );
};

export const getApplicationsCountByJob = async (jobId) => {
  return await JobApplication.countDocuments({ job: jobId });
};

export const findApplicationById = async (applicationId) => {
  return await JobApplication.findById(applicationId).populate(
    "applicant",
    "name email"
  );
};
