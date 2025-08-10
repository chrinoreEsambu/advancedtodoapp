<template>
  <div class="todo-container">
    <header class="header">
      <h2>Bonjour, {{ userStore.user }}</h2>
      <button @click="handleLogout" class="logout-btn">
        <LogOut size="18" class="bttoff" /> Déconnexion
      </button>
    </header>

    <div class="centered-zone">
      <div class="flex">
        <p>{{ dateDisplay }}</p>
        <button @click="openAddTaskModal" class="wide-button">
          <Plus class="addplus" size="17" />Ajouter une tâche
        </button>
      </div>

      <div
        v-if="showAddTaskModal"
        class="modal-overlay"
        @click.self="closeAddTaskModal"
      >
        <div class="modal-content add-task-modal">
          <addTaskUser @close="closeAddTaskModal" />
        </div>
      </div>

      <div class="bento-grid">
        <div class="bento-card todo-bento">
          <div class="bento-header">
            <h3>À Faire</h3>
          </div>
          <div class="bento-content">
            <div v-if="todoTasks.length === 0" class="empty-state">
              <div class="empty-icon">
                <ListTodo style="height: 60px; width: 60px" />
              </div>
              <p>Aucune tâche à faire</p>
            </div>
            <div v-else class="task-list">
              <div
                v-for="task in todoTasks"
                :key="task.task_id"
                class="task-item"
              >
                <div class="task-info">
                  {{ task.task }}
                  <br />
                  <label
                    class="description clickable-description"
                    v-html="truncateText(task.description)"
                    @click="openTaskModal(task)"
                  ></label>
                </div>

                <div class="task-actions">
                  <button
                    class="question-btn"
                    @click="openCommentModal(task.task_id)"
                  >
                    ?
                  </button>
                  <select
                    v-model="task.taskState"
                    @change="taskValueSender(task)"
                  >
                    <optgroup label="Changer l'état">
                      <option value="inprogress">Inprogress</option>
                      <option value="request">Requested</option>
                    </optgroup>
                  </select>
                  <label class="todo">
                    {{ task.taskState }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bento-card inprogress-bento">
          <div class="bento-header">
            <h3>En Cours</h3>
          </div>
          <div class="bento-content">
            <div v-if="inprogressTasks.length === 0" class="empty-state">
              <div class="empty-icon">
                <Hourglass style="height: 60px; width: 60px" />
              </div>
              <p>Aucune tâche en cours</p>
            </div>
            <div v-else class="task-list">
              <div
                v-for="task in inprogressTasks"
                :key="task.task_id"
                class="task-item"
              >
                <div class="task-info">
                  {{ task.task }}
                  <br />
                  <label
                    class="description clickable-description"
                    v-html="truncateText(task.description)"
                    @click="openTaskModal(task)"
                  ></label>
                </div>
                <div class="task-actions">
                  <button
                    class="question-btn"
                    @click="openCommentModal(task.task_id)"
                  >
                    ?
                  </button>
                  <select
                    v-model="task.taskState"
                    @change="taskValueSender(task)"
                  >
                    <optgroup label="Changer l'état">
                      <option value="inprogress">Inprogress</option>
                      <option value="request">Requested</option>
                    </optgroup>
                  </select>
                  <label class="inprogress">
                    {{ task.taskState }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bento-card request-bento">
          <div class="bento-header">
            <h3>Demande</h3>
          </div>
          <div class="bento-content">
            <div v-if="requestTasks.length === 0" class="empty-state">
              <div class="empty-icon">
                <PackageCheck style="height: 60px; width: 60px" />
              </div>
              <p>Aucune demande en attente</p>
            </div>
            <div v-else class="task-list">
              <div
                v-for="task in requestTasks"
                :key="task.task_id"
                class="task-item"
              >
                <div class="task-info">
                  {{ task.task }}
                  <br />
                  <label
                    class="description clickable-description"
                    v-html="truncateText(task.description)"
                    @click="openTaskModal(task)"
                  ></label>
                </div>
                <div class="task-actions">
                  <button
                    class="question-btn"
                    @click="openCommentModal(task.task_id)"
                  >
                    ?
                  </button>
                  <select
                    v-model="task.taskState"
                    @change="taskValueSender(task)"
                  >
                    <optgroup label="Changer l'état">
                      <option value="inprogress">Inprogress</option>
                      <option value="request">Requested</option>
                    </optgroup>
                  </select>
                  <label class="request">
                    {{ task.taskState }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bento-card done-bento">
          <div class="bento-header">
            <h3>Terminées</h3>
          </div>
          <div class="bento-content">
            <div v-if="doneTasks.length === 0" class="empty-state">
              <div class="empty-icon">
                <CloudCheck style="height: 60px; width: 60px" />
              </div>
              <p>Aucune tâche terminée</p>
            </div>
            <div v-else class="task-list">
              <div
                v-for="task in doneTasks"
                :key="task.task_id"
                class="task-item"
              >
                <div class="task-info">
                  {{ task.task }}
                  <br />
                  <label
                    class="description clickable-description"
                    v-html="truncateText(task.description)"
                    @click="openTaskModal(task)"
                  ></label>
                </div>
                <div class="task-actions">
                  <button
                    class="question-btn"
                    @click="openCommentModal(task.task_id)"
                  >
                    ?
                  </button>
                  <select
                    v-model="task.taskState"
                    @change="taskValueSender(task)"
                    disabled
                  >
                    <optgroup label="État">
                      <option value="done">Terminé</option>
                    </optgroup>
                  </select>
                  <label class="done">
                    {{ task.taskState }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="otherTasks.length > 0" class="bento-card other-bento">
          <div class="bento-header">
            <h3>Autres États</h3>
          </div>
          <div class="bento-content">
            <div class="task-list">
              <div
                v-for="task in otherTasks"
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
                  <select
                    v-model="task.taskState"
                    @change="taskValueSender(task)"
                  >
                    <optgroup label="Changer l'état">
                      <option value="inprogress">Inprogress</option>
                      <option value="request">Request</option>
                    </optgroup>
                  </select>
                  <label
                    :class="{
                      denied: task.taskState === 'denied',
                      accepted: task.taskState === 'accepted',
                    }"
                  >
                    {{ task.taskState }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
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

    <div
      v-if="showTaskModal"
      class="modal-overlay"
      @click.self="closeTaskModal"
    >
      <div class="modal-content task-modal">
        <div class="task-modal-header">
          <h3>{{ selectedTask?.task }}</h3>
          <button @click="closeTaskModal" class="close-btn">✕</button>
        </div>

        <div class="task-modal-content">
          <p><strong>Titre :</strong> {{ selectedTask?.task }}</p>
          <p>
            <strong>État :</strong>
            <span :class="selectedTask?.taskState">{{
              selectedTask?.taskState
            }}</span>
          </p>
          <p><strong>Description complète :</strong></p>
          <div
            class="full-description"
            v-html="selectedTask?.description"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/UserTask.service";
import {
  MessageCircleIcon,
  LogOut,
  Plus,
  Ghost,
  PackageCheck,
  ListTodo,
  Hourglass,
  CloudCheck,
} from "lucide-vue-next";
import AddTaskUser from "./addTaskUser.vue";
import addTaskUser from "../pages/addTaskUser.vue";

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

const dateDisplay = ref("");

const showTaskModal = ref(false);
const selectedTask = ref(null);

const todoTasks = computed(() =>
  userStore.tasks.filter((task) => task.taskState === "todo")
);

const inprogressTasks = computed(() =>
  userStore.tasks.filter((task) => task.taskState === "inprogress")
);

const requestTasks = computed(() =>
  userStore.tasks.filter((task) => task.taskState === "request")
);

const doneTasks = computed(() =>
  userStore.tasks.filter((task) => task.taskState === "done")
);

const otherTasks = computed(() =>
  userStore.tasks.filter(
    (task) =>
      !["todo", "inprogress", "request", "done"].includes(task.taskState)
  )
);

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

const showAddTaskModal = ref(false);

const openAddTaskModal = () => {
  showAddTaskModal.value = true;
};

const closeAddTaskModal = () => {
  showAddTaskModal.value = false;
};

function getDateFormatted() {
  const today = new Date();

  const mois = today.toLocaleDateString("fr-FR", { month: "long" });
  const jourDuMois = today.toLocaleDateString("fr-FR", { day: "2-digit" });
  const jourNom = today.toLocaleDateString("fr-FR", { weekday: "long" });

  return `${mois} ${jourDuMois} • Aujourd'hui • ${jourNom}`;
}

onMounted(() => {
  dateDisplay.value = getDateFormatted();
});

const openTaskModal = (task) => {
  selectedTask.value = task;
  showTaskModal.value = true;
};

const closeTaskModal = () => {
  showTaskModal.value = false;
  selectedTask.value = null;
};

const truncateText = (text) => {
  if (!text) return "";
  if (text.length > 74) {
    return text.substring(0, 74) + "...";
  }
  return text;
};
</script>

<style scoped>
* {
  list-style: none;
}
.description {
  color: #a1abb9;
  font-size: 0.85rem;
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
  max-width: 1400px;
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
  gap: 40px;
  margin-top: -13px;
}

.input-task {
  padding: 10px;
  border: 1px solid #000;
  border-radius: 5px;
}

.addplus {
  margin-left: 2px;
  color: #ffffff;
  border: 1.5px solid #ffffff;
  padding: 5px;
  border-radius: 50px;
}
.flex {
  display: flex;
  align-items: center;
  flex-direction: row !important;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: nowrap !important;
  width: 100%;
  margin-bottom: -10px;
}
.add-task button {
  display: flex;

  align-items: center;
  padding: 10px;
  gap: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.2s ease;
}
.style-line {
  height: 1px;
  background: #000;
  border-radius: 2px;
  margin: 1px 0;
  opacity: 0.7;
  margin-top: -10px;
}
.add-task button:hover {
  color: #ff4444;
}

.add-task button:hover .addplus {
  background: #ff4444;
  color: #fff;
  transition: 0.2s ease;
}

.wide-input {
  width: 400px;
  max-width: 100%;
}

.wide-button {
  justify-content: center;
  align-items: center;
  display: flex;
  gap: 6px;
  width: 200px;
  height: 45px;
  border: 1px solid #dc2626;
  background-color: #ff4444;
  color: #fff;
  border-radius: 5px;
  position: relative;
  right: 13px;
  transition: 0.2s ease;
}
.wide-button:hover {
  background-color: #dc2626;
}
.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
  width: 100%;
  max-width: 1400px;
}

.bento-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.bento-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
}

.todo-bento {
  border-left: 5px solid #7bf1a8;
}

.inprogress-bento {
  border-left: 5px solid #ffd166;
}

.request-bento {
  border-left: 5px solid #f4a8ff;
}

.done-bento {
  border-left: 5px solid #314158;
}

.other-bento {
  border-left: 5px solid #6366f1;
}

.bento-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
}

.bento-header h3 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e293b;
}

.task-count {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.bento-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  color: #64748b;
}

.empty-icon {
  font-size: 3rem;
  width: 50px;
  margin-bottom: 15px;
  opacity: 0.6;
}

.empty-state p {
  margin: 0;
  font-style: italic;
  font-size: 1rem;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
}

.task-item {
  background: rgba(255, 255, 255, 0.8);
  padding: 18px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
  flex-wrap: wrap;
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
}

.task-item:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.task-info {
  flex: 1;
  word-wrap: break-word;
  font-size: 0.95rem;
  line-height: 1.4;
  color: #334155;
}

.task-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.question-btn {
  background: linear-gradient(135deg, #fef08a 0%, #fef3c7 100%);
  color: #92400e;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(254, 240, 138, 0.3);
}

.question-btn:hover {
  background: linear-gradient(135deg, #c3ebfc 0%, #bae6fd 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(195, 235, 252, 0.4);
}

select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

select:hover {
  border-color: #6366f1;
}

select:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
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

.add-task-modal .container {
  width: 100%;
  height: 110%;
}

.modal-content {
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  max-width: 800px;
  width: 90%;
  display: flex;
  flex-direction: column;

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
.clickable-description {
  cursor: pointer;
  transition: color 0.2s ease;
}

.clickable-description:hover {
  color: #6366f1;
  text-decoration: underline;
}

.task-modal {
  max-width: 600px;
  width: 90%;
}

.task-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.task-modal-header h3 {
  margin: 0;
  color: #1e293b;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
}

.close-btn:hover {
  color: #ef4444;
}

.task-modal-content {
  line-height: 1.6;
}

.task-modal-content p {
  margin-bottom: 15px;
}

.full-description {
  background: #f8fafc;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #6366f1;
  min-height: 100px;
  max-height: 300px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }

  .bento-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .task-item {
    flex-direction: column;
  }

  .wide-input,
  .wide-button {
    width: 100%;
  }

  .bento-card {
    min-height: 250px;
    padding: 20px;
  }

  .bento-header h3 {
    font-size: 1.2rem;
  }

  .task-item {
    padding: 15px;
  }

  .task-actions {
    justify-content: center;
    width: 100%;
  }
  .add-task {
    width: 90%;
  }
  .wide-button {
    max-width: 90%;
  }
}

@media (max-width: 480px) {
  .todo-container {
    padding: 15px;
  }
  .add-task {
    width: 90%;
  }
  .wide-button {
    max-width: 90%;
  }
  .bento-grid {
    gap: 15px;
  }

  .bento-card {
    padding: 15px;
    min-height: 200px;
  }

  .wide-input,
  .wide-button {
    width: 100%;
  }
}
</style>
