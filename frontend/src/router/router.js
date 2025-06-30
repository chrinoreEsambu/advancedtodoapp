import { createRouter } from "vue-router";
import { createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Todopage from "../pages/Todopage.vue";
import { useUserStore } from "../store/UserTask.service";
import adminLog from "../pages/adminLog.vue";
import AdminLog from "../pages/adminLog.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/register", component: Register },
  { path: "/todopage", component: Todopage, meta: { requiresAuth: true } },
  { path: "/adminlogin", component: AdminLog },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// --
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.user) {
    next("/");
  } else {
    next();
  }
});

export default router;
