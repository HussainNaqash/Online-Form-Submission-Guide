import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
  try {
    // Get the MongoDB connection string from environment variables
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error(
        "MongoDB connection error: MONGO_URI is not defined in your .env file"
      );
      process.exit(1); // Exit the process with failure
    }

    // Attempt to connect to the database
    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
