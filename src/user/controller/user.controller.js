import crypto from "crypto";
import { createNewUserRepo, findUserRepo } from "../models/user.repository.js";
import { sendToken } from "../../../utils/sendToken.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";
import { User } from "../models/user.schema.js";
import resetPasswordEmail from "../../../utils/resetPasswordEmail.js";

// Register new user (Jobseeker / Recruiter)

export const createNewUser = async (req, res, next) => {
  try {
    const userData = { ...req.body };

    // If jobseeker, attach resume path from multer
    if (userData.role === "jobseeker" && req.file) {
      userData.resumeUrl = req.file.path.replace(/\\/g, "/");
    }

    const newUser = await createNewUserRepo(userData);
    await sendToken(newUser, res, 200);
  } catch (err) {
    if (err.code === 11000) {
      return next(new ErrorHandler(400, "Email already registered"));
    }
    return next(new ErrorHandler(500, err.message));
  }
};

// Login user
export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler(400, "Please enter email and password"));
    }

    const user = await findUserRepo({ email }, true); // fetch password
    if (!user) {
      return next(new ErrorHandler(401, "User not found! Register first."));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorHandler(401, "Incorrect password"));
    }

    await sendToken(user, res, 200);
  } catch (err) {
    return next(new ErrorHandler(500, err.message));
  }
};

// Get logged-in user details
export const getUserDetails = async (req, res, next) => {
  try {
    const user = await findUserRepo({ _id: req.user.id });
    if (!user) return next(new ErrorHandler(404, "User not found"));
    res.status(200).json({ success: true, user });
  } catch (err) {
    return next(new ErrorHandler(500, err.message));
  }
};

// Forgot Password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await findUserRepo({ email }, true); // get user with password
    if (!user) return next(new ErrorHandler(404, "User not found"));

    // Generate reset token
    // Cast to 'any' so VSCode type-checking doesn't complain
    const resetToken = user.getResetPasswordToken(); 
    await user.save({ validateBeforeSave: false });

    // Construct reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Email content
    const message = `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    // Send email
    await resetPasswordEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: message,
    });

    res.status(200).json({
      success: true,
      message: "Email sent with reset link",
    });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler(500, err.message));
  }
};

// Reset Password
 
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return next(new ErrorHandler(400, "Passwords do not match"));
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user)
      return next(new ErrorHandler(400, "Token is invalid or expired"));

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    return next(new ErrorHandler(500, err.message));
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
    .json({ success: true, message: "Logout successful" });
};
