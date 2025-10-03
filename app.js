import express from "express";
import dotenv from "dotenv";
import userRoutes from "./src/user/routes/user.routes.js";
import jobsRouter from "./src/jobs/routes/job.routes.js";
import applicationsRouter from "./src/jobApplications/routes/jobApplication.routes.js";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware.js";

const configPath = path.resolve("config", ".env");
dotenv.config({ path: configPath });

const app = express();

app.use(
  cors({
    origin:
      "https://68dfece99a63001c4bbc5d70--hilarious-ganache-cfadcc.netlify.app/",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/jobyc/user", userRoutes);
app.use("/api/jobyc/jobs", jobsRouter);
app.use("/api/jobyc/applications", applicationsRouter);

app.use(errorHandlerMiddleware);

export default app;
