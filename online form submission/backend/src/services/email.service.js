import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

/**
 * Sends an email using Nodemailer.
 * @param {string} to - Recipient's email address
 * @param {string} subject - Email subject
 * @param {string} htmlBody - HTML content of the email
 */
export const sendEmail = async (to, subject, htmlBody) => {
  try {
    // --- Create transporter ---
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT || "587", 10),
      secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // --- Email options ---
    const mailOptions = {
      from: `"Online Form Guide" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlBody,
    };

    // --- Send email ---
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};

/**
 * Sends OTP email for password reset or verification.
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP code
 */
export const sendOtpEmail = async (email, otp) => {
  const subject = "Your Password Reset OTP";
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Use the following One-Time Password (OTP) to proceed:</p>
      <h3 style="font-size: 24px; letter-spacing: 3px; background-color: #f4f4f4; padding: 10px 20px; display: inline-block; border-radius: 5px;">
        ${otp}
      </h3>
      <p>This OTP is valid for <strong>10 minutes</strong>.</p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;

  await sendEmail(email, subject, htmlBody);
};

/**
 * Sends email verification email with a clickable button.
 * @param {string} email - Recipient email
 * @param {string} token - Email verification token
 */
export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `http://localhost:8000/api/auth/verify-email?token=${token}`;
  const subject = "Verify Your Email for Online Form Guide";
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center;">
      <h2>Welcome to Online Form Guide!</h2>
      <p>Please verify your email by clicking the button below:</p>
      <a href="${verificationUrl}" 
         style="display: inline-block; padding: 12px 24px; margin-top: 10px;
                background-color: #4f46e5; color: white; text-decoration: none;
                border-radius: 6px; font-weight: bold;">
        Verify Email
      </a>
      <p style="margin-top: 15px; font-size: 12px; color: #555;">
        If the button doesn't work, copy & paste this URL into your browser:<br/>
        ${verificationUrl}
      </p>
    </div>
  `;

  await sendEmail(email, subject, htmlBody);
};
