import { defineStore } from "pinia";
import axios from "axios";

// const islocaly = window.location.hostname === "localhost";

// const api = axios.create({
//   baseURL: islocaly
//     ? "http://localhost:8000/api"
//     : "https://n95rp9vf-8000.euw.devtunnels.ms/api",

//   withCredentials: true,
// });
const api = axios.create({
  baseURL: "https://backchr.onrender.com/api",

  withCredentials: true,
});

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    tasks: [],
    usersList: [],
    loading: false,
    comments: [],
    isAuthenticated: false,
  }),

  actions: {
    async login(user_id, password) {
      const res = await api.post("/connexion", { user_id, password });
      this.user = res.data.user;
      this.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(res.data.user));
    },

    async checkAuth() {
      try {
        const response = await api.get("/getusertasks");

        if (response.status === 200) {
          this.isAuthenticated = true;
          return true;
        } else {
          this.user = null;
          this.isAuthenticated = false;
          return false;
        }
      } catch (error) {
        console.error("Utilisateur non authentifié");
        this.user = null;
        this.isAuthenticated = false;
        return false;
      }
    },

    async fetchTasks() {
      this.loading = true;
      try {
        const res = await api.get("/getusertasks", {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });
        this.tasks = Array.isArray(res.data.tasks) ? res.data.tasks : [];
        this.taskState = res.date.tasks;
      } catch (error) {
        this.error =
          error.reponse?.data?.messaage || "error lors du chargement";
      } finally {
        this.loading = false;
      }
    },

    async addTask(taskData, description) {
      await api.post("/addtask", taskData, description);
      await this.fetchTasks();
    },

    async logout() {
      await api.post("/logOut", {});
      this.user = null;
      this.tasks = [];
      this.isAuthenticated = false;
      localStorage.removeItem("user");
    },

    async register(nom, mail, password) {
      await api.post("/usercreat", { nom, mail, password });
    },

    async fetchUsers() {
      const res = await api.get("/getuser");
      this.usersList = res.data;
    },

    async getUserById(id) {
      const res = await api.get(`/getuserbyid/${id}`);
      return res.data;
    },

    async updateUser(id, updatedData) {
      await api.put(`/userupdate/${id}`, updatedData);
    },

    async deleteUser(id) {
      await api.delete(`/userdelete/${id}`);
    },

    async addComment(taskId, content) {
      await api.post(`/addComments/${taskId}`, {
        content,
      });
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
          alert("Une erreur s'est produite !");
        }
      }
    },

    async getComments(task_id) {
      try {
        const fetcher = await api.get(`/getCommentsByTask/${task_id}`);
        this.comments = fetcher.data.comments;
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des commentaires :",
          error
        );
      }
    },
  },
});
