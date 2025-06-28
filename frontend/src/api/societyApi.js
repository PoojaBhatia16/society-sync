import axios from 'axios';
// Axios instance with credentials for cookies (tokens)
const api = axios.create({
  baseURL: "http://localhost:5000/api/societies",
  withCredentials: true,
});

export const getAllSocieties = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    throw error?.response?.data;
  }
};