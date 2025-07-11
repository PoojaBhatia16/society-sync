import { FormTemplate } from "../models/formTemplate.models.js";
import { User } from "../models/user.models.js";
import { Society } from "../models/society.models.js"; // Add this import
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"; // Add this import
import { asyncHandler } from "../utils/asyncHandler.js";

const createFormTemplate = asyncHandler(async (req, res) => {
  const { title, description, fields } = req.body;
  const userId = req.user._id;

  
  if (!title || !fields) {
    throw new ApiError(400, "Title and fields are required");
  }

  if (!Array.isArray(fields) || fields.length === 0) {
    throw new ApiError(400, "Fields array cannot be empty");
  }

  
  const validFieldTypes = [
    "text",
    "number",
    "email",
    "textarea",
    "select",
    "checkbox",
    "radio",
  ];

  for (const field of fields) {
    if (!validFieldTypes.includes(field.fieldType)) {
      throw new ApiError(400, `Invalid field type: ${field.fieldType}`);
    }

    if (!field.label) {
      throw new ApiError(400, "All fields must have a label");
    }

    if (["select", "checkbox", "radio"].includes(field.fieldType)) {
      if (!field.options || !Array.isArray(field.options)) {
        throw new ApiError(
          400,
          `${field.fieldType} fields require an options array`
        );
      }
      if (field.options.length === 0) {
        throw new ApiError(
          400,
          `${field.fieldType} fields must have at least one option`
        );
      }
    }
  }

  
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const societyId = user.adminOf;
  if (!societyId) {
    throw new ApiError(403, "User is not an admin of any society");
  }

  const society = await Society.findById(societyId);
  if (!society) {
    throw new ApiError(404, "Society not found");
  }

  
  const formTemplate = await FormTemplate.create({
    title,
    description: description || "",
    fields,
    society: societyId,
    createdBy: userId,
  });

  
  return res
    .status(201)
    .json(
      new ApiResponse(201, formTemplate, "Form template created successfully")
    );
});

export { createFormTemplate };
