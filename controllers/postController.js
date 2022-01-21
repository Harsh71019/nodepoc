const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const User = require("../models/userModel");

exports.createPost = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const { title, description } = req.body;

  const post = await Post.create({
    user: user._id,
    author: user.firstName,
    title,
    description,
  });

  if (post) {
    res.status(201).json({
      message: "Post created Successfully",
    });
  } else {
    res.status(500);
    throw new Error("Error creating post");
  }
});

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

exports.getAllPost = asyncHandler(async (req, res) => {
  const posts = await Post.find();

  if (posts) {
    res.status(201).json({
      message: "Post fetched Successfully",
      posts: posts,
    });
  } else {
    res.status(500);
    throw new Error("Error fetching post");
  }
});

exports.getPostsDetails = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    res.status(201).json({
      message: "Post fetched Successfully",
      post: post,
    });
  } else {
    res.status(500);
    throw new Error("Error fetching post");
  }
});

exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ msg: "Post not found" });
  }

  //Check User
  if (post.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ msg: "User not Authorized" });
  }

  await post.remove();
  res.json({ msg: "Post removed" });
});

exports.updatePostDetails = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ msg: "Post not found" });
  }

  //Check User
  if (post.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ msg: "User not Authorized" });
  }

  if (post) {
    post.title = title;
    post.description = description;
    await post.save();
    res.status(201).json({
      message: "Post updated Successfully",
      title: title,
      description: description,
    });
  }
});

exports.createComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  const user = await User.findById(req.user._id);

  if (post) {
    const newComment = new Post({
      description: req.body.description,
      author: user.firstName,
      user: req.user._id,
      post: req.params.id,
    });

    post.comments.unshift(newComment);

    await post.save();
    res.json(post.comments);
  } else {
    res.status(500);
    throw new Error("Error creating comment");
  }
});

exports.getCommentDetails = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    //Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment Does not exist!" });
    }
    res.status(201);
    res.json({
      message: "Got comment successfully",
      comment: comment,
    });
  }
});

exports.getCommentByPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    const comments = post.comments;

    //Make sure comment exists
    if (!comments) {
      return res.status(404).json({ msg: "Comment Does not exist!" });
    }
    res.status(201);
    res.json({
      message: "Got comment successfully",
      comments: comments,
    });
  }
});

exports.deleteComments = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ msg: "Post not found" });
  }

  const comment = post.comments.find(
    (comment) => comment.id === req.params.comment_id
  );

  if (comment) {
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: "User not Authorized" });
    }
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user._id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
    res.status(201).json({
      message: "Comment deleted Successfully",
      post: post.comments,
    });
  } else {
    res.status(404);
    throw new Error("Comment does not exist");
  }
});

exports.updateComments = asyncHandler(async (req, res) => {
  const { description } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ msg: "Post not found" });
  }

  if (post) {
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    //Check User
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: "User not Authorized" });
    }
    comment.description = description;
    await post.save();
    res.status(201).json({
      message: "Comment updated Successfully",
      description: description,
    });
  }
});
