<template>
  <div class="users-management">
    <h2>Gestion des Utilisateurs</h2>

    <button @click="fetchUsers" class="action-button">
      Rafraîchir la liste
    </button>

    <div v-if="loadingUsers" class="status-message">Chargement en cours...</div>

    <div v-else>
      <div v-if="users.length === 0" class="status-message">
        Aucun utilisateur trouvé
      </div>

      <div v-else class="users-list">
        <div class="user-item header">
          <span>Nom</span>
          <span>Email</span>
          <span>Rôle</span>
          <span>Actions</span>
        </div>

        <div v-for="user in users" :key="user.user_id" class="user-item">
          <span>{{ user.nom }}</span>
          <span>{{ user.mail }}</span>
          <span :class="user.role">{{ user.role }}</span>
          <span>
            <button @click="confirmDelete(user.user_id)" class="delete-button">
              Supprimer
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAdminStore } from "../store/admin.service";
import { onMounted, ref } from "vue";

const adminStore = useAdminStore();
const { users, loadingUsers } = storeToRefs(adminStore);
const errorMessage = ref("");

const fetchUsers = async () => {
  errorMessage.value = "";
  await adminStore.fetchUsers();
};

const confirmDelete = (userId) => {
  if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
    deleteUser(userId);
  }
};

const deleteUser = async (userId) => {
  errorMessage.value = "";
  const result = await adminStore.deleteUser(userId);

  if (!result.success) {
    errorMessage.value = result.error;
  }
};

// Chargement initial
onMounted(fetchUsers);
</script>

<style scoped>
.users-management {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  color: #333;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 700;
}

.action-button {
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

.action-button:hover {
  background-color: #fae37d;
}

.status-message {
  text-align: center;
  padding: 20px;
  color: #666;
}

.users-list {
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.user-item {
  display: grid;
  grid-template-columns: 1fr 1fr 0.5fr 0.5fr;
  padding: 12px;
  align-items: center;
}

.user-item.header {
  font-weight: bold;
  background-color: #f5f5f5;
}

.user-item:not(.header):nth-child(even) {
  background-color: #f9f9f9;
}

.user-item span.admin {
  color: #42b983;
  font-weight: 500;
}

.user-item span.users {
  color: #666;
}

.delete-button {
  padding: 6px 12px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.delete-button:hover {
  background-color: #cc0000;
}

.error-message {
  color: #ff4444;
  text-align: center;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .user-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .user-item.header {
    display: none;
  }

  .user-item span::before {
    content: attr(data-label);
    font-weight: bold;
    margin-right: 8px;
  }
}
</style>
