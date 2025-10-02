import { createNewUserRepo, findUserRepo } from "../models/user.repository.js";
import { sendToken } from "../../../utils/sendToken.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";

export const createNewUser = async (req, res, next) => {
  try {
    const userData = { ...req.body };

    // ✅ If jobseeker, add resume path from multer
    if (userData.role === "jobseeker" && req.file) {
      userData.resumeUrl = req.file.path.replace(/\\/g, "/");
    }

    const newUser = await createNewUserRepo(userData);
    await sendToken(newUser, res, 200);
  } catch (err) {
    if (err.code === 11000) {
      return next(new ErrorHandler(400, "Email already registered"));
    } else {
      return next(new ErrorHandler(500, err.message));
    }
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler(400, "Please enter email.password"));
    }
    const user = await findUserRepo({ email }, true);
    if (!user) {
      return next(
        new ErrorHandler(401, "user not found! register yourself now!!")
      );
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return next(
        new ErrorHandler(401, "Incorrect password, please try again.")
      );
    }
    await sendToken(user, res, 200);
  } catch (err) {
    return next(new ErrorHandler(400, err));
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    console.log(req.user);
    const userDetails = await findUserRepo({ _id: req.user.id });
    res.status(200).json({ success: true, user: userDetails });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};

export const logoutUser = async (req, res) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .json({ success: true, msg: "logout successful" });
};
