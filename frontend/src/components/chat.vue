<template>
  <div class="messages-list">
    <h3>Mes messages</h3>

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
import { onMounted } from "vue";
import { useAdminStore } from "../store/admin.service";
import { storeToRefs } from "pinia";

const store = useAdminStore();
const { messages, loading, error } = storeToRefs(store);

// Tu peux rendre `user_id` dynamique plus tard


onMounted(() => {
  store.fetchMessages();
});
</script>

<style scoped>
.messages-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
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
