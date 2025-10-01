import { Jobseeker, Recruiter } from "./user.schema.js";

export const createNewUserRepo = async (user) => {
  if (user.role === "jobseeker") {
    return await new Jobseeker(user).save();
  } else if (user.role === "recruiter") {
    return await new Recruiter(user).save();
  } else {
    throw new Error("Invalid role");
  }
};

export const findUserRepo = async (factor, withPassword = false) => {

  let user = withPassword
    ? await Recruiter.findOne(factor).select("+password")
    : await Recruiter.findOne(factor);

  if (!user) {
    user = withPassword
      ? await Jobseeker.findOne(factor).select("+password")
      : await Jobseeker.findOne(factor);
  }

  return user;
};