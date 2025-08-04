import { FormResponse } from "../models/formResponse.model.js";
import { FormTemplate } from "../models/formTemplate.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
const submitResponse = asyncHandler(async (req, res) => {
  const { templateId } = req.params;
  const { responses } = req.body;
  const userId = req.user?._id;

  if (!templateId) {
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
const getResponsesForSociety = asyncHandler(async (req, res) => {
  const { societyId } = req.params;

  if (!societyId) {
    throw new ApiError(400, "Society ID is required");
  }

  // Verify the requesting user is admin of this society
  const society = await Society.findById(societyId);
  if (!society) {
    throw new ApiError(404, "Society not found");
  }

  if (!society.admins.includes(req.user._id)) {
    throw new ApiError(403, "Unauthorized - Not an admin of this society");
  }

  // Get all responses for this society with populated user and template data
  const responses = await FormResponse.find({ society: societyId })
    .populate({
      path: "submittedBy",
      select: "username email firstName lastName", // Only include necessary user fields
    })
    .populate({
      path: "template",
      select: "title description", // Only include necessary template fields
    })
    .sort({ createdAt: -1 }); // Newest first

  return res
    .status(200)
    .json(new ApiResponse(200, responses, "Responses retrieved successfully"));
});

const getResponsesForTemplate = asyncHandler(async (req, res) => {
  const { templateId } = req.params;

  if (!templateId) {
    throw new ApiError(400, "Template ID is required");
  }

  // Verify the requesting user is admin of the society that owns this template
  const template = await FormTemplate.findById(templateId);
  if (!template) {
    throw new ApiError(404, "Template not found");
  }

  const society = await Society.findById(template.society);
  if (!society.admins.includes(req.user._id)) {
    throw new ApiError(403, "Unauthorized - Not an admin of this society");
  }

  // Get all responses for this template with populated user data
  const responses = await FormResponse.find({ template: templateId })
    .populate({
      path: "submittedBy",
      select: "username email firstName lastName",
    })
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        responses,
        "Template responses retrieved successfully"
      )
    );
});

const exportResponsesToCSV = asyncHandler(async (req, res) => {
  const { templateId } = req.params;

  if (!templateId) {
    throw new ApiError(400, "Template ID is required");
  }

  // Verify the requesting user is admin of the society that owns this template
  const template = await FormTemplate.findById(templateId).populate("fields");
  if (!template) {
    throw new ApiError(404, "Template not found");
  }

  const society = await Society.findById(template.society);
  if (!society.admins.includes(req.user._id)) {
    throw new ApiError(403, "Unauthorized - Not an admin of this society");
  }

  // Get all responses for this template with populated user data
  const responses = await FormResponse.find({ template: templateId }).populate({
    path: "submittedBy",
    select: "username email firstName lastName",
  });

  // Prepare CSV data
  const headers = [
    "Response ID",
    "Submitted At",
    "Submitted By (Username)",
    "Submitted By (Email)",
    "Submitted By (Name)",
    ...template.fields.map((field) => field.label),
  ];

  const rows = responses.map((response) => {
    const baseData = [
      response._id,
      response.createdAt.toISOString(),
      response.submittedBy?.username || "",
      response.submittedBy?.email || "",
      `${response.submittedBy?.firstName || ""} ${
        response.submittedBy?.lastName || ""
      }`.trim(),
    ];

    const fieldValues = template.fields.map((field) => {
      const fieldResponse = response.responses.find((r) =>
        r.fieldId.equals(field._id)
      );
      return fieldResponse ? fieldResponse.value : "";
    });

    return [...baseData, ...fieldValues];
  });

  // Convert to CSV
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((item) =>
          typeof item === "string" ? `"${item.replace(/"/g, '""')}"` : item
        )
        .join(",")
    ),
  ].join("\n");

  // Set response headers for file download
  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${template.title.replace(/\s+/g, "_")}_responses_${
      new Date().toISOString().split("T")[0]
    }.csv`
  );

  return res.status(200).send(csvContent);
});

export {
  submitResponse,
  getResponsesForSociety,
  getResponsesForTemplate,
  exportResponsesToCSV,
};
