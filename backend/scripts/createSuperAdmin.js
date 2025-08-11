// scripts/createSuperAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user.models.js";
import { DB_NAME } from "../constants.js";

dotenv.config({path: ".env"});

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(
          `${process.env.MONGODB_URI}/${DB_NAME}`);

    const existing = await User.findOne({ email: "superadmin@cms.com" });
    if (existing) {
      console.log("Superadmin already exists");
      process.exit(0);
    }
//hey
    const user = await User.create({
      name: "Super Admin",
      email: "superadmin@cms.com",
      password: "kadu123",
      role: "superadmin",
      isVerified: true,
    });

    console.log("Superadmin created:", user.email);
    process.exit(0);
  } catch (err) {
    console.error(" Error creating superadmin:", err);
    process.exit(1);
  }
};

createSuperAdmin();
