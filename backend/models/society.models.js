import mongoose from "mongoose";

const societySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    logo: { type: String,  },
    email: { type: String, required: true },
    instagram: { type: String },
    isRecruitmentOpen: { type: Boolean, default: false },
    recurringEvents: [{ type: String }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Society = mongoose.model("Society", societySchema);

