<script setup>
import { RouterView } from "vue-router";

import { useUserStore } from "./store/UserTask.service";
const userstore = useUserStore();
const savedUser = localStorage.getItem("user");
if (savedUser) {
  userstore.user = JSON.parse(savedUser);
}
</script>

<template>
  <div>
    <router-view />
  </div>
</template>

<style scoped></style>
