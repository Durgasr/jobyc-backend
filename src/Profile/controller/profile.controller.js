import {
  updateJobseekerProfile,
  updateRecruiterProfile,
  getUserById,
} from "../models/profile.repository.js";


/**
 * GET /api/me
 * Returns logged-in user
 */
export const getLoggedInUser = async (req, res) => {
  try {
    const userId = req.user._id; // assuming middleware decoded JWT and set req.user
    const user = await getUserById(userId);
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/profile/setup
 * Handles Jobseeker / Recruiter profile setup
 */

export const setupProfile = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const role = req.user.role; // "jobseeker" or "recruiter"

    const profileData = { ...req.body };

    if (profileData.experience && typeof profileData.experience === "string") {
      profileData.experience = JSON.parse(profileData.experience);
    }
    if (profileData.education && typeof profileData.education === "string") {
      profileData.education = JSON.parse(profileData.education);
    }
    if (profileData.projects && typeof profileData.projects === "string") {
      profileData.projects = JSON.parse(profileData.projects);
    }

    // Handle Multer files
    if (req.files) {
      // Resume
      if (req.files?.resume && req.files.resume[0]) {
        profileData.resumeUrl = `/uploads/resumes/${req.files.resume[0].filename}`;
      }

      // Profile Image
      if (req.files?.profileImage && req.files.profileImage[0]) {
        profileData.profileImage = `/uploads/profileImages/${req.files.profileImage[0].filename}`;
      }
    }

    let updatedUser;
    if (role === "jobseeker") {
      updatedUser = await updateJobseekerProfile(userId, profileData);
    } else if (role === "recruiter") {
      updatedUser = await updateRecruiterProfile(userId, profileData);
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile" });
  }
};
