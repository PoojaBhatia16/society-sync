import axios from "axios";

// Axios instance with credentials for cookies (tokens)
const api = axios.create({
  baseURL: "http://localhost:5000/api/superadmin",
  withCredentials: true,
});


export const getAllPendingRequests = async () => {
  try {
    const response = await api.get("/pending-admins");
    return response.data;
  } catch (error) {
    throw error?.response?.data || { message: "Something went wrong" };
  }
};


export const approveAdminRequest = async (userId) => {
  try {
    const response = await api.post(`/approve/${userId}`);
    return response.data;
  } catch (error) {
    throw error?.response?.data || { message: "Approval failed" };
  }
};

export const deleteAdminRequest = async (userId) => {
  try {
    const response = await api.delete(`/reject/${userId}`);
    return response.data;
  } catch (error) {
    throw error?.response?.data || { message: "Rejection failed" };
  }
};
