<template>
  <div class="tasks-list">
    <h3>Tâches existantes</h3>

    <div v-if="loading" class="loading-message">Chargement en cours...</div>
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
          <span class="task-date">{{ formatDate(task.createdAt) }}</span>
        </div>
        <div class="task-state">
          <select
            v-model="task.state"
            @change="updateTaskState(task.task_id, task.state)"
            class="state-select"
          >
            <option value="pending">En attente</option>
            <option value="delivered">Livré</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAdminStore } from "../store/admin.service";
import { storeToRefs } from "pinia";

const adminStore = useAdminStore();
const { tasks, loadingTasks } = storeToRefs(adminStore);
const loading = ref(false);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("fr-FR");
};

const updateTaskState = async (taskId, newState) => {
  try {
    await adminStore.updateTaskState(taskId, newState);
  } catch (error) {
    console.error("Erreur mise à jour tâche:", error);
  }
};

const fetchTasks = async () => {
  loading.value = true;
  try {
    await adminStore.fetchTasks();
  } finally {
    loading.value = false;
  }
};

defineExpose({ fetchTasks });

onMounted(fetchTasks);
</script>

<style scoped>
.tasks-list {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 {
  color: #333;
  margin-bottom: 15px;
  text-align: center;
}

.loading-message,
.empty-message {
  text-align: center;
  padding: 20px;
  color: #666;
}

.tasks-container {
  margin-top: 15px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.task-info {
  flex: 1;
}

.task-user {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.task-text {
  color: #555;
}

.task-date {
  font-size: 0.8rem;
  color: #888;
  display: block;
  margin-top: 5px;
}

.state-select {
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: white;
}

@media (max-width: 600px) {
  .task-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .task-state {
    width: 100%;
  }

  .state-select {
    width: 100%;
  }
}
</style>
