import { createRouter } from "vue-router";
import { createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Todopage from "../pages/Todopage.vue";
import { useUserStore } from "../store/UserTask.service";
import dashboard from "../pages/dashboard.vue";
import AdminLog from "../pages/adminLog.vue";
import { useAdminStore } from "../store/admin.service";

const routes = [
  { path: "/", component: Login },
  { path: "/register", component: Register },
  { path: "/todopage", component: Todopage, meta: { requiresAuth: true } },
  { path: "/adminlogin", component: AdminLog },
  { path: "/dashboard", component: dashboard, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const adminStore = useAdminStore();

  if (to.path === "/dashboard") {
    if (!adminStore.role) {
      return next("/adminlogin");
    }
    return next();
  }

  if (to.meta.requiresAuth && !userStore.user) {
    return next("/");
  }

  next();
});
export default router;
