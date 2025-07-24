<template>
  <div class="todo-container">
    <header class="header">
      <h2>Bonjour, {{ userStore.user }}</h2>
      <button @click="handleLogout" class="logout-btn">Déconnexion</button>
    </header>

    <div class="content">
      <div class="add-task">
        <input
          v-model="taskText"
          placeholder="Nouvelle tâche..."
          class="input-task"
        />
        <button @click="handleAddTask">Ajouter</button>
      </div>

      <div class="tasks">
        <h3>Mes Tâches :</h3>

        <div v-if="userStore.tasks.length === 0">
          Aucune tâche pour le moment !
        </div>

        <ul>
          <li
            v-for="task in userStore.tasks"
            :key="task.task_id"
            class="task-item"
          >
            <div class="task-info">
              {{ task.task }}
            </div>

            <div class="task-actions">
              <button
                class="question-btn"
                @click="openCommentModal(task.task_id)"
              >
                ?
              </button>

              <select v-model="task.taskState">
                <optgroup label="Mark task status">
                  <option value="inprogress">In Progress</option>
                  <option value="request">Requested</option>
                </optgroup>
              </select>

              <label
                :class="{
                  todo: task.taskState === 'todo',
                  inprogress: task.taskState === 'inprogress',
                  request: task.taskState === 'request',
                  denied: task.taskState === 'denied',
                  accepted: task.taskState === 'accepted',
                  done: task.taskState === 'done',
                }"
              >
                {{ task.taskState }}
              </label>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h4>Poser ta question</h4>
        <textarea
          v-model="content"
          placeholder="Votre question ici..."
          rows="4"
        ></textarea>
        <div class="modal-actions">
          <button @click="submitComment" :disabled="sending">Envoyer</button>
          <button @click="closeModal" :disabled="sending">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/UserTask.service";

const router = useRouter();
const userStore = useUserStore();

const taskText = ref("");
const content = ref("");
const showModal = ref(false);
const sending = ref(false);
const currentTaskId = ref(null);
const selectValue = ref("");

const taskValueSender = async (task) => {
  await userStore.submitTasksState({
    task_id: task.task_id,
    taskState: task.taskState,
  });
};
onMounted(async () => {
  await userStore.fetchTasks();
});

const handleAddTask = async () => {
  if (!taskText.value.trim()) return;
  await userStore.addTask({ task: taskText.value });
  taskText.value = "";
};

const handleLogout = async () => {
  await userStore.logout();
  router.push("/");
};

function openCommentModal(taskId) {
  currentTaskId.value = taskId;
  content.value = "";
  showModal.value = true;
}

function closeModal() {
  if (sending.value) return;
  showModal.value = false;
  currentTaskId.value = null;
  content.value = "";
}

async function submitComment() {
  if (!content.value.trim()) {
    alert("Le commentaire ne peut pas être vide.");
    return;
  }
  sending.value = true;
  try {
    await userStore.addComment(currentTaskId.value, content.value);
    alert("Question envoyée avec succès.");
    showModal.value = false;
    await userStore.fetchTasks();
  } catch (error) {
    alert("Erreur lors de l'envoi de la question.");
    console.error(error);
  } finally {
    sending.value = false;
  }
}
</script>

<style scoped>
.todo {
  background-color: #7bf1a8;
}
.inprogress {
  background-color: #ffd166;
}
.request {
  background-color: #f4a8ff;
}
.denied {
  background-color: #ff6b6b;
}
.accepted {
  background-color: #c3ebfc;
}
.done {
  background-color: #314158;
  color: #fff;
}

.todo,
.inprogress,
.request,
.denied,
.accepted,
.done {
  padding: 4px 8px;
  border-radius: 5px;
  text-align: center;
  min-width: 90px;
  font-size: 0.85rem;
  font-weight: 500;
}

.todo-container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.logout-btn {
  background-color: #000;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #222;
}

.content {
  display: flex;
  flex-direction: row;
  gap: 40px;
}

.add-task {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-task {
  padding: 10px;
  border: 1px solid #000;
  border-radius: 5px;
}

.add-task button {
  background-color: #000;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-task button:hover {
  background-color: #222;
}

.tasks {
  flex: 2;
}

.tasks ul {
  list-style: none;
  padding-left: 0;
}

.task-item {
  background-color: #f5f5f5;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
  flex-wrap: wrap;
}

.task-info {
  flex: 1;
  word-wrap: break-word;
}

.task-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.question-btn {
  background-color: #fae04d;
  color: #000;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}

.question-btn:hover {
  background-color: #c3ebfc;
}

select {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 6px;
  max-width: 400px;
  width: 90%;
}

.modal-content h4 {
  margin-bottom: 10px;
}

.modal-content textarea {
  width: 100%;
  resize: vertical;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-family: inherit;
  margin-bottom: 10px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-actions button {
  padding: 8px 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-actions button:first-child {
  background-color: #fae04d;
  color: #000;
}

.modal-actions button:hover {
  background-color: #c3ebfc;
  color: #000;
  transition: 0.2s ease-out;
}

.modal-actions button:first-child:disabled {
  background-color: #c3ebfc;
  cursor: not-allowed;
}

.modal-actions button:last-child {
  background-color: red;
  color: #fff;
}

.modal-actions button:last-child:hover {
  background-color: #dc3545;
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
    gap: 20px;
  }

  .header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }

  .add-task {
    flex-direction: column;
  }

  .add-task button,
  .input-task {
    width: 100%;
    box-sizing: border-box;
  }

  .task-item {
    flex-direction: column;
  }
}
</style>
