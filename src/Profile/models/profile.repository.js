import { User, Jobseeker, Recruiter } from "../../user/models/user.schema.js";

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  return await User.findById(userId);
};

/**
 * Update Jobseeker profile
 */
export const updateJobseekerProfile = async (userId, profileData) => {
  // Calculate progress
  const fields = [
    "profileImage",
    "title",
    "skills",
    "experience",
    "resumeUrl",
    "location",
  ];
  let filled = 0;
  fields.forEach((f) => {
    const value = profileData[f];
    if (Array.isArray(value)) {
      if (
        value.some((item) =>
          Object.values(item).some((v) => v && v.toString().trim() !== "")
        )
      )
        filled++;
    } else if (value && value.toString().trim() !== "") {
      filled++;
    }
  });
  profileData.progress = Math.round((filled / fields.length) * 100);
  profileData.profileCompleted = profileData.progress === 100;

  // Update user directly
  const updatedUser = await Jobseeker.findByIdAndUpdate(userId, profileData, {
    new: true, // return the updated document
  });

  if (!updatedUser) throw new Error("User not found");

  return updatedUser;
};

/**
 * Update Recruiter profile
 */
export const updateRecruiterProfile = async (userId, profileData) => {
  const recruiter = await Recruiter.findById(userId);
  if (!recruiter) throw new Error("Recruiter not found");

  Object.assign(recruiter, profileData);

  // Calculate progress
  const fields = [
    "profileImage",
    "company",
    "position",
    "website",
    "companyLocation",
  ];
  let filled = 0;
  fields.forEach((f) => {
    const value = profileData[f];
    if (value && value.toString().trim() !== "") filled++;
  });
  recruiter.progress = Math.round((filled / fields.length) * 100);
  recruiter.profileCompleted = recruiter.progress === 100;

  return await recruiter.save();
};


export const findRecruiterDetailsById = async(recruiterId)=>{
  return Recruiter.findById(recruiterId)
}