import { User } from "../models/user.model.ts";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import connectDB from "../config/db.ts";
import jwt from "jsonwebtoken";

const seedAdmin = async () => {
  try {
   await connectDB();
    console.log("Connected to MongoDB");

    const existingAdmin = await User.findOne({ email: "admin@admin.com" });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("password", 10);
      const admin = await User.create({
        email: "admin@admin.com",
        password: hashedPassword,
        role: "admin"
      });
      console.log("Admin user created successfully");

      // Generate access token for the admin
      const accessToken = jwt.sign(
        {
          _id: admin._id,
          email: admin.email,
          role: admin.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "10d"
        }
      );

      console.log("Admin Access Token:", accessToken);
    } else {
      console.log("Admin user already exists");

      const accessToken = jwt.sign(
        {
          _id: existingAdmin._id,
          email: existingAdmin.email,
          role: existingAdmin.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn:"10d"
        }
      );

      console.log("Admin Access Token:", accessToken);
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

seedAdmin();