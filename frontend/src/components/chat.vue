<template>
  <div class="messages-list">
    <h3>Comments</h3>

    <div class="filter-container">
      <label for="userFilter">Filter by user :</label>
      <select v-model="selectedUserId" @change="onUserChange">
        <option value="">-- Choisir un utilisateur --</option>
        <option v-for="user in users" :key="user.user_id" :value="user.user_id">
          {{ user.nom }} ({{ user.user_id }})
        </option>
      </select>
    </div>

    <div v-if="loading" class="loading-message">Chargement des messages...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="!messages || messages.length === 0" class="empty-message">
      Aucun message trouvé
    </div>

    <div v-else class="messages-container">
      <div v-for="msg in messages" :key="msg.id" class="message-item">
        <div style="display: flex; justify-content: space-between">
          <div>
            <strong>Auteur :</strong> {{ msg.author?.nom || "Inconnu" }}
          </div>
          <div style="position: relative">
            <button
              @click="toggleReplyOption(msg.id)"
              style="background: none; border: none; cursor: pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>

            <div v-if="showReplyOptionFor === msg.id" class="reply-option">
              <button @click="openReplyModal(msg)" class="reply-option-button">
                Répondre ?
              </button>
              <button @click="tired()" class="reply-option-button">
                Details <Info class="detaills-Icon" />
              </button>
            </div>
          </div>
        </div>

        <p><strong>Contenu :</strong> {{ msg.content }}</p>
        <p>
          <strong>Tâche liée :</strong>
          {{ msg.task?.task }}<br />

          <label
            style="color: #a1abb9; margin-bottom: 10px"
            v-html="msg.task?.description"
          ></label>
          <br />
          <!-- <strong style="margin-left: 2px; color: #005b47"
            >ID : {{ msg.taskId }}</strong
          > -->
        </p>
        <p v-if="msg.replyBy">
          <strong class="redo">Réponse de :</strong> {{ msg.replyBy.nom }}
        </p>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h4>Répondre à ce commentaire</h4>
        <textarea
          v-model="replyContent"
          rows="4"
          placeholder="Écrire votre réponse..."
        ></textarea>
        <div class="modal-actions">
          <button class="cancel-btn" @click="closeModal">Annuler</button>
          <button class="send-btn" @click="sendReply">Envoyer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAdminStore } from "../store/admin.service";
import { storeToRefs } from "pinia";
import { Info } from "lucide-vue-next";

const store = useAdminStore();
const { users, messages, loading, error } = storeToRefs(store);

const selectedUserId = ref("");
const replyContent = ref("");
const showReplyOptionFor = ref(null);
const showModal = ref(false);
const replyToMessage = ref(null);
const tired = async () => {
  alert("la suppression n'est pas disponible !");
};
onMounted(async () => {
  await store.fetchMessages();
});

const onUserChange = () => {
  store.fetchMessages(selectedUserId.value || null);
};

const toggleReplyOption = (id) => {
  showReplyOptionFor.value = showReplyOptionFor.value === id ? null : id;
};

const openReplyModal = (msg) => {
  replyToMessage.value = msg;
  replyContent.value = "";
  showReplyOptionFor.value = null;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  replyToMessage.value = null;
  replyContent.value = "";
};

const sendReply = async () => {
  if (!replyContent.value.trim()) return;

  try {
    await store.sendReply({
      content: replyContent.value,
      replyToId: replyToMessage.value.id,
      taskId: replyToMessage.value.taskId || null,
    });

    replyContent.value = "";
    showModal.value = false;
    replyToMessage.value = null;
    await store.fetchMessages(selectedUserId.value || null);
  } catch (err) {
    console.error("Erreur lors de l'envoi de la réponse :", err);
  }
};
</script>

<style scoped>
.detaills-Icon {
  color: rgba(94, 94, 94, 0.637);
  height: 15px;
  width: 15px;
  margin-left: 5px;
  
}
.messages-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
}

.filter-container {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-container select {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.messages-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.message-item {
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fff;
  transition: background-color 0.3s;
  font-size: 0.85rem;
  position: relative;
}

.message-item:hover {
  background-color: #f8f9fa;
}

.error-message {
  color: #dc3545;
  padding: 10px;
  text-align: center;
}

.empty-message {
  color: #6c757d;
  padding: 10px;
  text-align: center;
}

.loading-message {
  text-align: center;
  padding: 10px;
  font-weight: 500;
}

.redo {
  color: #005b47;
  font-weight: bold;
}

.reply-option {
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border: 1px solid #eee;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.reply-option-button {
  display: flex;
  padding: 6px 12px;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  white-space: nowrap;
}

.reply-option-button:hover {
  background-color: #f5f5f5;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.modal-content h4 {
  margin-top: 0;
  margin-bottom: 10px;
}

.modal-content textarea {
  width: 96%;
  height: 100px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  resize: none;
}

.modal-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn {
  padding: 6px 12px;
  border: none;
  background: #ff4444;
  color: rgb(255, 255, 255);
  border-radius: 6px;
  cursor: pointer;
}
.cancel-btn:hover {
  background: #cc0000;
  color: rgb(255, 255, 255);
  transition: 0.1s ease-in;
}

.send-btn {
  padding: 6px 12px;
  border: none;
  background: #005b47;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}
.send-btn:hover {
  background: #fae04d;
  color: rgb(0, 0, 0);
  transition: 0.1s ease-in;
}
</style>
