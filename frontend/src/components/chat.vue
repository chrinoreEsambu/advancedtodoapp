<template>
  <div class="message-container">
    <h2>Mes messages</h2>

    <div v-if="loading">Chargement...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div v-if="messages.length === 0">Aucun message trouvé.</div>
      <ul>
        <li v-for="(msg, index) in messages" :key="index" class="message-item">
          <p><strong>Auteur :</strong> {{ msg.author.nom }}</p>
          <p><strong>Contenu :</strong> {{ msg.content }}</p>
          <p><strong>Assigné à la tâche :</strong> {{ msg.taskId }}</p>
          <p v-if="msg.replyBy"><strong>Réponse de :</strong> {{ msg.replyBy.nom }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAdminStore } from "../store/admin.service";

const store = useAdminStore()

onMounted(() => {
  store.fetchMyMessages()
})

const { messages, loading, error } = store
</script>

<style scoped>
.message-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  font-family: sans-serif;
}

.message-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 12px;
  background-color: #f9f9f9;
}
</style>
