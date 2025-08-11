import axios from "axios";

// Axios instance with credentials for cookies (tokens)
const api = axios.create({
  baseURL: "http://localhost:5000/api/v1/users", 
  withCredentials: true,
});

// Register new user
export const registerUser = async ({ name, email, password, role, avatar, pendingSociety }) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("role", role);
  formData.append("avatar", avatar);
  formData.append("pendingSociety", pendingSociety);

  const res = await api.post("/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

//  Login user
export const loginUser = async ({ email, password }) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    throw error?.response?.data;
  }
};

// Get current user info
export const getUserProfile = async () => {
  try {
    const response = await api.get("/me/current");
    return response.data;
  } catch (error) {
    throw error?.response?.data;
  }
};

export const getPast = async () => {
  try {
    const response = await api.get("/getAllPast");
    return response.data;
  } catch (error) {
    throw error?.response?.data;
  }
};

export const getUpcoming = async () => {
  try {
    const response = await api.get("/getAllLatest");
    return response.data;
  } catch (error) {
    throw error?.response?.data;
  }
};

export const getEventByName = async (society_name) => {
  try {
    //console.log(society_name);
    console.log(society_name);

    const response = await api.get(`/getEventByName/${society_name}`);
    console.log("cdsvcd",response.data);
    return response.data;
  } catch (error) {
    throw error?.response?.data;
  }
};
export const updateAccountDetails=async({name,email})=>{
  try {
    const response = await api.put("/me", { name, email });
    return response.data;
  } catch (error) {
    throw error?.response?.data;
  }
}
// Change password (correct route)
export const changeUserPassword = async ({ currentPassword, newPassword }) => {
  try {
    const response = await api.put("/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data;
  }
};

//  Logout user
export const logoutUser = async () => {
  try {
    const response = await api.post("/logout");
    return response.data;
  } catch (error) {
    throw error?.response?.data;
  }
};

//  Update avatar
export const updateUserAvatar = async (avatar) => {
  const formData = new FormData();
  formData.append("avatar", avatar);

  try {
    const response = await api.put("/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data;
  }
};
