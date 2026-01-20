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
          <span class="actions-container">
            <button @click="editUser(user)" class="edit-button">
              Modifier
            </button>
            <button @click="confirmDelete(user.user_id)" class="delete-button">
              Supprimer
            </button>
          </span>
        </div>
      </div>
    </div>

    <!-- Modal de modification d'utilisateur -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <h3>Modifier l'utilisateur</h3>
        <div class="form-group">
          <label>Nom :</label>
          <input v-model="editForm.nom" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label>Email :</label>
          <input v-model="editForm.mail" type="email" class="form-input" />
        </div>
        <div class="modal-actions">
          <button @click="closeEditModal" class="cancel-button">Annuler</button>
          <button
            @click="saveUserChanges"
            class="save-button"
            :disabled="loadingEdit"
          >
            {{ loadingEdit ? "Enregistrement..." : "Enregistrer" }}
          </button>
        </div>
        <div v-if="editErrorMessage" class="error-message">
          {{ editErrorMessage }}
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
const showEditModal = ref(false);
const editForm = ref({ nom: "", mail: "", user_id: "" });
const loadingEdit = ref(false);
const editErrorMessage = ref("");

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

const editUser = (user) => {
  editForm.value = {
    nom: user.nom,
    mail: user.mail,
    user_id: user.user_id,
  };
  editErrorMessage.value = "";
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editForm.value = { nom: "", mail: "", user_id: "" };
  editErrorMessage.value = "";
};

const saveUserChanges = async () => {
  loadingEdit.value = true;
  editErrorMessage.value = "";

  try {
    const result = await adminStore.updateUser(editForm.value.user_id, {
      nom: editForm.value.nom,
      mail: editForm.value.mail,
    });

    if (result.success) {
      closeEditModal();
      await fetchUsers(); // Rafraîchir la liste
    } else {
      editErrorMessage.value =
        result.error?.message || "Erreur lors de la modification";
    }
  } catch (error) {
    editErrorMessage.value = "Une erreur est survenue";
  } finally {
    loadingEdit.value = false;
  }
};

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
  grid-template-columns: 1fr 1fr 0.5fr 1fr;
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

.actions-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.edit-button {
  padding: 6px 12px;
  background-color: #fae04d;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.edit-button:hover {
  background-color: #fae37d;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  min-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-content h3 {
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button:hover {
  background: #e8e8e8;
}

.save-button {
  padding: 0.75rem 1.5rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-button:hover {
  background: #369970;
}

.save-button:disabled {
  background: #ccc;
  cursor: not-allowed;
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
