<template>
  <div class="tasks-list">
    <h3>{{ role === "admin" ? "Toutes les tâches" : "Mes tâches" }}</h3>

    <div v-if="loading" class="loading-message">Chargement en cours...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="tasks.length === 0" class="empty-message">
      Aucune tâche disponible
    </div>

    <div v-else class="tasks-container">
      <div v-for="task in tasks" :key="task.task_id" class="task-item">
        <div class="task-info">
          <span class="task-user">{{
            task.assignee?.nom || "Non assigné"
          }}</span>
          <span class="task-text">{{ task.task }}</span>
          <span class="task-meta">
            Créée par {{ task.creator?.nom }} le
            {{ formatDate(task.createdAt) }}
          </span>
        </div>

        <div v-if="role === 'admin'" class="task-state">
          <select
            v-model="task.state"
            @change="updateTaskState(task.task_id, task.state)"
            class="state-select"
            :disabled="updatingState === task.task_id"
          >
            <option value="pending">En attente</option>
            <option value="delivered">Livré</option>
          </select>
          <span v-if="updatingState === task.task_id" class="updating-text"
            >Mise à jour...</span
          >
        </div>
        <div v-else class="task-state">
          <span :class="['state-badge', task.state]">
            {{ task.state === "delivered" ? "Livré" : "En attente" }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAdminStore } from "../store/admin.service";
import { storeToRefs } from "pinia";

const adminStore = useAdminStore();
const { tasks, loadingTasks, error, role } = storeToRefs(adminStore);
const loading = ref(false);
const updatingState = ref(null);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("fr-FR");
};

const updateTaskState = async (taskId, newState) => {
  const result = await adminStore.updateTaskState(taskId, newState);
  if (!result.success) {
    
    console.error(result.error);
  }
};

const fetchTasks = async () => {
  loading.value = true;
  try {
    await adminStore.getAllUserTasks();
  } finally {
    loading.value = false;
  }
};

defineExpose({ fetchTasks });

onMounted(fetchTasks);
</script>

<style scoped>
/* Styles existants améliorés */
.error-message {
  color: #ff4444;
  text-align: center;
  padding: 15px;
}

.task-meta {
  font-size: 0.8rem;
  color: #666;
  display: block;
  margin-top: 5px;
}

.state-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.state-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.state-badge.delivered {
  background-color: #d4edda;
  color: #155724;
}

.updating-text {
  font-size: 0.8rem;
  color: #666;
  margin-left: 8px;
}
</style>
