<template>
  <div class="todo-container">
    <header class="header">
      <h2>Bonjour, {{ userStore.user }}</h2>
      <button @click="handleLogout" class="logout-btn">
        <LogOut size="18" class="bttoff" /> Déconnexion
      </button>
    </header>

    <div class="centered-zone">
      <div class="add-task">
        <input
          v-model="taskText"
          placeholder="Nouvelle tâche..."
          class="input-task wide-input"
        />
        <button @click="handleAddTask" class="wide-button">
          Ajouter <Plus class="addplus" size="17" />
        </button>
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
        <h4>Commentaires existants</h4>
        <ul v-if="userStore.comments.length > 0">
          <li v-for="(comment, index) in userStore.comments" :key="index">
            <p>
              <strong>Auteur :</strong> {{ comment.author?.nom ?? "Anonyme" }}
            </p>
            <p>
              <strong>Réponse par :</strong>
              {{ comment.replyBy?.nom ?? "Aucune" }}
            </p>
            <p><strong>Contenu :</strong> {{ comment.content }}</p>
            <hr />
          </li>
        </ul>

        <div v-else class="nothingTxt">
          <Ghost class="ghost" />
          <p class="txt">Aucun commentaire !</p>
        </div>

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
import { MessageCircleIcon, LogOut, Plus, Ghost } from "lucide-vue-next";

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

const openCommentModal = async (taskId) => {
  currentTaskId.value = taskId;
  content.value = "";
  showModal.value = true;

  await userStore.getComments(taskId);
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

const taskValueSender = async (task) => {
  await userStore.submitTasksState(task.task_id, task.taskState);
};

const openChatModal = () => {
  showChat.value = true;
};

const closeChatModal = () => {
  showChat.value = false;
  chatInput.value = "";
};

const sendChatMessage = () => {
  const message = chatInput.value.trim();
  if (message === "") return;

  chatMessages.value.push({ from: "user", text: message });
  chatInput.value = "";

  setTimeout(() => {
    chatMessages.value.push({
      from: "other",
      text: "feature not available refer to the comments area ' ? ' to ask your questions ! Thank you.",
    });
  }, 1000);
};
</script>

<style scoped>
* {
  list-style: none;
}
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

.bttoff {
  margin-right: 5px;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
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

.centered-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  margin-top: 40px;
}

.add-task {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.input-task {
  padding: 10px;
  border: 1px solid #000;
  border-radius: 5px;
}

.addplus {
  margin-left: 2px;
}

.add-task button {
  display: flex;
  align-items: center;
  justify-content: center;
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

.wide-input {
  width: 400px;
  max-width: 90%;
}

.wide-button {
  width: 400px;
  max-width: 90%;
}

.tasks {
  width: 100%;
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
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  width: 90%;
  display: flex;
  flex-direction: column;
  height: 70vh;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.modal-content h4 {
  margin-bottom: 10px;
  font-size: 1.3rem;
  text-align: center;
}

.modal-content ul {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-content li {
  background: #f1f1f1;
  padding: 12px;
  border-radius: 12px;
  font-size: 0.95rem;
  position: relative;
}
.nothingTxt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: left;
}

.txt {
  margin-bottom: 1rem;
  text-align: left;
}

.ghost {
  width: 150px;
  height: 150px;
}
.modal-content li::before {
  content: "";
  position: absolute;
  top: 10px;
  left: -25px;
}

.modal-content p {
  margin: 2px 0;
  line-height: 1.3;
}

.modal-content textarea {
  width: 97%;
  resize: none;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-family: inherit;
  font-size: 1rem;
  margin-bottom: 10px;
}

.modal-actions {
  display: flex;
  justify-content: right;
  gap: 20px;
}

.modal-actions button {
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.modal-actions button:first-child {
  background-color: #fae04d;
  color: #000;
}

.modal-actions button:first-child:hover {
  background-color: #c3ebfc;
}

.modal-actions button:first-child:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.modal-actions button:last-child {
  background-color: #ff4444;
  color: #fff;
}

.modal-actions button:last-child:hover {
  background-color: #c82333;
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
  .header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }

  .task-item {
    flex-direction: column;
  }

  .wide-input,
  .wide-button {
    width: 100%;
  }
}
</style>
