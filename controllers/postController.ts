import asyncHandler from "express-async-handler";
import Post from "../models/postModel";
import User, { create } from "../models/userModel";
import {
  IGetUserAuthInfoRequest,
  PostInterface,
  CommentInterface,
} from "../types";
import { Response } from "express";
import { statusCodes } from "../constants/statusConstants";

const {
  success,
  created,
  unauthorized,
  notfound,
  doesnotexist,
  servererror,
  invalidtoken,
} = statusCodes;


const createPost = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const user = await User.findById(req?.user?._id);

    const { title, description } = req.body as PostInterface;

    const post = await Post.create({
      user: user._id,
      author: user.firstName,
      title,
      description,
    });

    if (post) {
      res.status(created).json({
        message: "Post created Successfully just checking",
      });
    } else {
      res.status(servererror);
      throw new Error("Error creating post");
    }
  }
);

/**
 * @swagger
 * /api/books:
 *  get:
 *      summary: To get all books from mongodb
 *      description: this api is used to fetch data from mongodb
 *      responses:
 *          200:
 *              description: this api is used to fetch data from mongodb
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Book'
 */

const getAllPost = asyncHandler(async (req, res) => {
  const posts = await Post.find();

  if (posts) {
    res.status(created).json({
      message: "Post fetched Successfully",
      posts: posts,
    });
  } else {
    res.status(servererror);
    throw new Error("Error fetching post");
  }
});

const getPostsDetails = asyncHandler(async (req, res) => {
  const post = await Post.findById(req?.params?.id as string);

  if (post) {
    res.status(success).json({
      message: "Post fetched Successfully",
      post: post,
    });
  } else {
    res.status(servererror);
    throw new Error("Error fetching post");
  }
});

const deletePost = asyncHandler(async (req: IGetUserAuthInfoRequest, res) => {
  const post = await Post.findById(req?.params?.id);
  if (!post) {
    res.status(notfound).json({ msg: "Post not found" });
  }

  //Check User
  if (post.user.toString() !== req?.user?._id.toString()) {
    res.status(unauthorized).json({ msg: "User not Authorized" });
  }

  await post.remove();
  res.json({ msg: "Post removed" });
});

const updatePostDetails = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res) => {
    const { title, description } = req.body as PostInterface;
    const post = await Post.findById(req?.params?.id);
    if (!post) {
      res.status(notfound).json({ msg: "Post not found" });
    }

    //Check User
    if (post.user.toString() !== req?.user?._id.toString()) {
      res.status(unauthorized).json({ msg: "User not Authorized" });
    }

    if (post) {
      post.title = title;
      post.description = description;
      await post.save();
      res.status(created).json({
        message: "Post updated Successfully",
        title: title,
        description: description,
      });
    }
  }
);

const createComment = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res) => {
    const post = await Post.findById(req?.params?.id);
    const user = await User.findById(req?.user?._id);

    if (post) {
      const newComment = new Post({
        description: req.body.description,
        author: user.firstName,
        user: req?.user?._id,
        post: req?.params?.id,
      });

      post.comments.unshift(newComment);

      await post.save();
      res.json(post.comments);
    } else {
      res.status(servererror);
      throw new Error("Error creating comment");
    }
  }
);

const getCommentDetails = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res) => {
    const post = await Post.findById(req?.params?.id);
    if (post) {
      const comment = post.comments.find(
        (comment: CommentInterface) => comment.id === req.params.comment_id
      );

      //Make sure comment exists
      if (!comment) {
        res.status(notfound).json({ msg: "Comment Does not exist!" });
      }
      res.status(success);
      res.json({
        message: "Got comment successfully",
        comment: comment,
      });
    }
  }
);

const getCommentByPost = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res) => {
    const post = await Post.findById(req?.params?.id);
    if (post) {
      const comments = post.comments;

      //Make sure comment exists
      if (!comments) {
        res.status(notfound).json({ msg: "Comment Does not exist!" });
      }
      res.status(success);
      res.json({
        message: "Got comment successfully",
        comments: comments,
      });
    }
  }
);

const deleteComments = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res) => {
    const post = await Post.findById(req?.params?.id);
    if (!post) {
      res.status(notfound).json({ msg: "Post not found" });
    }

    const comment = post.comments.find(
      (comment: CommentInterface) => comment.id === req.params.comment_id
    );

    if (comment) {
      if (comment.user.toString() !== req?.user?._id.toString()) {
        res.status(unauthorized).json({ msg: "User not Authorized" });
      }
      const removeIndex = post.comments
        .map((comment: CommentInterface) => comment.user.toString())
        .indexOf(req?.user?._id);
      post.comments.splice(removeIndex, 1);
      await post.save();
      res.json(post.comments);
      res.status(success).json({
        message: "Comment deleted Successfully",
        post: post.comments,
      });
    } else {
      res.status(notfound);
      throw new Error("Comment does not exist");
    }
  }
);

const updateComments = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res) => {
    const { description } = req.body;
    const post = await Post.findById(req?.params?.id);
    if (!post) {
      res.status(notfound).json({ msg: "Post not found" });
    }

    if (post) {
      const comment = post.comments.find(
        (comment: CommentInterface) => comment.id === req.params.comment_id
      );
      //Check User
      if (comment.user.toString() !== req?.user?._id.toString()) {
        res.status(unauthorized).json({ msg: "User not Authorized" });
      }
      comment.description = description;
      await post.save();
      res.status(created).json({
        message: "Comment updated Successfully",
        description: description,
      });
    }
  }
);

export {
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
};
