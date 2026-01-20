<template>
  <div class="messages-list">
    <div class="info">
      <div v-if="selectedMessage" class="message-item">
        <div style="display: flex; justify-content: space-between">
          <div>
            <strong>Auteur :</strong>
            {{ selectedMessage.author?.nom || "Inconnu" }}
          </div>
          <button @click="closeInfo" class="closeInfo">✕</button>
        </div>

        <p><strong>Question :</strong> {{ selectedMessage.content }}</p>
        <div>
          <strong>Tâche liée :</strong>
          {{ selectedMessage.task?.task }}<br />

          <div
            style="text-align: center; display: flex; flex-direction: column"
          >
            <strong>Description</strong>
            <label
              style="color: #4a148c; margin-top: 10px"
              v-html="selectedMessage.task?.description"
            ></label>
          </div>
        </div>
        <p v-if="selectedMessage.replyBy">
          <strong class="redo">Réponse Admin :</strong>
          {{ selectedMessage.replyBy.nom }}
        </p>
      </div>
    </div>

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

    <div v-if="loading" class="loading-message">
      <div><img src="/load.jpg" alt="" /></div>
      Chargement des messages...
    </div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="!messages || messages.length === 0" class="empty-message">
      Aucun message trouvé
    </div>

    <div v-else class="messages-container" @click="closeAllMenus">
      <div
        v-for="(msg, index) in messages"
        :key="msg.id || index"
        class="message-item"
        @click.stop
      >
        <div style="display: flex; justify-content: space-between">
          <div>
            <strong>Auteur :</strong> {{ msg.author?.nom || "Inconnu" }}
            <small style="color: #999; font-size: 0.7rem"
              >(Index: {{ index }}, ID: {{ msg.id }})</small
            >
          </div>
          <div style="position: relative">
            <button
              @click.stop="toggleReplyOption(index)"
              :class="[
                'toggle-button',
                { active: showReplyOptionFor === index },
              ]"
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

            <div v-if="showReplyOptionFor === index" class="reply-option">
              <button
                @click.stop="openReplyModal(msg)"
                class="reply-option-button"
              >
                Répondre ?
              </button>
              <button
                @click.stop="openInfotoggle(msg)"
                class="reply-option-button"
              >
                Details <Info class="detaills-Icon" />
              </button>
            </div>
          </div>
        </div>

        <p><strong>Question :</strong> {{ msg.content }}</p>
        <div>
          <strong>Tâche liée :</strong>
          {{ msg.task?.task }}<br />

          <div>
            <strong>Description : </strong>
            <label
              style="color: #a1abb9; margin-bottom: 10px"
              v-html="truncateText(msg.task?.description, 74)"
            ></label>
          </div>

          <br />
          <!-- <strong style="margin-left: 2px; color: #005b47"
            >ID : {{ msg.taskId }}</strong
          > -->
        </div>
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
const selectedMessage = ref(null);

const store = useAdminStore();
const { users, messages, loading, error } = storeToRefs(store);

const selectedUserId = ref("");
const replyContent = ref("");
const showReplyOptionFor = ref(null);
const showModal = ref(false);
const replyToMessage = ref(null);

onMounted(async () => {
  await store.fetchMessages();
});

const onUserChange = () => {
  store.fetchMessages(selectedUserId.value || null);
};

const toggleReplyOption = (index) => {
  console.log("Toggle clicked for index:", index);
  console.log("Current showReplyOptionFor:", showReplyOptionFor.value);

  // Fermer tous les autres menus d'abord
  if (showReplyOptionFor.value === index) {
    showReplyOptionFor.value = null;
    console.log("Closing menu for index:", index);
  } else {
    showReplyOptionFor.value = index;
    console.log("Opening menu for index:", index);
  }
};

const openReplyModal = (msg) => {
  replyToMessage.value = msg;
  replyContent.value = "";
  showReplyOptionFor.value = null; // Fermer le menu toggle
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  replyToMessage.value = null;
  replyContent.value = "";
};

const openInfotoggle = (msg) => {
  selectedMessage.value = msg;
  showReplyOptionFor.value = null; // Fermer le menu toggle
  const infoElement = document.getElementsByClassName("info")[0];
  if (infoElement) {
    infoElement.style.display = "flex";
  }
  console.log(msg);
};

// Fonction pour fermer le menu quand on clique ailleurs
const closeAllMenus = () => {
  showReplyOptionFor.value = null;
};
const closeInfo = () => {
  const infoElement = document.getElementsByClassName("info")[0];
  if (infoElement) {
    infoElement.style.display = "none";
  }
  selectedMessage.value = null;
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
// cette fonction est celle que j'afais mais de facon simple
// vue quelle n'est plus adapter bien quelle work je met celle
// du dessus
// const truncateText = (text) => {
//   if (!text) return "";
//   if (text.length > 74) {
//     return text.substring(0, 74) + "...";
//   }
//   return text;
// };
const truncateText = (htmlText) => {
  if (!htmlText) return "";

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlText;
  const textOnly = tempDiv.textContent || tempDiv.innerText || "";

  if (textOnly.length <= 74) {
    return htmlText;
  }

  const truncatedText = textOnly.substring(0, 74) + "...";

  return `<span style="color: #a1abb9;">${truncatedText}</span>`;
};
</script>

<style scoped>
.info {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
  flex-direction: column;
  background-color: #ffffff;
  border: 1px solid rgb(0, 0, 0);
  border-radius: 10px;
  padding: 20px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.info-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
}
.info label {
  color: rgb(0, 0, 0);
  margin: 8px;
}
.closeInfo {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  transition: 0.1s ease;
}
.closeInfo:hover {
  color: red;
}
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

.toggle-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.toggle-button:hover {
  background-color: #f3f4f6;
}

.toggle-button.active {
  background-color: #e0f2fe;
  color: #0369a1;
}

.reply-option {
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  min-width: 120px;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reply-option-button {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  white-space: nowrap;
  font-size: 0.85rem;
  transition: background-color 0.2s ease;
}

.reply-option-button:hover {
  background-color: #f0f9ff;
}

.reply-option-button:first-child:hover {
  background-color: #ecfdf5;
}

.reply-option-button:last-child:hover {
  background-color: #fef3c7;
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
.loading-message img {
  width: 100px;
  height: 115px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}
</style>
