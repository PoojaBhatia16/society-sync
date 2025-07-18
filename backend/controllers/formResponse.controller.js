import { FormResponse} from "../models/formResponse.model.js";
import { FormTemplate } from "../models/formTemplate.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
const submitResponse = asyncHandler(async (req, res) => {
  const { templateId } = req.params;
  const { responses } = req.body;
  const userId = req.user?._id;

  if(!templateId)
  {
    throw new ApiError(400, "template_id needed");
  }
  if (!responses || !Array.isArray(responses)) {
    throw new ApiError(400, "Responses must be provided as an array");
  }

  
  const template = await FormTemplate.findById(templateId);
  if (!template) {
    throw new ApiError(404, "Template not found");
  }

  
  const formattedResponses = responses.map((response) => ({
    fieldId: new mongoose.Types.ObjectId(response.fieldId),
    value: response.value,
  }));

 
  const formResponse = new FormResponse({
    template: templateId,
    responses: formattedResponses,
    submittedBy: userId,
    society: template.society,
  });

  
  await formResponse.save();

  return res
    .status(201)
    .json(
      new ApiResponse(201, formResponse, "Form response submitted successfully")
    );
});
export{submitResponse};