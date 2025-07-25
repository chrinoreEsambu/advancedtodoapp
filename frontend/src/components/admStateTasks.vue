<template>
  <div class="bento-grid">
    <div class="item item-billboard">
      <h1>Inprogress</h1>
    </div>

    <div class="item item-tote">
      <h1>Todo</h1>
    </div>

    <div class="item item-logo">
      <h1>Request</h1>

      <p></p>
    </div>

    <div class="item item-badge">
      <h1>Accepted</h1>
    </div>

    <div class="item item-shirt">
      <h1>Done</h1>
    </div>

    <div class="item item-mobile">
      <h1>Denied</h1>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAdminStore } from "../store/admin.service";
import { ref, onMounted, computed } from "vue";
const adminStore = useAdminStore();


</script>

<style scoped>
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 1rem;
  height: 100vh;
  padding: 1rem;
  background-color: #e6f4f1;
}

.item {
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  /* text-align: center; */
  color: white;
  padding: 1rem;
  font-family: sans-serif;
}

.item-billboard {
  grid-column: span 2;
  background-color: #1f7c6e;
  flex-direction: column;
}

.item-tote {
  background-color: #064c45;
}

.item-logo {
  grid-column: span 3;
  background-color: #043f3b;
}

.item-badge {
  background-color: #c3f0e6;
  color: #0a3d36;
}

.item-shirt {
  background-color: #e9fdfa;
  color: #0a3d36;
}

.item-mobile {
  background-color: #b0ebe0;
  color: #0a3d36;
  flex-direction: column;
}
h1 {
  font-size: 20px;
}
</style>
