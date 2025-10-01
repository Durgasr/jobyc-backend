import Job from "./job.schema.js";

export const createJobRepo = async (jobData) => {
  return await Job.create(jobData);
};

export const findJobsByRecruiterRepo = async (recruiterId) => {
  return await Job.find({ recruiter: recruiterId });
};

export const findJobDetailsById = async (jobId) => {
  return await Job.findById(jobId);
};

export const updateJobRepo = async (jobId, recruiterId, updateData) => {
  return await Job.findOneAndUpdate(
    { _id: jobId, recruiter: recruiterId },
    updateData,
    { new: true }
  );
};

export const deleteJobRepo = async (jobId, recruiterId) => {
  return await Job.findOneAndDelete({ _id: jobId, recruiter: recruiterId });
};

export const findAllJobsRepo = async () => {
  return await Job.find();
};
