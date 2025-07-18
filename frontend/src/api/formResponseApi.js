import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", 
  withCredentials: true,
});

export const submitResponse = async ({ templateId, responses }) => {
  try {
    // Convert responses to proper format
    const formattedResponses = Array.isArray(responses) 
      ? responses 
      : Object.entries(responses).map(([fieldId, value]) => ({
          fieldId,
          value: value instanceof File ? value.name : value
        })); // Fixed missing parenthesis here

    const response = await api.post(
      `/response/${templateId}`, 
      { responses: formattedResponses },
      {
        headers: {
          "Content-Type": "application/json",
          
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Submission error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.error || 
      "Failed to submit form response"
    );
  }
};