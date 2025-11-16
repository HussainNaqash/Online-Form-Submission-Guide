import crypto from "crypto";
import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import generateToken from "../utils/generateToken.js";
import {
  sendOtpEmail,
  sendVerificationEmail,
} from "../services/email.service.js";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please enter all fields",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const user = await User.create({
      username,
      email,
      password,
      emailVerified: false,
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString("hex");
    user.emailVerificationToken = verificationToken;
    user.emailVerificationTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send verification email with button
    await sendVerificationEmail(email, verificationToken);

    return res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please check your email to verify your account.",
      data: { _id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

/**
 * @desc    Verify user's email
 * @route   GET /api/auth/verify-email?token=xxx
 * @access  Public
 */
export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) return res.status(400).send("Token is required");

  try {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).send("Invalid or expired token");

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;

    await user.save();

    // ✅ Redirect to frontend login page
    res.redirect(`http://localhost:8080/?verified=true`);
  } catch (error) {
    console.error("Verify Email Error:", error.message);
    res.status(500).send("Server error while verifying email");
  }
};

/**
 * @desc    Login a user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: { _id: user._id, username: user.username, email: user.email },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

/**
 * @desc    Send OTP to user's email (only if email verified)
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (!user.emailVerified)
      return res
        .status(403)
        .json({ success: false, message: "Please verify your email first" });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndDelete({ email });
    await Otp.create({ email, otp: otpCode });

    await sendOtpEmail(email, otpCode);

    return res
      .status(200)
      .json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("Send OTP Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send OTP" });
  }
};

/**
 * @desc    Forgot password (send OTP) only for verified emails
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (!user.emailVerified)
      return res
        .status(403)
        .json({ success: false, message: "Please verify your email first" });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndDelete({ email });
    await Otp.create({ email, otp: otpCode });

    await sendOtpEmail(email, otpCode);

    return res
      .status(200)
      .json({ success: true, message: "OTP sent for password reset" });
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to process forgot password" });
  }
};

/**
 * @desc    Reset password using OTP (only for verified emails)
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;
    if (!email || !otp || !newPassword || !confirmPassword)
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and both password fields are required",
      });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (!user.emailVerified)
      return res
        .status(403)
        .json({ success: false, message: "Please verify your email first" });

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord)
      return res
        .status(400)
        .json({ success: false, message: "OTP expired or not found" });

    const isOtpValid = await otpRecord.matchOtp(otp);
    if (!isOtpValid)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    user.password = newPassword; // hashed automatically
    await user.save();

    await Otp.deleteOne({ _id: otpRecord._id });

    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to reset password" });
  }
};
