import express from "express";
import { IsAuthenticated } from "../utils/isAuthenticated.js";
import {
  AddCommentOnPost,
  AddnewPost,
  Bookmarks,
  DeletePost,
  DislikePost,
  GetAllPost,
  GetCommentOnPost,
  LikePost,
  UserPost,
} from "../controllers/postController.js";
import upload from "../midleware/multer.js";

let router = express.Router();

router
  .route("/createPost")
  .post(IsAuthenticated, upload.single("image"), AddnewPost);

router.route("/getAllpost").get(IsAuthenticated, GetAllPost);
router.route("/userPost").get(IsAuthenticated, UserPost);
router.route("/likePost/:id").patch(IsAuthenticated, LikePost);
router.route("/dislikePost/:id").patch(IsAuthenticated, DislikePost);
router.route("/commentCreate/:id").post(IsAuthenticated, AddCommentOnPost);
router.route("/commentsOfPost/:id").get(IsAuthenticated, GetCommentOnPost);
router.route("/deletePost/:id").delete(IsAuthenticated, DeletePost);
router.route("/bookmarks/:id").patch(IsAuthenticated, Bookmarks);

export default router;
