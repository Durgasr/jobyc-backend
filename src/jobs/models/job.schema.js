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
      enum: [
        "HR",
        "SDE",
        "DevOps",
        "MERN Developer",
        "MEAN Developer",
        "Front-End Developer",
        "Back-End Developer",
        "Full-Stack Developer",
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
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
    applyBy: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
