import { FormTemplate } from "../models/formTemplate.models.js";
import { User } from "../models/user.models.js";
import { Society } from "../models/society.models.js"; // Add this import
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"; // Add this import
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose"; // Ensure mongoose is imported

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

const getFormTemplateById=asyncHandler(async(req,res)=>{
   const formId = req.params.formId;
   if(!formId)
   {
    throw new ApiError(404, "Id not found");
   }
   const getForm=await FormTemplate.findById(formId);
   if(!getForm)
   {
    throw new ApiError(400, "Invalid Id");
   }
   return res
     .status(201)
     .json(
       new ApiResponse(201, getForm, "Form template fetched succesfully")
     );

})

const getFormTemplates = asyncHandler(async (req, res) => {
  
  const getForm = await FormTemplate.find();
  return res
    .status(201)
    .json(new ApiResponse(201, getForm, "All Form template fetched succesfully"));
});

const getFormTemplatesBySocietyId = asyncHandler(async (req, res) => {
 
  console.log("Fetching", req.params.societyId);
  const societyId = new mongoose.Types.ObjectId(req.params.societyId);

  if (!societyId) {
    throw new ApiError(400, "Society ID is required");
  }

  
  if (!mongoose.Types.ObjectId.isValid(societyId)) {
    throw new ApiError(400, "Invalid Society ID format");
  }

  try {
   
    const formTemplates = await FormTemplate.find({ society: societyId })
      .select("-__v") 
      .lean(); 

    if (!formTemplates || formTemplates.length === 0) {
      return res
        .status(200)
        .json(
          new ApiResponse(200, [], "No form templates found for this society")
        );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          formTemplates,
          "Form templates fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching form templates:", error);
    throw new ApiError(500, "Failed to fetch form templates");
  }
});
export { createFormTemplate,getFormTemplateById,getFormTemplates,getFormTemplatesBySocietyId };
