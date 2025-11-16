import express from "express";

// Import controller functions
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  sendOtp,
  verifyEmail, // new function
} from "../controllers/auth.controller.js";

const router = express.Router();

// --- Define Authentication Routes ---

// @route   POST /api/auth/register
// @desc    Register (sign up) a new user
// @access  Public
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate (log in) a user and get a token
// @access  Public
router.post("/login", loginUser);

// @route   POST /api/auth/send-otp
// @desc    Send an OTP to the user's email
// @access  Public
router.post("/send-otp", sendOtp);

// @route   POST /api/auth/forgot-password
// @desc    Request a password reset (e.g., send OTP or a reset link)
// @access  Public
router.post("/forgot-password", forgotPassword);

// @route   POST /api/auth/reset-password
// @desc    Reset the user's password using a token or OTP
// @access  Public
router.post("/reset-password", resetPassword);

// --- New Route for Email Verification ---
// @route   GET /api/auth/verify-email?token=xxx
// @desc    Verify user's email
// @access  Public
router.get("/verify-email", verifyEmail);

export default router;
