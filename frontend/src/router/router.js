import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Todopage from "../pages/Todopage.vue";
import { useUserStore } from "../store/UserTask.service";
import dashboard from "../pages/dashboard.vue";
import AdminLog from "../pages/adminLog.vue";
import { useAdminStore } from "../store/admin.service";
import addTaskUser from "../pages/addTaskUser.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/register", component: Register },
  { path: "/todopage", component: Todopage, meta: { requiresAuth: true } },
  { path: "/adminlogin", component: AdminLog },
  { path: "/dashboard", component: dashboard, meta: { requiresAuth: true } },
  {
    path: "/addTaskUser",
    component: addTaskUser,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const adminStore = useAdminStore();
  
  const adminData = localStorage.getItem("admin_info");
  if (adminData) {
    const parsed = JSON.parse(adminData);
    adminStore.admin = parsed.email;
    adminStore.role = parsed.role;
  } else {
    adminStore.admin = null;
    adminStore.role = null;
  }

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
