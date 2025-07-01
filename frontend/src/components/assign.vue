<template>
  <div class="task-creation">
    <h2>Création de Tâche</h2>

    <div class="task-form">
      <div class="form-row">
        <div class="form-group">
          <label>Utilisateur :</label>
          <select v-model="selectedUserId" class="form-select" required>
            <option value="" disabled>Sélectionnez un utilisateur</option>
            <option
              v-for="user in users"
              :key="user.user_id"
              :value="user.user_id"
            >
              {{ user.nom }} ({{ user.user_id }})
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>État initial :</label>
          <select v-model="taskState" class="form-select">
            <option value="pending">En attente</option>
            <option value="delivered">Livré</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>Description :</label>
        <textarea
          v-model="taskDescription"
          class="form-textarea"
          required
          placeholder="Décrivez la tâche..."
        ></textarea>
      </div>

      <button @click="handleCreate" class="submit-button">
        Créer la tâche
      </button>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAdminStore } from "../store/admin.service";
import { storeToRefs } from "pinia";

const adminStore = useAdminStore();
const { users } = storeToRefs(adminStore);

const selectedUserId = ref("");
const taskDescription = ref("");
const taskState = ref("pending");
const errorMessage = ref("");
const successMessage = ref("");

const emit = defineEmits(["task-created"]);

const handleCreate = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!selectedUserId.value || !taskDescription.value) {
    errorMessage.value = "Veuillez remplir tous les champs";
    return;
  }

  try {
    const result = await adminStore.createTask({
      user_id: selectedUserId.value,
      task: taskDescription.value,
      state: taskState.value,
    });

    if (result.success) {
      successMessage.value = result.data?.message || "Tâche créée avec succès";
      taskDescription.value = "";
      selectedUserId.value = "";
      emit("task-created");
    } else {
      errorMessage.value = result.error || "Erreur lors de la création";
    }
  } catch (error) {
    errorMessage.value = "Une erreur est survenue";
  }
};
</script>

<style scoped>
.task-creation {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

h2 {
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.task-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

.form-select,
.form-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #fae04d;
  color: black;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #fae37d;
}

.success-message {
  color: #42b983;
  margin-top: 15px;
  text-align: center;
  font-weight: 500;
}

.error-message {
  color: #ff4444;
  margin-top: 15px;
  text-align: center;
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
