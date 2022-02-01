import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import { userPayload } from "../types/user";

const protect = asyncHandler(async (req, res, next) => {
  let token: string;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    try {
      token = req?.headers?.authorization?.split(" ")[1];

      if (!token) {
        res.status(401);
        throw new Error("Not authorized no token");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
       // @ts-ignore
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized token failed");
    }
  }
});

export default protect;