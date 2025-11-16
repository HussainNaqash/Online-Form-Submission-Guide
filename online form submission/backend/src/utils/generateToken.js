import jwt from "jsonwebtoken";

/**
 * Generates a JSON Web Token (JWT) for a user.
 * @param {string} id - MongoDB User ID
 * @returns {string} - Signed JWT token
 */
const generateToken = (id) => {
  // Check if secret exists
  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT Error: JWT_SECRET is missing in .env file");
    throw new Error("JWT secret is missing");
  }

  // Create and return token (expires in 30 days)
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default generateToken;
