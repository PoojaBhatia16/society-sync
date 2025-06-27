import mongoose from "mongoose";

const recruitmentSchema = new mongoose.Schema(
  {
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },
    isOpen: { type: Boolean, default: false },
    formLink: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

const Recruitment = mongoose.model("Recruitment", recruitmentSchema);
export default Recruitment;
