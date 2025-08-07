import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Removed "/response" as it's likely part of your routes
  withCredentials: true,
});

export const submitResponse = async ({ templateId, responses }) => {
  try {
    // Convert responses to proper format
    const formattedResponses = Array.isArray(responses)
      ? responses
      : Object.entries(responses).map(([fieldId, value]) => ({
          fieldId,
          value: value instanceof File ? value.name : value,
        }));

    // Fixed the endpoint URL - removed the colon before templateId
    const response = await api.post(
      `/response/submit/${templateId}`, // Changed from `/submit/:${templateId}`
      { responses: formattedResponses },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Submission error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to submit form response"
    );
  }
};

export const getResponsesForSociety = async (societyId) => {
  const response = await api.get(`/response/society/${societyId}`); // Changed from `/form-responses/...`
  return response.data;
};

export const getResponsesForTemplate = async (templateId) => {
  const response = await api.get(`/response/template/${templateId}`); // Changed from `/form-responses/...`
  return response.data;
};

export const exportResponsesToCSV = async (templateId) => {
  const response = await api.get(`/response/export-csv/${templateId}`, {
    responseType: 'blob',
  });
  return response;
};

export const exportResponsesToExcel = async (templateId) => {
  const response = await api.get(`/response/export-excel/${templateId}`, {
    responseType: 'blob',
  });
  return response;
};
