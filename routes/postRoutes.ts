import express from "express";
import protect from "../middleware/authMiddleware";
import {
  createPost,
  getAllPost,
  getPostsDetails,
  updatePostDetails,
  deletePost,
  createComment,
  getCommentByPost,
  getCommentDetails,
  deleteComments,
  updateComments,
} from "../controllers/postController";
import { validatePost } from "../validators/postValidator";
const router = express.Router();

router
  .route("/")
  .post(validatePost, protect, createPost)
  .get(protect, getAllPost);

router
  .route("/:id")
  .get(protect, getPostsDetails)
  .delete(protect, deletePost)
  .post(protect, updatePostDetails);

router
  .route("/:id/comments")
  .post(protect, createComment)
  .get(protect, getCommentByPost);

router
  .route("/:id/comments/:comment_id")
  .get(protect, getCommentDetails)
  .delete(protect, deleteComments)
  .patch(protect, updateComments);

export default router;
