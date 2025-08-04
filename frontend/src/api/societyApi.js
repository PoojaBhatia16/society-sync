import axios from 'axios';
// Axios instance with credentials for cookies (tokens)
const api = axios.create({
  baseURL: "http://localhost:5000/api/societies",
  withCredentials: true,
});

export const getAllSocieties = async () => {
  try {
    const response = await api.get("/getAllSocieties");
    return response.data;
  } catch (error) {
    throw error?.response?.data;
  }
};
export const getCurrentSociety = async () => {
  try {
    const response = await api.get("/currentSociety");
    return response.data;
  } catch (error) {
    throw error?.response?.data;
  }
};
export const AddEvent = async (formData) => {
  try {
    const response = await api.post("/addEvent", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    // Enhanced error handling
    throw {
      message: error?.response?.data?.message || "Failed to create event",
      status: error?.response?.status,
      errors: error?.response?.data?.errors || [],
    };
  }
};

export const getEvents=async()=>{
  try {
    const response = await api.get("/currentSociety/getEvents");
    return response.data;
  } catch (error) {
    throw error?.response?.data;
  }

}

