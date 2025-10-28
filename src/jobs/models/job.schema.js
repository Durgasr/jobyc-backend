import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Tech", "Non Tech"],
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    minimumExperienceRequired: {
      type: Number,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    totalPositions: {
      type: Number,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
