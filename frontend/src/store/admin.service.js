import { defineStore } from "pinia";
import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, 
});

export const useAdminStore = defineStore("adminstore", {
  actions: {
    async adminlogin(mail, password) {
      try {
        const resp = await api.post("/adminconnexion", { mail, password });

        if (resp.data.user.role.toLowerCase() !== "admin") {
          throw new Error("Accès réservé aux administrateurs");
        }

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
  },
});
