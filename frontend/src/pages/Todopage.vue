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

              <select v-model="task.taskState" @change="taskValueSender(task)">
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

    <div
      v-if="showChat"
      class="chat-modal-overlay"
      @click.self="closeChatModal"
    >
      <div class="chat-modal">
        <div class="chat-header">
          <h3>Discussion</h3>
          <button @click="closeChatModal" class="close-chat">✕</button>
        </div>
        <div class="chat-messages">
          <div
            v-for="(msg, index) in chatMessages"
            :key="index"
            :class="[
              'chat-message',
              msg.from === 'user' ? 'from-user' : 'from-other',
            ]"
          >
            {{ msg.text }}
          </div>
          <div v-if="chatMessages.length === 0" class="no-messages">
            Pas encore de messages...
          </div>
        </div>
        <div class="chat-input">
          <textarea
            v-model="chatInput"
            placeholder="Écrire un message..."
            rows="2"
            @keyup.enter="sendChatMessage"
          ></textarea>
          <button @click="sendChatMessage" :disabled="!chatInput.trim()">
            Envoyer
          </button>
        </div>
      </div>
    </div>

    <button class="chat-button" @click="openChatModal" aria-label="Ouvrir chat">
      <MessageCircleIcon size="22" />
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/UserTask.service";
import { MessageCircleIcon } from "lucide-vue-next";

const router = useRouter();
const userStore = useUserStore();

const taskText = ref("");
const content = ref("");
const chatInput = ref("");
const chatMessages = ref([]);

const showModal = ref(false);
const sending = ref(false);
const currentTaskId = ref(null);

const showChat = ref(false);

onMounted(async () => {
  await userStore.fetchTasks();
});

const handleAddTask = async () => {
  if (taskText.value.trim() === "") return;

  await userStore.addTask({ task: taskText.value });
  taskText.value = "";
  await userStore.fetchTasks();
};

const handleLogout = async () => {
  await userStore.logout();
  router.push("/");
};

const openCommentModal = (taskId) => {
  currentTaskId.value = taskId;
  content.value = "";
  showModal.value = true;
};

const closeModal = () => {
  if (sending.value) return;
  showModal.value = false;
  currentTaskId.value = null;
  content.value = "";
};

const submitComment = async () => {
  if (content.value.trim() === "") {
    alert("Le commentaire ne peut pas être vide.");
    return;
  }

  sending.value = true;

  try {
    await userStore.addComment(currentTaskId.value, content.value);
    alert("Question envoyée !");
    closeModal();
    await userStore.fetchTasks();
  } catch (err) {
    alert("Erreur lors de l'envoi.");
    console.error(err);
  } finally {
    sending.value = false;
  }
};

// Modifier l'état d'une tâche (dropdown)
const taskValueSender = async (task) => {
  await userStore.submitTasksState(task.task_id, task.taskState);
};

// Ouvrir / fermer la fenêtre de chat
const openChatModal = () => {
  showChat.value = true;
};

const closeChatModal = () => {
  showChat.value = false;
  chatInput.value = "";
};

// Simuler un envoi de message dans le chat
const sendChatMessage = () => {
  const message = chatInput.value.trim();
  if (message === "") return;

  // Message de l'utilisateur
  chatMessages.value.push({
    from: "user",
    text: message,
  });

  chatInput.value = "";

  // Simuler une réponse automatique
  setTimeout(() => {
    chatMessages.value.push({
      from: "other",
      text: "Merci pour votre message. Nous reviendrons vers vous bientôt.",
    });
  }, 1000);
};
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

.chat-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1010;
}

.chat-modal {
  background: #fff;
  width: 90%;
  max-width: 600px;
  height: 70vh;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.chat-header h3 {
  margin: 0;
}

.close-chat {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #f8f8f8;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-message {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
  line-height: 1.3;
  word-wrap: break-word;
}

.from-user {
  background-color: #fae04d;
  align-self: flex-end;
  color: #000;
  border-bottom-right-radius: 0;
}

.from-other {
  background-color: #c3ebfc;
  align-self: flex-start;
  color: #000;
  border-bottom-left-radius: 0;
}

.no-messages {
  text-align: center;
  color: #777;
  font-style: italic;
  margin-top: 20px;
}

.chat-input {
  display: flex;
  gap: 10px;
}

.chat-input textarea {
  flex: 1;
  resize: none;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-family: inherit;
  font-size: 1rem;
}

.chat-input button {
  padding: 10px 16px;
  background-color: #fae04d;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
}

.chat-input button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.chat-input button:hover:not(:disabled) {
  background-color: #c3ebfc;
}

.chat-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #fae04d;
  color: #000;
  border: none;
  border-radius: 50%;
  padding: 12px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1020;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-button:hover {
  background-color: #c3ebfc;
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
