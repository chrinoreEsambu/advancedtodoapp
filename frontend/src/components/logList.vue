<template>
  <div class="logs-container">
    <h2>Journal Actions admins</h2>

    <div class="pagination">
      <button class="pagination-btn" @click="prevPage">
        <ChevronLeft />
      </button>
      <span class="pagination-text">Page {{ page }}/{{ compter }}</span>
      <button class="pagination-btn" @click="nextPage">
        <ChevronRight />
      </button>
    </div>

    <div v-if="loading" class="loading-message">
      <div><img src="/load.jpg" alt="" /></div>
      Chargement des logs...
    </div>
    <div v-else-if="logs.length === 0" class="empty-message">
      Aucun log trouvé.
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
import { ref, onMounted, watch, computed } from "vue";
import { useAdminStore } from "../store/admin.service";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const adminStore = useAdminStore();
const logs = ref([]);
const loading = ref(true);
const page = ref(1);

const loadLogs = async () => {
  loading.value = true;
  const res = await adminStore.adminlog(page);
  if (res.success) {
    logs.value = adminStore.logs;
  }
  loading.value = false;
};

const prevPage = () => {
  if (page.value > 1) page.value--;
};

const nextPage = () => {
  page.value++;

  if (page.value > compter.value) {
    page.value = compter.value;
  }
};

onMounted(() => {
  loadLogs();
});

watch(page, () => {
  loadLogs();
});
const compter = computed(() => adminStore.compter);
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
  background-color: transparent;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
}

.pagination-btn:hover {
  background-color: #c3ebfc;
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
  /* background-color: #ffffff; */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  /* transition: transform 0.2s ease, background-color 0.2s ease; */
}

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
.loading-message img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  display: block;
}
</style>
