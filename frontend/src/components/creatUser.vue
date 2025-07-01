<template>
  <div class="users-management">
    <h2>List of Users</h2>

    <button @click="fetchUsers" class="refresh-button">Rafraîchir</button>

    <div v-if="loadingUsers" class="loading">Chargement en cours...</div>

    <div v-else class="users-list">
      <div v-if="users.length === 0" class="empty">
        Aucun utilisateur trouvé
      </div>

      <div v-else>
        <div class="user-item header">
          <span>Nom</span>
          <span>Email</span>
          <span>Rôle</span>
        </div>

        <div v-for="user in users" :key="user.user_id" class="user-item">
          <span>{{ user.nom }}</span>
          <span>{{ user.mail }}</span>
          <span :class="user.role">{{ user.role }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAdminStore } from "../store/admin.service";
import { onMounted } from "vue";

const adminStore = useAdminStore();
const { users, loadingUsers } = storeToRefs(adminStore);

const fetchUsers = async () => {
  await adminStore.fetchUsers();
};

onMounted(fetchUsers);
</script>

<style scoped>
.users-management {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

.refresh-button {
  display: block;
  margin: 0 auto 20px;
  padding: 8px 16px;
  background-color: #fae04d;
  color: black;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.refresh-button:hover {
  background-color: #fae37d;
}

.loading,
.empty {
  text-align: center;
  padding: 20px;
  color: #666;
}

.user-item {
  display: grid;
  grid-template-columns: 1fr 1fr 0.5fr;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.user-item.header {
  font-weight: bold;
  background-color: #f5f5f5;
}

.user-item span.admin {
  color: #42b983;
  font-weight: 500;
}

.user-item span.users {
  color: #666;
}

@media (max-width: 600px) {
  .user-item {
    grid-template-columns: 1fr;
    gap: 5px;
  }

  .user-item.header {
    display: none;
  }

  .user-item span::before {
    content: attr(data-label);
    font-weight: bold;
    margin-right: 10px;
  }
}
</style>
