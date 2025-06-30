import { defineStore } from "pinia";
import { Axios } from "axios";

export const adminstore = defineStore("adminstore", {
  state: () => ({
    admin: null,
    role: null,
    users: [],
    tasks: [],
  }),

  actions: {
    async adminlogin(req, res) {
      console.log("okey");
    },
  },
});
