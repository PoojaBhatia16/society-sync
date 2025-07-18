import mongoose from "mongoose";
import { FormTemplate } from "./formTemplate.models.js";
const fieldResponseSchema = new mongoose.Schema(
  {
    fieldId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "FormTemplate.fields", // Reference to the fields in FormTemplate
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: function () {
        // Only require value if the field is marked as required in the template
        return (
          this.parent().templateDoc?.fields.id(this.fieldId)?.required || false
        );
      },
    },
  },
  { _id: false }
);

const formResponseSchema = new mongoose.Schema(
  {
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormTemplate",
      required: true,
    },
    responses: [fieldResponseSchema],
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },
    // Adding virtual populate for template data
    templateDoc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormTemplate",
      justOne: true,
      localField: "template",
      foreignField: "_id",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add validation for field types
formResponseSchema.pre("validate", async function (next) {
  if (!this.templateDoc) {
    this.templateDoc = await FormTemplate.findById(this.template);
  }

  for (const response of this.responses) {
    const field = this.templateDoc.fields.id(response.fieldId);
    if (!field) {
      throw new Error(`Field ${response.fieldId} not found in template`);
    }

    
    switch (field.fieldType) {
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(response.value)) {
          throw new Error(`Invalid email format for field ${field.label}`);
        }
        break;
      case "number":
        if (isNaN(response.value)) {
          throw new Error(`Field ${field.label} must be a number`);
        }
        if (field.validation?.min && response.value < field.validation.min) {
          throw new Error(
            `Field ${field.label} must be at least ${field.validation.min}`
          );
        }
        if (field.validation?.max && response.value > field.validation.max) {
          throw new Error(
            `Field ${field.label} must be at most ${field.validation.max}`
          );
        }
        break;
      
    }
  }

  next();
});

export const FormResponse = mongoose.model("FormResponse", formResponseSchema);
