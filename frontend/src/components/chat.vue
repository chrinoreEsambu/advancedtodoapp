<template>
  <div class="messages-list">
    <h3>Mes messages</h3>

    <div class="filter-container">
      <label for="userFilter">Filtrer par utilisateur :</label>
      <select v-model="selectedUserId" @change="onUserChange">
        <option value="">-- Choisir un utilisateur --</option>
        <option v-for="user in users" :key="user.user_id" :value="user.user_id">
          {{ user.nom }} ({{ user.user_id.slice(0, 5) }})
        </option>
      </select>
    </div>

    <div v-if="loading" class="loading-message">Chargement des messages...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="!messages || messages.length === 0" class="empty-message">
      Aucun message trouvé
    </div>

    <div v-else class="messages-container">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="message-item"
      >
        <p><strong>Auteur :</strong> {{ msg.author?.nom || "Inconnu" }}</p>
        <p><strong>Contenu :</strong> {{ msg.content }}</p>
        <p><strong>Tâche liée :</strong> {{ msg.taskId }}</p>
        <p v-if="msg.replyBy">
          <strong class="redo">Réponse de :</strong> {{ msg.replyBy.nom }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAdminStore } from "../store/admin.service";
import { storeToRefs } from "pinia";

const store = useAdminStore();
const { users, messages, loading, error } = storeToRefs(store);

const selectedUserId = ref("");

onMounted(async () => {
  await store.fetchAllUsers();
});

const onUserChange = () => {
  if (selectedUserId.value) {
    store.fetchMessages(selectedUserId.value);
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
