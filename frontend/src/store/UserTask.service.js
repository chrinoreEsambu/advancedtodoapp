import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    tasks: [],
    usersList: [], // pour getuser
  }),

  actions: {
    async login(user_id, password) {
      const res = await axios.post(
        "http://localhost:8000/api/connexion",
        { user_id, password },
        { withCredentials: true }
      );
      this.user = res.data.user;
      this.tasks = res.data.tasks;
    },

    async fetchTasks() {
      const res = await axios.get("http://localhost:8000/api/getusertasks", {
        withCredentials: true,
        // headers: {
        //   "Cache-Control": "no-cache",
        //   Pragma: "no-cache",
        // },
      });
      console.log("Tâches récupérées :", res.data);

      this.tasks = Array.isArray(res.data.tasks) ? res.data.tasks : [];
    },

    async addTask(taskData) {
      await axios.post("http://localhost:8000/api/addtask", taskData, {
        withCredentials: true,
      });
      await this.fetchTasks();
    },

    async logout() {
      await axios.post(
        "http://localhost:8000/api/logOut",
        {},
        { withCredentials: true }
      );
      this.user = null;
      this.tasks = [];
    },

    async register(nom, mail, password) {
      await axios.post(
        "http://localhost:8000/api/usercreat",
        { nom: nom, mail: mail, password: password },
        { withCredentials: true }
      );
    },

    async fetchUsers() {
      const res = await axios.get("http://localhost:8000/api/getuser");
      this.usersList = res.data;
    },

    async getUserById(id) {
      const res = await axios.get(
        `http://localhost:8000/api/getuserbyid/${id}`
      );
      return res.data;
    },

    async updateUser(id, updatedData) {
      await axios.put(
        `http://localhost:8000/api/userupdate/${id}`,
        updatedData
      );
    },

    async deleteUser(id) {
      await axios.delete(`http://localhost:8000/api/userdelete/${id}`);
    },
  },
});
