import mongoose from "mongoose";

const formFieldSchema = new mongoose.Schema({
  fieldType: {
    type: String,
    enum: [
      "text",
      "number",
      "email",
      "textarea",
      "select",
      "checkbox",
      "radio",
      "file",
    ],
    required: true,
  },
  label: { type: String, required: true },
  placeholder: { type: String },
  options: [{ type: String }], // For select, radio, checkbox
  required: { type: Boolean, default: false },
  validation: {
    min: { type: Number },
    max: { type: Number },
    pattern: { type: String },
  },
});

const formTemplateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    fields: [formFieldSchema],
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const FormTemplate = mongoose.model("FormTemplate", formTemplateSchema);
