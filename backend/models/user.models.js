import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "admin", "superadmin"],
      default: "student",
    },
    avatar: {
      type: String,
      default: "https://i.ibb.co/2yZ6YkN/default-avatar.png", // fallback avatar
    },
    refreshToken: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: function () {
        return this.role !== "admin"; // admin needs manual approval
      },
    },
    pendingSociety: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
    },
    adminOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
    },
  },

  { timestamps: true }
);



userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    //console.log("Password not modified, skipping hashing");
    
    return next();
  }
  // console.log("Hashing password for user:", this.email);
  
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
} 

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      role: this.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
    }
  );
};


export const User = mongoose.model("User", userSchema);
