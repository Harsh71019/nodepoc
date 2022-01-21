const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");

//Description : Register a new user
//Route name :  POST /api/v1/user
//Access Level : Public

/**
 * @swagger 
 * /api/v1/user:  
 *  post:
 *      summary: Api to register user
 *      description: Take email and password name etc
 *      response:
 *         200:
 *              description: To post a user 
 */

exports.registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, dob, email, mobile, password } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    firstName,
    lastName,
    dob,
    email,
    mobile,
    password,
  });

  if (user) {
    const token = generateToken(user._id);
    user.token.push(token);
    await user.save();
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      dob: user.dob,
      email: user.email,
      mobile: user.mobile,
      token: token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//Description : Update a new user
//Route name :  PATCH /api/v1/user
//Access Level : Private

exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.dob = req.body.dob || user.dob;
    user.email = req.body.email || user.email;
    user.mobile = req.body.mobile || user.mobile;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    const token = generateToken(updatedUser._id);
    user.token = token;
    await user.save();
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      dob: user.dob,
      email: user.email,
      mobile: user.mobile,
      token: token,
    });
  } else {
    res.status(401);
    throw new Error("User not found");
  }
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPasswords(password))) {
    const token = generateToken(user._id);
    user.token = token;
    await user.save();
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      dob: user.dob,
      email: user.email,
      mobile: user.mobile,
      token: token,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      dob: user.dob,
      email: user.email,
      mobile: user.mobile,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("User not found");
  }
});

exports.logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.token = [];
    await user.save();
    res.json({
      message: "Logged out successfully",
    });
  } else {
    res.status(401);
    throw new Error("User not found");
  }
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const post = await Post.find();
  try {
    // Match with username and pull to remove
    await Post.deleteMany(
      { user: req.user._id },
      { $pull: { post: req.user._id } }
      // You don't need an error callback here since you are
      // using async/await. Handle the error in the catch block.
    );
    await Post.deleteMany({ _id: req.user._id });
    res.json({
      message: "deleted successfully",
    });
  } catch (error) {
    // This is where you handle the error
    res.status(500).send(error);
  }
  // await user.remove();
});
