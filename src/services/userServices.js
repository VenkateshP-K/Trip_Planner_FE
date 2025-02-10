import { instance, protectedInstance } from "./instance";

const userServices = {
  Register: async (firstName, lastName, email, phone, location, password) => {
    return await instance.post("/users/register", { firstName, lastName, email, phone, location, password });
  },

  login: async (email, password) => {
    const response = await instance.post("/users/login", { email, password });
    localStorage.setItem("token", response.data.token);
    return response;
  },

  me: async () => {
    try {
      return await protectedInstance.get("/users/me");
    } catch (error) {
      console.error("Error in /me service:", error.response?.data || error.message);
      throw error;
    }
  },

  logout: async () => {
    return await protectedInstance.post("/users/logout");
  },

  Update: async (data) => {
    return await protectedInstance.put("/users/update", data);
  },
}

export default userServices