import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
  let token: string;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    try {
      token = req?.headers?.authorization?.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // @ts-ignore
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized token failed");
    }
  }

  // @ts-ignore
  if (!token) {
    res.status(401);
    throw new Error("Not authorized no token");
  }
});

export default protect;
