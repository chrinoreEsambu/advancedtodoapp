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
        <label>Task :</label>
        <input
          type="text"
          class="object"
          placeholder="Nouvelle tâche"
          v-model="Newtask"
        />

        <label>Description :</label>
        <div
          ref="quillEditor"
          class="quill-editor"
          style="border: 1px solid #ddd; border-radius: 6px; min-height: 100px; padding: 8px;"
        ></div>
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
import { ref, onMounted } from "vue";
import { useAdminStore } from "../store/admin.service";
import { storeToRefs } from "pinia";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const adminStore = useAdminStore();
const { users } = storeToRefs(adminStore);

const selectedUserId = ref("");
const Newtask = ref("");
const taskDescription = ref(""); // ici on stockera le HTML
const taskState = ref("pending");
const errorMessage = ref("");
const successMessage = ref("");

const quillEditor = ref(null);
let quill = null;

onMounted(() => {
  quill = new Quill(quillEditor.value, {
    theme: "snow",
    modules: {
      toolbar: [
        ["bold", "italic", "underline"],
        [{ header: [1, 2, 3, false] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["clean"],
      ],
    },
  });

  // Synchroniser contenu Quill dans taskDescription
  quill.on("text-change", () => {
    taskDescription.value = quill.root.innerHTML;
  });
});

const emit = defineEmits(["task-created"]);

const handleCreate = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  // Vérifie que taskDescription contient du contenu non vide (html <p><br></p> est vide)
  const plainText = quill.getText().trim();

  if (!selectedUserId.value || !Newtask.value || !plainText) {
    errorMessage.value = "Veuillez remplir tous les champs";
    return;
  }

  try {
    const result = await adminStore.createTask({
      user_id: selectedUserId.value,
      task: Newtask.value,
      description: taskDescription.value,
      state: taskState.value,
    });

    if (result.success) {
      successMessage.value = result.data?.message || "Tâche créée avec succès";
      taskDescription.value = "";
      quill.setText(""); // reset Quill
      Newtask.value = "";
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
.object {
  width: 101%;
  height: 30px;
  border: 1px solid #000;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 5px;
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


.ql-toolbar.ql-snow {
  border-radius: 6px 6px 0 0;
  border: 1px solid #ddd;
}

.ql-container.ql-snow {
  border-radius: 0 0 6px 6px;
  border: 1px solid #ddd;
  height: 150px;
  font-size: 14px;
}
</style>
