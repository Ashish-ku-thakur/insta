import express from "express";
import {
  EditUserProfile,
  FollowOrUnfollow,
  GetOtherUser,
  GetSelectedUserProfile,
  Login,
  Logout,
  Register,
} from "../controllers/userController.js";
import { IsAuthenticated } from "../utils/isAuthenticated.js";
import upload from "../midleware/multer.js";

let router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/logout").get(Logout);
router.route("/:id/profile").get(IsAuthenticated, GetSelectedUserProfile);
router
  .route("/editprofile")
  .post(IsAuthenticated, upload.single("profilePicture"), EditUserProfile); // without upload(multer mid) form-data nahi work karega
router.route("/otherUser").get(IsAuthenticated, GetOtherUser);
router.route("/followOrUnfollow/:id").patch(IsAuthenticated, FollowOrUnfollow);

export default router;
