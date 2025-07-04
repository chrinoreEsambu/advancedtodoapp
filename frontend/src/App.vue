<script setup>
import { RouterView } from "vue-router";

import { useUserStore } from "./store/UserTask.service";
import { useAdminStore } from "./store/admin.service";

const userstore = useUserStore();
const adminStore = useAdminStore();

const savedUser = localStorage.getItem("user");
if (savedUser) {
  userstore.user = JSON.parse(savedUser);
}

const savedAdmin = localStorage.getItem("admin_info");
if (savedAdmin) {
  const adminData = JSON.parse(savedAdmin);
  adminStore.admin = adminData.email;
  adminStore.role = adminData.role;
}
</script>

<template>
  <div>
    <router-view />
  </div>
</template>

<style scoped></style>
