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
    tasks: [],
    loading: false,
    error: null,
    updatingStates: {},
    stats: {
      totalUsers: 0,
      totalAdmin: 0,
      totalNormalUsers: 0,
      totaltasks: 0,
    },
  }),
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

        localStorage.setItem(
          "admin",
          JSON.stringify({
            email: resp.data.user.
            user_mail,
            userRole: resp.data.user.role,
          })
        );

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
    async getAllUserTasks() {
      this.loadingTasks = true;
      this.error = null;
      try {
        const response = await api.get("/getusertasksfront");
        this.tasks = response.data.tasks || [];
        return { success: true };
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur de chargement";
        return { success: false };
      } finally {
        this.loadingTasks = false;
      }
    },

    async deleteUser(userId) {
      try {
        await api.delete(`/userdelete/${userId}`);

        this.users = this.users.filter((user) => user.user_id !== userId);
        return { success: true };
      } catch (error) {
        console.error("Delete error:", error);
        return {
          success: false,
          error:
            error.response?.data?.message || "Erreur lors de la suppression",
        };
      }
    },

    async createTask(taskData) {
      this.loadingTasks = true;
      try {
        const response = await api.post("/admincreattask", taskData);
        this.tasks.push(response.data.task);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || "Erreur de création",
        };
      } finally {
        this.loadingTasks = false;
      }
    },

    async updateTaskState(taskId, newState) {
      try {
        const response = await api.patch(`/adminUpdateTaskState/${taskId}`, {
          state: newState,
        });
        const index = this.tasks.findIndex((t) => t.task_id === taskId);
        if (index !== -1) {
          this.tasks[index].state = newState;
        }
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || "Erreur de mise à jour",
        };
      }
    },

    async updateTaskState(taskId, newState) {
      try {
        const response = await api.patch(
          `/admin/adminUpdateTaskState/${taskId}`,
          {
            state: newState,
          }
        );
      } catch (error) {}
    },
    async updateTaskState(taskId, newState) {
      try {
        const response = await api.put(`/taskstate/${taskId}`, {
          state: newState,
        });

        const index = this.tasks.findIndex((t) => t.task_id === taskId);
        if (index !== -1) {
          this.tasks[index].state = newState;
        }

        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || "Erreur inconnue",
        };
      }
    },
    async fetchStats() {
      try {
        const response = await api.get("/adminTaskCount");
        this.stats = response.data.stats;
      } catch (error) {
        console.log("erreur de la recuperation des stat", error);
      }
    },

    async logout() {
      await axios.post("/logOut", {}, { withCredentials: true });
      this.user = null;
      this.tasks = [];
    },
  },
});
