<template>
  <div class="container">
    <strong>Créer une tâche</strong>
    <input
      v-model="taskText"
      placeholder="Nouvelle tâche..."
      class="input-task"
    />
    <div ref="quillEditor" class="quill-editor"></div>
    <div class="button-wrapper">
      <button
        @click="handleAddTask"
        class="wide-button"
        :disabled="isAddingTask"
      >
        <span v-if="isAddingTask" class="loader"></span>
        {{ isAddingTask ? "Ajout en cours..." : "Ajouter" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useUserStore } from "../store/UserTask.service";

const userStore = useUserStore();

const taskText = ref("");
const description = ref("");
const isAddingTask = ref(false);

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
});

const handleAddTask = async () => {
  description.value = quill.root.innerHTML;

  if (taskText.value.trim() === "") return;

  isAddingTask.value = true;

  try {
    const taskData = {
      task: taskText.value,
      description: description.value,
    };

    await userStore.addTask(taskData);

    taskText.value = "";
    quill.setText("");

    await userStore.fetchTasks();
  } catch (error) {
    console.error("Erreur lors de l'ajout de la tâche:", error);
  } finally {
    isAddingTask.value = false;
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-task {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.quill-editor {
  height: 200px;
}

.button-wrapper {
  display: flex;
  justify-content: flex-end;
}

.wide-button {
  background-color: #dc2626;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 140px;
}

.wide-button:hover {
  background-color: #a51f1f;
}

.wide-button:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
  opacity: 0.7;
}

.loader {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
