import { defineStore } from "pinia";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

export const useAdminStore = defineStore("adminstore", {
  state: () => ({
    admin: null,
    role: null,
    errorMessage: null,
    users: [],
    loading: false,
  }),
  actions: {
    async adminlogin(mail, password) {
      try {
        const resp = await api.post("/adminconnexion", { mail, password });

        // if (resp.data.user.role.toLowerCase() !== "admin") {
        //   throw new Error("Accès réservé aux administrateurs");
        // }

        this.admin = resp.data.user.user_mail;
        this.role = resp.data.user.role;
        this.errorMessage = null;
        return true;
      } catch (error) {
        this.errorMessage = error.response?.data?.message || error.message;
        this.admin = null;
        this.role = null;
        return false;
      }
    },

    async createUser(userData) {
      try {
        const response = await api.post("/adminCreateUser", userData);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: {
            message: error.response?.data?.Message || "Erreur de création",
          },
        };
      }
    },
    async fetchUsers() {
      this.loadingUsers = true;
      try {
        const response = await api.get("/admingetuser");
        this.users = response.data.findalluser;
        return { success: true };
      } catch (error) {
        console.error("Error fetching users:", error);
        return { success: false, error: error.response?.data };
      } finally {
        this.loadingUsers = false;
      }
    },
  },
});
