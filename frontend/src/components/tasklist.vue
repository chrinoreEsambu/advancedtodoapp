<template>
  <div class="tasks-list">
    <h3>{{ role === "admin" ? "Toutes les tâches" : "Mes tâches" }}</h3>

    <div class="pagination">
      <button class="pagination-btn" @click="prevPage">
        <ChevronLeft />
      </button>
      <span class="pagination-text">Page {{ page }}/{{ compter }}</span>
      <button class="pagination-btn" @click="nextPage">
        <ChevronRight />
      </button>
    </div>

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
          <span class="task-text">_{{ task.task }}</span>

          <span class="task-meta">
            Créée par {{ task.creator?.nom }} le
            {{ formatDate(task.createdAt) }}
            <span v-if="task.updatedAt !== task.createdAt">
              • Modifiée le {{ formatDate(task.updatedAt) }}
            </span>
            <br />
            <span class="redo">Commentaire : {{ task.commentaire }}</span>
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
import { ChevronLeft, ChevronRight } from "lucide-vue-next";


const adminStore = useAdminStore();
const { tasks, error, role, updatingStates } = storeToRefs(adminStore);
const loading = ref(false);

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("fr-FR");
const taskStateLabel = (state) =>
  state === "delivered" ? "Livré" : "En attente";

const handleStateChange = async (taskId, newState) => {
  const success = await adminStore.updateTaskState(taskId, newState);
  if (!success) {
    const task = tasks.value.find((t) => t.taskId === taskId);
    if (task) task.state = task.state === "pending" ? "delivered" : "pending";
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
.redo {
  color: #005b47;
}
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
