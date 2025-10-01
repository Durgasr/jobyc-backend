import express from "express";
import {
  createNewUser,
  getUserDetails,
  userLogin,
} from "../controller/user.controller.js";
import { isAuthenticated } from "../../../middlewares/auth.js";
import upload from "../../../middlewares/fileUpload.js";

const router = express.Router();

router.route("/register").post(upload.single("resume"), createNewUser);
router.route("/login").post(userLogin);
router.route("/me").get(isAuthenticated, getUserDetails);

export default router;
