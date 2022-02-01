import protect from "../middleware/authMiddleware";
import express from "express";
import { Router } from "express";
const router = express.Router();
import {
  registerUser,
  updateUser,
  loginUser,
  getUserProfile,
  logoutUser,
  deleteUser,
  logoutUserAllDevices,
} from "../controllers/userController";
import { validateUser } from "../validators/userValidator";

router
  .route("/")
  .get(protect, getUserProfile)
  .post(validateUser, registerUser)
  .patch(protect, validateUser, updateUser)
  .delete(protect, deleteUser);

router.route("/login").post(loginUser);
router.route("/logout").post(protect, logoutUser);
router.route("/logout-all-devices").post(protect, logoutUserAllDevices);

export default router;
