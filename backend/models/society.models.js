import mongoose, { Schema } from "mongoose";


const societySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    logo: {
      type: String, 
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", it
    },
  },
  { timestamps: true }
);

const Society = mongoose.model("Society", societySchema);
export default Society;
