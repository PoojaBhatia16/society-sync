import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Base URL for all endpoints
  withCredentials: true,
});

export const createFormTemplate = async (formData) => {
  try {
    const response = await api.post("/formTemplate", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw (
      error?.response?.data || { message: "Failed to create form template" }
    );
  }
};


export const getFormTemplates = async () => {
  try {
    const response = await api.get("/formTemplate");
    return response.data;
  } catch (error) {
    throw error?.response?.data || { message: "Failed to fetch templates" };
  }
};
