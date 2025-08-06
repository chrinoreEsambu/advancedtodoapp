<template>
  <div class="messages-list">
    <h3>Mes messages</h3>

    <!-- FILTRE -->
    <div class="filter-container">
      <label for="userFilter">Filtrer par utilisateur :</label>
      <select v-model="selectedUserId" @change="onUserChange">
        <option value="">-- Choisir un utilisateur --</option>
        <option v-for="user in users" :key="user.user_id" :value="user.user_id">
          {{ user.nom }} ({{ user.user_id }})
        </option>
      </select>
    </div>

    <!-- ÉTAT -->
    <div v-if="loading" class="loading-message">Chargement des messages...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="!messages || messages.length === 0" class="empty-message">
      Aucun message trouvé
    </div>

    <!-- MESSAGES -->
    <div v-else class="messages-container">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="message-item"
      >
        <!-- Menu Répondre -->
        <div style="display: flex; justify-content: space-between;">
          <div><strong>Auteur :</strong> {{ msg.author?.nom || "Inconnu" }}</div>
          <button @click="toggleReply(msg)" style="background: none; border: none; cursor: pointer;">
            <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-ellipsis-vertical" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </button>
        </div>

        <p><strong>Contenu :</strong> {{ msg.content }}</p>
        <p><strong>Tâche liée :</strong> {{ msg.taskId }}</p>
        <p v-if="msg.replyBy">
          <strong class="redo">Réponse de :</strong> {{ msg.replyBy.nom }}
        </p>

        <!-- Boîte de réponse -->
        <div v-if="activeReply && activeReply.id === msg" style="margin-top: 10px;">
          <textarea v-model="replyContent" rows="2" style="width: 100%; border-radius: 6px; padding: 6px; border: 1px solid #ccc;" placeholder="Écrire une réponse..."></textarea>
          <button @click="sendReply(msg)" style="margin-top: 5px; padding: 6px 12px; border: none; border-radius: 6px; background-color: #005b47; color: white; cursor: pointer;">
            Envoyer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAdminStore } from "../store/admin.service";
import { storeToRefs } from "pinia";
import axios from "axios";

const store = useAdminStore();
const { users, messages, loading, error } = storeToRefs(store);

const selectedUserId = ref("");
const replyContent = ref("");
const activeReply = ref(null); // stocke l’élément activé

const onUserChange = () => {
  store.fetchMessages(selectedUserId.value || null);
};

onMounted(async () => {
  // await store.fetchAllUsers();
  await store.fetchMessages();
});

// toggle affichage de la zone de réponse
const toggleReply = (msg) => {
  if (activeReply.value === msg) {
    activeReply.value = null;
  } else {
    activeReply.value = msg;
    replyContent.value = "";
  }
};

// fonction d'envoi de la réponse
const sendReply = async (msg) => {
  if (!replyContent.value.trim()) return;

  try {
    const response = await axios.post("/api/sendMessage", {
      content: replyContent.value,
      replyToId: msg.id,
      taskId: msg.taskId || null,
    }, {
      withCredentials: true,
    });

    replyContent.value = "";
    activeReply.value = null;
    await store.fetchMessages(selectedUserId.value || null); // recharger les messages

  } catch (err) {
    console.error("Erreur lors de l'envoi de la réponse :", err);
  }
};
</script>

<style scoped>
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
</style>
