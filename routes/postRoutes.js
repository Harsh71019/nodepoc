const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
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
} = require("../controllers/postController");
const { validatePost } = require("../validators/postValidator");

router
  .route("/")
  .post(validatePost, protect, createPost)
  .get(protect, getAllPost)
 

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

module.exports = router;
