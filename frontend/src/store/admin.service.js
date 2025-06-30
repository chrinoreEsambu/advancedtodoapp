import { defineStore } from "pinia";
import axios, { Axios } from "axios";

export const adminstore = defineStore("adminstore", {
  state: () => ({
    admin: null,
    role: null,
    users: [],
    tasks: [],
  }),

  actions: {
    async adminlogin(req, res) {
      const resp = await axios.post(
        "https//google.com",
        { mail, password },
        { withCredentials: true }
          );
        //   this.
    },
  },
});
