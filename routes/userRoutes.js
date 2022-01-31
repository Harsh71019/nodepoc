const express = require("express");
const { Router } = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  registerUser,
  updateUser,
  loginUser,
  getUserProfile,
  logoutUser,
  deleteUser,
  logoutUserAllDevices
} = require("../controllers/userController");
const { validateUser } = require("../validators/userValidator");

router
  .route("/")
  .get(protect, getUserProfile)
  .post(validateUser, registerUser)
  .patch(protect, validateUser, updateUser)
  .delete(protect, deleteUser);

router.route("/login").post(loginUser);
router.route("/logout").post(protect, logoutUser);
router.route("/logout-all-devices").post(protect, logoutUserAllDevices);

module.exports = router;
