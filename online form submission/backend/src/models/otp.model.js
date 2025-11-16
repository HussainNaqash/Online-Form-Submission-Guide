import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    // Set the expiration time to 10 minutes from creation
    default: () => Date.now() + 10 * 60 * 1000, // 10 minutes in milliseconds
  },
});

// --- Mongoose Index ---
// This automatically deletes the document from MongoDB after the 'expiresAt' time is reached.
// This is a powerful feature that keeps our database clean without any extra code.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// --- Mongoose Middleware ---
// Hash the OTP before saving it, just like we hash passwords.
// This prevents someone with database access from seeing valid OTPs.
otpSchema.pre("save", async function (next) {
  if (!this.isModified("otp")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compares an entered OTP with the hashed OTP in the database.
 * @param {string} enteredOtp - The plain text OTP from the user.
 * @returns {Promise<boolean>} - True if the OTPs match, false otherwise.
 */
otpSchema.methods.matchOtp = async function (enteredOtp) {
  return await bcrypt.compare(enteredOtp, this.otp);
};

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;
