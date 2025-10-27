import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import validator from "validator";

const options = { discriminatorKey: "role", collection: "users" };

const baseUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "user name is required"],
      maxLength: [20, "user name can't exceed 20 characters"],
      minlength: [2, "name should have atleast 2 characters"],
    },
    email: {
      type: String,
      required: [true, "user email is required"],
      unique: true,
      validate: [validator.isEmail, "Please enter valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  options
);

// 🔑 Password hashing
baseUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 JWT
baseUserSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// 🔑 Compare Password
baseUserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🔑 Reset Password Token
baseUserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export const User = mongoose.model("User", baseUserSchema);

// Jobseeker schema
const jobseekerSchema = new mongoose.Schema({
  // Profile Info
  profileImage: String,
  title: String, // e.g., "Full Stack Developer"
  about: String,
  location: String,

  // Professional Info
  skills: [String],
  experience: [
    {
      company: String,
      position: String,
      startDate: String,
      endDate: String,
      description: String,
    },
  ],
  education: [
    {
      institution: String,
      degree: String,
      startYear: String,
      endYear: String,
    },
  ],
  projects: [
    {
      name: String,
      description: String,
      technologies: [String],
      link: String,
    },
  ],

  // Resume and Links
  resumeUrl: String,
  portfolioLink: String,
  github: String,
  linkedin: String,
  previousSalary: String,
  totalExperience : Number,

  // Progress
  profileCompleted: { type: Boolean, default: false },
  progress: { type: Number, default: 0 },
});

// Recruiter schema
const recruiterSchema = new mongoose.Schema({
  profileImage: String,
  company: String,
  position: String, // e.g., "HR Manager"
  website: String,
  companyDescription: String,
  companyLocation: String,
  companyLogo: String,
  contactNumber: String,
  linkedin: String,

  // Progress
  profileCompleted: { type: Boolean, default: false },
  progress: { type: Number, default: 0 },
});

export const Jobseeker = User.discriminator("jobseeker", jobseekerSchema);
export const Recruiter = User.discriminator("recruiter", recruiterSchema);
