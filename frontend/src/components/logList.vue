<template>
  <div class="logs-container">
    <h2>Journal Actions admins</h2>

    <div v-if="loading" class="loading-message">Chargement des logs...</div>
    <div v-else-if="logs.length === 0" class="empty-message">
      Aucun log trouvé.

      <div class="pagination">
        <button class="pagination-btn">
          <ChevronLeft />
        </button>
        <span class="pagination-text">Page </span>
        <button class="pagination-btn">
          <ChevronRight />
        </button>
      </div>
    </div>

    <div v-else class="logs-list">
      <div v-for="log in logs" :key="log.log_id" class="log-item">
        <p><span class="label">Admin ID:</span> {{ log.adminId }}</p>
        <p><span class="label">Action:</span> {{ log.action }}</p>
        <p><span class="label">Détail:</span> {{ log.details }}</p>
        <p class="log-date">{{ new Date(log.createAt).toLocaleString() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useAdminStore } from "../store/admin.service";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const adminStore = useAdminStore();
const loading = ref(true);
const logs = ref([]);

onMounted(async () => {
  loading.value = true;
  const response = await adminStore.adminlog();
  if (response.success) {
    logs.value = adminStore.logs;
  }
  loading.value = false;
});
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: right;
  gap: 16px;
  margin-top: 20px;
}

.pagination-btn {
  background-color: #f1f1f1;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
}

.pagination-btn:hover {
  background-color: #d0d0d0;
}

.pagination-text {
  font-weight: bold;
  font-size: 15px;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.log-item {
  padding: 1rem 1.25rem;
  border-left: 6px solid #e14242;
  border-radius: 0.5rem;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, background-color 0.2s ease;
}

/* .log-item:hover {
  background-color: #f1f5f9;
  transform: scale(1.01); 
} */

.log-item p {
  font-size: 0.9rem;
  color: #2d3748;
  margin: 0.35rem 0;
}

.label {
  font-weight: bold;
  color: #1a202c;
}

.log-date {
  font-size: 0.75rem;
  color: #718096;
  font-style: italic;
  margin-top: 0.75rem;
  border-top: 1px dashed #cbd5e0;
  padding-top: 0.5rem;
}
</style>
