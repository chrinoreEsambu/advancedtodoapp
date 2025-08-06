import { defineStore } from "pinia";
import axios from "axios";

const islocaly = window.location.hostname === "localhost";
const api = axios.create({
  baseURL: islocaly
    ? "http://localhost:8000/api"
    : "https://n95rp9vf-8000.euw.devtunnels.ms/api",

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
    logs: [],
    compter: 0,
    count: 0,
    tache: [],
    messages: [],
  }),
  actions: {
    async adminlogin(mail, password) {
      try {
        const response = await api.post("/adminconnexion", { mail, password });

        this.admin = response.data.user.user_mail;
        this.role = response.data.user.role;
        this.errorMessage = null;

        localStorage.setItem(
          "admin_info",
          JSON.stringify({
            email: response.data.user.user_mail,
            role: response.data.user.role,
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
    async getAllUserTasks(page) {
      this.loadingTasks = true;
      this.error = null;
      try {
        const response = await api.get("/getusertasksfront", {
          params: {
            page: page,
          },
        });

        this.tasks = response.data.tasks || [];
        this.count = response.data.countTasks;

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

    async fetchStats() {
      try {
        const response = await api.get("/adminTaskCount");
        this.stats = response.data.stats;
      } catch (error) {
        console.log("erreur de la recuperation des stat", error);
      }
    },

    async updateTaskState(taskId, newState) {
      this.updatingStates[taskId] = true;

      console.log("task_id2 :", taskId);
      try {
        const response = await api.put(`/adminUpdateTaskState/${taskId}`, {
          newState,
        });

        const index = this.tasks.findIndex((t) => t.taskId === taskId);
        if (index !== -1) {
          this.tasks[index].state = newState;
        }

        return { success: true };
      } catch (error) {
        this.error = error.response?.data?.message || "Échec de la mise à jour";
        return {
          success: false,
          error: this.error,
        };
      } finally {
        this.updatingStates[taskId] = false;
      }
    },

    async logoutAdmin() {
      try {
        api.post("/logOutAdmin");
        this.admin = null;
        this.role = null;
        localStorage.removeItem(this.admin);
      } catch (error) {
        console.error("Logout error:", error);
      }
    },
    async adminlog(page) {
      try {
        const response = await api.get("/logs", {
          params: {
            page: page.value,
          },
        });
        this.logs = response.data.logs;
        this.compter = response.data.countPage;
        return { success: true };
      } catch (error) {
        console.error("Erreur lors de la récupération des logs:", error);
        return {
          success: false,
          error:
            error.response?.data?.message || "Erreur lors de la récupération",
        };
      }
    },

    async fetchStateTask() {
      try {
        const res = await api.get("/admStateFinder");
        this.tache = res.data.elements;
      } catch (error) {
        console.error("Erreur lors de la récupération des tache:", error);
      }
    },

    async submitTasksState(task_id, taskState) {
      try {
        const response = await api.put(`/updateTasksState/${task_id}`, {
          taskState,
        });

        if (response.data.messageT) {
          alert(response.data.messageT);
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour de l'état de la tâche :",
          error
        );

        if (error.response?.data?.messageT) {
          alert(error.response.data.messageT);
        } else {
          alert("Une erreur s’est produite !");
        }
      }
    },

    async fetchMessages(user_id = null) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get("/getMyMessages", {
          params: user_id ? { user_id } : {}, // 👈 pas de user_id = tous les messages
        });
        this.messages = res.data.getAllMessage;
      } catch (err) {
        this.error = err.message || "Erreur lors du chargement des messages";
      } finally {
        this.loading = false;
      }
    },
  },
});
