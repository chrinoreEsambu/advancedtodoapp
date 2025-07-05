<template>
  <div class="tasks-list">
    <h3>{{ role === "admin" ? "Toutes les tâches" : "Mes tâches" }}</h3>

    <div v-if="loading" class="loading-message">Chargement en cours...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="!tasks.length" class="empty-message">
      Aucune tâche disponible
    </div>

    <div v-else class="tasks-container">
      <div
        v-for="task in tasks"
        :key="task.taskId"
        class="task-item"
        :class="{ updating: updatingStates[task.taskId] }"
      >
        <div class="task-info">
          <span class="task-user">{{
            task.assignee?.nom || "Non assigné"
          }}</span>
          <span class="task-text">{{ task.task }}</span>
          <span class="task-meta">
            Créée par {{ task.creator?.nom }} le
            {{ formatDate(task.createdAt) }}
            <span v-if="task.updatedAt !== task.createdAt">
              • Modifiée le {{ formatDate(task.updatedAt) }}
            </span>
          </span>
        </div>

        <div v-if="role === 'admin'" class="task-state">
          <select
            v-model="task.state"
            @change="handleStateChange(task.task_id, $event.target.value)"
            class="state-select"
            :disabled="updatingStates[task.taskId]"
          >
            <option value="pending">En attente</option>
            <option value="delivered">Livré</option>
          </select>
          <span v-if="updatingStates[task.taskId]" class="updating-text">
            Mise à jour...
          </span>
        </div>
        <div v-else class="task-state">
          <span :class="['state-badge', task.state]">
            {{ taskStateLabel(task.state) }}
          </span>
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
const {
  tasks,
  error,
  role,
  updatingStates, // ◽ Utilisation directe du state de mise à jour
} = storeToRefs(adminStore);
const loading = ref(false);

// Helpers
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("fr-FR");
const taskStateLabel = (state) =>
  state === "delivered" ? "Livré" : "En attente";

// Gestion des changements d'état
const handleStateChange = async (taskId, newState) => {
  const success = await adminStore.updateTaskState(taskId, newState);
  if (!success) {
    // Réinitialiser la valeur en cas d'erreur
    const task = tasks.value.find((t) => t.taskId === taskId);
    if (task) task.state = task.state === "pending" ? "delivered" : "pending";
  }
};

// Chargement initial
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
.tasks-list {
  max-width: 800px;
  margin: 0 auto;
}

.task-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
  transition: background 0.3s;
}

.task-item.updating {
  background-color: #f8f9fa;
}

.error-message {
  color: #dc3545;
  padding: 10px;
  text-align: center;
}

.task-meta {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 4px;
}

.state-select {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ced4da;
}

.state-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
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
  margin-left: 8px;
  color: #6c757d;
  font-size: 0.8rem;
}
</style>
