import { createRouter } from "vue-router";
import { createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Todopage from "../pages/Todopage.vue";
const routes = [
  { path: "/", component: Login },
  { path: "/register", component: Register },
  { path: "/todopage", component: Todopage, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
