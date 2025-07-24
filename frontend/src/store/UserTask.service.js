import { defineStore } from "pinia";
import axios from "axios";

const islocaly = window.location.hostname === "localhost";

const api = axios.create({
  baseURL: islocaly
    ? "http://localhost:8000/api"
    : "https://n95rp9vf-8000.euw.devtunnels.ms/api",

  withCredentials: true,
});

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    tasks: [],
    usersList: [],
    loading: false,
    comments: [],
  }),

  actions: {
    async login(user_id, password) {
      const res = await api.post("/connexion", { user_id, password });
      this.user = res.data.user;
      localStorage.setItem("user", JSON.stringify(res.data.user));
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
        // console.log("Tâches récupérées :", res.data);
        this.tasks = Array.isArray(res.data.tasks) ? res.data.tasks : [];
        this.taskState = res.date.tasks;
      } catch (error) {
        this.error =
          error.reponse?.data?.messaage || "error lors du chargement";
      } finally {
        this.loading = false;
      }
    },

    async addTask(taskData) {
      await api.post("/addtask", taskData);
      await this.fetchTasks();
    },

    async logout() {
      await api.post("/logOut", {});
      this.user = null;
      this.tasks = [];
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
        // replyToId: null,
        // replyById: null,
      });
    },

    async submitTasksState(task_id, taskState) {
      try {
        await api.put(`/updateTasksState/${task_id}`, {
          taskState,
        });
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour de l'état de la tâche :",
          error
        );
      }
    },

    async fetchComments(userId) {
      const res = await api.get(`/getComments/${userId}`);
      this.comments = res.data.comments;
    },
  },
});
