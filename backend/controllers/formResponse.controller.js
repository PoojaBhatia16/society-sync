import { FormResponse } from "../models/formResponse.model.js";
import { FormTemplate } from "../models/formTemplate.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Society } from "../models/society.models.js"; 
import { ApiResponse } from "../utils/ApiResponse.js";
import ExcelJS from "exceljs";
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
  console.log("Fetching responses for template:", templateId); // Add this

  if (!templateId) {
    throw new ApiError(400, "Template ID is required");
  }

  const template = await FormTemplate.findById(templateId);
  console.log("Found template:", template); // Add this
  if (!template) {
    throw new ApiError(404, "Template not found");
  }

  const society = await Society.findById(template.society);
  console.log("Found society:", society); // Add this
  if (!society.admin.equals(req?.user._id)) {
    throw new ApiError(403, "Unauthorized - Not an admin of this society");
  }

  const responses = await FormResponse.find({ template: templateId })
    .populate({
      path: "submittedBy",
      select: "username email firstName lastName",
    })
    .populate({
      path: "template",
      select: "title description fields", // Make sure fields are included
    })
    .sort({ createdAt: -1 });

  // Add template fields to each response for easier frontend processing
  const responsesWithTemplate = responses.map((r) => ({
    ...r.toObject(),
    templateDoc: template, // Include full template data
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        responsesWithTemplate,
        "Template responses retrieved successfully"
      )
    );
});


// CSV Export
const exportResponsesToCSV = asyncHandler(async (req, res) => {
  const { templateId } = req.params;

  // Verify permissions (same as before)
  const template = await FormTemplate.findById(templateId).populate("fields");
  if (!template) throw new ApiError(404, "Template not found");

  const society = await Society.findById(template.society);
  if (!society.admin.equals(req.user._id))
    throw new ApiError(403, "Unauthorized");

  const responses = await FormResponse.find({ template: templateId }).populate(
    "submittedBy",
    "email firstName lastName"
  );

  // CSV Headers
  const headers = [
    "Response ID",
    "Submitted At",
    "Email",
    "Name",
    ...template.fields.map((f) => f.label),
  ];

  // CSV Rows
  const rows = responses.map((response) => {
    const baseData = [
      response._id,
      response.createdAt.toISOString(),
      response.submittedBy?.email || "",
      `${response.submittedBy?.firstName || ""} ${
        response.submittedBy?.lastName || ""
      }`.trim(),
    ];

    const fieldValues = template.fields.map((field) => {
      const fieldResponse = response.responses.find(
        (r) => r.fieldId.toString() === field._id.toString()
      );
      // Escape quotes in CSV values
      return `"${(fieldResponse?.value || "").toString().replace(/"/g, '""')}"`;
    });

    return [...baseData, ...fieldValues];
  });

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${template.title.replace(
      /[^\w]/g,
      "_"
    )}_responses.csv`
  );
  res.send(csvContent);
});

// Excel Export
const exportResponsesToExcel = asyncHandler(async (req, res) => {
  const { templateId } = req.params;

  // Same permission checks
  const template = await FormTemplate.findById(templateId).populate("fields");
  if (!template) throw new ApiError(404, "Template not found");

  const society = await Society.findById(template.society);
  if (!society.admin.equals(req.user._id))
    throw new ApiError(403, "Unauthorized");

  const responses = await FormResponse.find({ template: templateId }).populate(
    "submittedBy",
    "email firstName lastName"
  );

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Responses");

  // Excel Headers
  worksheet.columns = [
    { header: "Response ID", key: "id", width: 20 },
    { header: "Submitted At", key: "createdAt", width: 20 },
    { header: "Email", key: "email", width: 25 },
    { header: "Name", key: "name", width: 25 },
    ...template.fields.map((field) => ({
      header: field.label,
      key: field._id.toString(),
      width: 20,
    })),
  ];

  // Excel Rows
  responses.forEach((response) => {
    const rowData = {
      id: response._id.toString(),
      createdAt: response.createdAt.toISOString(),
      email: response.submittedBy?.email || "",
      name: `${response.submittedBy?.firstName || ""} ${
        response.submittedBy?.lastName || ""
      }`.trim(),
    };

    template.fields.forEach((field) => {
      const fieldResponse = response.responses.find(
        (r) => r.fieldId.toString() === field._id.toString()
      );
      rowData[field._id.toString()] = fieldResponse?.value || "";
    });

    worksheet.addRow(rowData);
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${template.title.replace(
      /[^\w]/g,
      "_"
    )}_responses.xlsx`
  );

  await workbook.xlsx.write(res);
  res.end();
});

export {
  submitResponse,
  getResponsesForSociety,
  getResponsesForTemplate,
  exportResponsesToCSV,
  exportResponsesToExcel,
};
