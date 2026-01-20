<template>
  <div class="bento-grid">
    <div class="item item-billboard">
      <div class="bento-header">
        <h1>Inprogress</h1>
        <div class="pagination-controls">
          <button
            @click="prevPage('inprogress')"
            :disabled="currentPages.inprogress === 1"
          >
            ←
          </button>
          <span>Page {{ currentPages.inprogress }}</span>
          <button
            @click="nextPage('inprogress')"
            :disabled="currentPages.inprogress * 4 >= filteredInProgress.length"
          >
            →
          </button>
        </div>
      </div>
      <ul>
        <li
          v-for="task in paginatedInProgress"
          :key="task.task_id"
          class="task-item"
        >
          <div class="task-content">
            <div class="task-header">
              <h3>{{ task.task }}</h3>
              <div class="task-actions-menu">
                <button
                  @click.stop="toggleTaskActions(task.task_id)"
                  class="actions-toggle-btn"
                  :class="{ active: showActionsFor === task.task_id }"
                >
                  <MoreVertical :size="18" />
                </button>

                <div
                  v-if="showActionsFor === task.task_id"
                  class="actions-dropdown"
                >
                  <button
                    @click="openCommentModal(task)"
                    class="action-item comment-action"
                  >
                    <MessageSquare :size="16" />
                    Commentaire
                  </button>
                  <button
                    @click="deleteTask(task.task_id)"
                    class="action-item delete-action"
                  >
                    <Trash2 :size="16" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>

            <span :class="['badge', task.taskState.toLowerCase()]">{{
              task.taskState
            }}</span>
          </div>
        </li>
      </ul>
    </div>

    <div class="item item-tote">
      <div class="bento-header">
        <h1>Todo</h1>
        <div class="pagination-controls">
          <button @click="prevPage('todo')" :disabled="currentPages.todo === 1">
            ←
          </button>
          <span>Page {{ currentPages.todo }}</span>
          <button
            @click="nextPage('todo')"
            :disabled="currentPages.todo * 4 >= filteredTodo.length"
          >
            →
          </button>
        </div>
      </div>
      <ul>
        <li v-for="task in paginatedTodo" :key="task.task_id">
          {{ task.task }}
          <span :class="['badge', task.taskState.toLowerCase()]">{{
            task.taskState
          }}</span>
        </li>
      </ul>
    </div>

    <div class="item item-logo item-request">
      <div class="bento-header">
        <div class="request-header">
          <h1>Request</h1>
          <div class="user-filter">
            <select v-model="selectedUser" @change="resetRequestPage()">
              <option value="">Tous les utilisateurs</option>
              <option
                v-for="user in allUsers"
                :key="user.user_id"
                :value="user.user_id"
              >
                {{ user.user_id }} - {{ user.nom }} ({{ user.mail }})
              </option>
            </select>
          </div>
        </div>
        <div class="pagination-controls">
          <button
            @click="prevPage('request')"
            :disabled="currentPages.request === 1"
          >
            ←
          </button>
          <span>Page {{ currentPages.request }}</span>
          <button
            @click="nextPage('request')"
            :disabled="currentPages.request * 4 >= filteredRequest.length"
          >
            →
          </button>
        </div>
      </div>
      <ul>
        <li
          v-for="task in paginatedRequest"
          :key="task.task_id"
          class="request-item"
        >
          <span>{{ task.task }}</span>
          <span
            style="color: #a1abb9; font-size: 0.85rem"
            v-html="task.description"
          ></span>

          <div class="request-controls">
            <div class="task-actions-menu">
              <button
                @click.stop="toggleTaskActions(task.task_id)"
                class="actions-toggle-btn"
                :class="{ active: showActionsFor === task.task_id }"
              >
                <MoreVertical :size="18" />
              </button>

              <div
                v-if="showActionsFor === task.task_id"
                class="actions-dropdown"
              >
                <button
                  @click="openCommentModal(task)"
                  class="action-item comment-action"
                >
                  <MessageSquare :size="16" />
                  Commentaire
                </button>
                <button
                  @click="deleteTask(task.task_id)"
                  class="action-item delete-action"
                >
                  <Trash2 :size="16" />
                  Supprimer
                </button>
              </div>
            </div>

            <span :class="['badge', task.taskState.toLowerCase()]">{{
              task.taskState
            }}</span>
            <span class="for">for: {{ getUserInfo(task.assigneeId) }}</span>
            <select
              v-model="task.taskState"
              @change="adminChangeState(task)"
              :disabled="task.taskState === 'done'"
            >
              <optgroup label="States">
                <option value="inprogress">inprogress</option>
                <option value="todo">todo</option>
                <option value="request">request</option>
                <option value="accepted">accepted</option>
                <option value="done" style="color: #314158">done</option>
                <option value="denied" style="color: red">denied</option>
              </optgroup>
            </select>
          </div>
        </li>
      </ul>
    </div>

    <div class="item item-badge">
      <div class="bento-header">
        <h1>Accepted</h1>
        <div class="pagination-controls">
          <button
            @click="prevPage('accepted')"
            :disabled="currentPages.accepted === 1"
          >
            ←
          </button>
          <span>Page {{ currentPages.accepted }}</span>
          <button
            @click="nextPage('accepted')"
            :disabled="currentPages.accepted * 3 >= filteredAccepted.length"
          >
            →
          </button>
        </div>
      </div>
      <ul>
        <li
          v-for="task in paginatedAccepted"
          :key="task.task_id"
          class="task-item"
        >
          <div class="task-content">
            <div class="task-header">
              <h3>{{ task.task }}</h3>
              <div class="task-actions-menu">
                <button
                  @click.stop="toggleTaskActions(task.task_id)"
                  class="actions-toggle-btn"
                  :class="{ active: showActionsFor === task.task_id }"
                >
                  <MoreVertical :size="18" />
                </button>

                <div
                  v-if="showActionsFor === task.task_id"
                  class="actions-dropdown"
                >
                  <button
                    @click="openCommentModal(task)"
                    class="action-item comment-action"
                  >
                    <MessageSquare :size="16" />
                    Commentaire
                  </button>
                  <button
                    @click="deleteTask(task.task_id)"
                    class="action-item delete-action"
                  >
                    <Trash2 :size="16" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>

            <span :class="['badge', task.taskState.toLowerCase()]">{{
              task.taskState
            }}</span>
          </div>
        </li>
      </ul>
    </div>

    <div class="item item-shirt">
      <div class="bento-header">
        <h1>Done</h1>
        <div class="pagination-controls">
          <button @click="prevPage('done')" :disabled="currentPages.done === 1">
            ←
          </button>
          <span>Page {{ currentPages.done }}</span>
          <button
            @click="nextPage('done')"
            :disabled="currentPages.done * 3 >= filteredDone.length"
          >
            →
          </button>
        </div>
      </div>
      <ul>
        <li v-for="task in paginatedDone" :key="task.task_id" class="task-item">
          <div class="task-content">
            <div class="task-header">
              <h3>{{ task.task }}</h3>
              <div class="task-actions-menu">
                <button
                  @click.stop="toggleTaskActions(task.task_id)"
                  class="actions-toggle-btn"
                  :class="{ active: showActionsFor === task.task_id }"
                >
                  <MoreVertical :size="18" />
                </button>

                <div
                  v-if="showActionsFor === task.task_id"
                  class="actions-dropdown"
                >
                  <button
                    @click="openCommentModal(task)"
                    class="action-item comment-action"
                  >
                    <MessageSquare :size="16" />
                    Commentaire
                  </button>
                  <button
                    @click="deleteTask(task.task_id)"
                    class="action-item delete-action"
                  >
                    <Trash2 :size="16" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>

            <span :class="['badge', task.taskState.toLowerCase()]">{{
              task.taskState
            }}</span>
          </div>
        </li>
      </ul>
    </div>

    <div class="item item-mobile">
      <div class="bento-header">
        <h1>Denied</h1>
        <div class="pagination-controls">
          <button
            @click="prevPage('denied')"
            :disabled="currentPages.denied === 1"
          >
            ←
          </button>
          <span>Page {{ currentPages.denied }}</span>
          <button
            @click="nextPage('denied')"
            :disabled="currentPages.denied * 3 >= filteredDenied.length"
          >
            →
          </button>
        </div>
      </div>
      <ul>
        <li
          v-for="task in paginatedDenied"
          :key="task.task_id"
          class="task-item"
        >
          <div class="task-content">
            <div class="task-header">
              <h3>{{ task.task }}</h3>
              <div class="task-actions-menu">
                <button
                  @click.stop="toggleTaskActions(task.task_id)"
                  class="actions-toggle-btn"
                  :class="{ active: showActionsFor === task.task_id }"
                >
                  <MoreVertical :size="18" />
                </button>

                <div
                  v-if="showActionsFor === task.task_id"
                  class="actions-dropdown"
                >
                  <button
                    @click="openCommentModal(task)"
                    class="action-item comment-action"
                  >
                    <MessageSquare :size="16" />
                    Commentaire
                  </button>
                  <button
                    @click="deleteTask(task.task_id)"
                    class="action-item delete-action"
                  >
                    <Trash2 :size="16" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>

            <span :class="['badge', task.taskState.toLowerCase()]">{{
              task.taskState
            }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <!-- Modal de commentaire -->
  <div
    v-if="showCommentModal"
    class="modal-overlay"
    @click.self="closeCommentModal"
  >
    <div class="modal-content">
      <div class="modal-header">
        <h3>Ajouter un commentaire</h3>
        <button @click="closeCommentModal" class="close-btn">✕</button>
      </div>

      <div class="modal-body">
        <div class="task-info">
          <p><strong>Tâche :</strong> {{ selectedTaskForComment?.task }}</p>
          <p>
            <strong>Utilisateur :</strong>
            {{ getUserInfo(selectedTaskForComment?.assigneeId) }}
          </p>
        </div>

        <div class="comment-form">
          <label for="comment">Votre commentaire :</label>
          <textarea
            id="comment"
            v-model="commentText"
            placeholder="Entrez votre commentaire ici..."
            rows="4"
            class="comment-textarea"
          ></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="closeCommentModal" class="btn-cancel">Annuler</button>
        <button
          @click="submitComment"
          class="btn-submit"
          :disabled="!commentText.trim() || isSubmittingComment"
        >
          {{ isSubmittingComment ? "Envoi..." : "Envoyer" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useAdminStore } from "../store/admin.service";
import { Trash2, MoreVertical, MessageSquare } from "lucide-vue-next";

const adminStore = useAdminStore();

const tachesTodo = ref([]);
const tachesInProgress = ref([]);
const tachesAccepted = ref([]);
const tachesDenied = ref([]);
const tachesDone = ref([]);
const tachesRequest = ref([]);
const allUsers = ref([]);
const selectedUser = ref("");

// Variables pour la gestion des actions et commentaires
const showActionsFor = ref(null);
const showCommentModal = ref(false);
const selectedTaskForComment = ref(null);
const commentText = ref("");
const isSubmittingComment = ref(false);

const currentPages = ref({
  todo: 1,
  inprogress: 1,
  request: 1,
  accepted: 1,
  done: 1,
  denied: 1,
});

const pageSizes = {
  todo: 8,
  inprogress: 4,
  request: 4,
  accepted: 3,
  done: 3,
  denied: 3,
};

const getUserInfo = (userId) => {
  const user = allUsers.value.find((u) => u.user_id === userId);
  return user ? `${user.user_id} - ${user.nom} (${user.mail})` : userId;
};

const nextPage = (type) => {
  currentPages.value[type]++;
};

const prevPage = (type) => {
  if (currentPages.value[type] > 1) {
    currentPages.value[type]--;
  }
};

const resetRequestPage = () => {
  currentPages.value.request = 1;
};

const paginate = (data, type) => {
  const pageSize = pageSizes[type];
  const startIndex = (currentPages.value[type] - 1) * pageSize;
  return data.slice(startIndex, startIndex + pageSize);
};

const filteredTodo = computed(() => tachesTodo.value);
const filteredInProgress = computed(() => tachesInProgress.value);
const filteredRequest = computed(() => {
  if (!selectedUser.value) return tachesRequest.value;
  return tachesRequest.value.filter(
    (task) => task.assigneeId === selectedUser.value,
  );
});
const filteredAccepted = computed(() => tachesAccepted.value);
const filteredDone = computed(() => tachesDone.value);
const filteredDenied = computed(() => tachesDenied.value);

const paginatedTodo = computed(() => paginate(filteredTodo.value, "todo"));
const paginatedInProgress = computed(() =>
  paginate(filteredInProgress.value, "inprogress"),
);
const paginatedRequest = computed(() =>
  paginate(filteredRequest.value, "request"),
);
const paginatedAccepted = computed(() =>
  paginate(filteredAccepted.value, "accepted"),
);
const paginatedDone = computed(() => paginate(filteredDone.value, "done"));
const paginatedDenied = computed(() =>
  paginate(filteredDenied.value, "denied"),
);

const fetchtaches = async () => {
  try {
    const usersResponse = await adminStore.fetchUsers();
    allUsers.value = adminStore.users || [];

    await adminStore.fetchStateTask();

    tachesTodo.value = adminStore.tache[0] || [];
    tachesInProgress.value = adminStore.tache[1] || [];
    tachesDenied.value = adminStore.tache[2] || [];
    tachesAccepted.value = adminStore.tache[3] || [];
    tachesDone.value = adminStore.tache[4] || [];
    tachesRequest.value = adminStore.tache[5] || [];
  } catch (error) {
    console.error("Erreur de chargement des tâches :", error);
  }
};

onMounted(() => {
  fetchtaches();

  // Fermer le menu d'actions quand on clique ailleurs
  document.addEventListener("click", handleClickOutside);
});

// Nettoyer l'event listener quand le composant est détruit
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Fonction pour fermer le menu d'actions quand on clique ailleurs
const handleClickOutside = () => {
  showActionsFor.value = null;
};

const adminChangeState = async (task) => {
  await adminStore.submitTasksState(task.task_id, task.taskState);
  fetchtaches();
};

const deleteTask = async (taskId) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
    try {
      const result = await adminStore.deleteTask(taskId);
      if (result.success) {
        alert("Tâche supprimée avec succès");
        fetchtaches(); // Rafraîchir la liste des tâches
      } else {
        alert(result.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      alert("Une erreur est survenue lors de la suppression");
      console.error("Erreur de suppression:", error);
    }
  }
  showActionsFor.value = null; // Fermer le menu
};

// Fonctions pour gérer le toggle du menu d'actions
const toggleTaskActions = (taskId) => {
  if (showActionsFor.value === taskId) {
    showActionsFor.value = null;
  } else {
    showActionsFor.value = taskId;
  }
};

// Fonctions pour gérer les commentaires
const openCommentModal = (task) => {
  selectedTaskForComment.value = task;
  showCommentModal.value = true;
  showActionsFor.value = null; // Fermer le menu d'actions
  commentText.value = "";
};

const closeCommentModal = () => {
  showCommentModal.value = false;
  selectedTaskForComment.value = null;
  commentText.value = "";
  isSubmittingComment.value = false;
};

const submitComment = async () => {
  if (!commentText.value.trim()) return;

  isSubmittingComment.value = true;
  try {
    await adminStore.addTaskComment(
      selectedTaskForComment.value.task_id,
      commentText.value,
    );
    closeCommentModal();
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire:", error);
  } finally {
    isSubmittingComment.value = false;
  }
};
</script>

<style scoped>
* {
  list-style: none;
  box-sizing: border-box;
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
body::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
  display: none;
}
optgroup {
  font-weight: bold;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 2rem;
  height: 100vh;
  padding: 1rem;
  background-color: #e6f4f1;
  height: 890px;
}

.bento-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.request-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-filter select {
  min-width: 250px;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-controls button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #000;
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.for {
  background-color: #e9fdfa;
  border-radius: 10px;
  padding: 2px 10px;
  font-size: 14px;
  white-space: nowrap;
}

.item {
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  color: #000;
  padding: 1rem;
  font-family: sans-serif;
  overflow-y: auto;
}

.item-billboard {
  grid-column: span 2;
  background-color: #e1f2fa;
}

.item-tote {
  background-color: #f2fedc;
}

.item-logo {
  grid-column: span 3;
  background-color: #fae37d38;
}

.item-badge {
  background-color: #c3f0e6;
  color: #0a3d36;
}

.item-shirt {
  background-color: #e9fdfa;
  color: #0a3d36;
}

.item-mobile {
  background-color: #b0ebe0;
  color: #0a3d36;
}

h1 {
  font-size: 20px;
  margin-bottom: 0;
  color: #000;
}

ul {
  padding-left: 0;
  margin: 0;
}

li {
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 0.5rem;
  border-radius: 8px;
  color: #222;
}

.request-item {
  flex-direction: column;
  align-items: flex-start;
}

.request-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.25rem;
}

select {
  padding: 0.25rem;
  border-radius: 4px;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
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

.delete-button {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff5757 100%);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
}

.delete-button:hover {
  background: linear-gradient(135deg, #ff5757 0%, #ff4444 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(255, 107, 107, 0.4);
}

.delete-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
}
@media (max-width: 1024px) {
  .bento-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    height: auto;
  }

  .bento-grid > .item {
    grid-column: unset !important;
    grid-row: unset !important;
    width: 100%;
  }

  .bento-header,
  .pagination-controls {
    flex-direction: column;
    align-items: flex-start;
  }

  .user-filter select {
    width: 100%;
  }

  .request-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  li {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* Styles pour les nouveaux éléments de tâche */
.task-item {
  position: relative;
  border-left: 3px solid #13795b;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.task-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.task-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.task-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  flex: 1;
  line-height: 1.3;
}

/* Styles pour le menu d'actions */
.task-actions-menu {
  position: relative;
  display: inline-block;
}

.actions-toggle-btn {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 6px;
  color: #495057;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.actions-toggle-btn:hover {
  background-color: #e9ecef;
  color: #212529;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.actions-toggle-btn.active {
  background-color: #13795b;
  color: white;
  border-color: #13795b;
}

.actions-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 160px;
  overflow: hidden;
}

/* Classe spéciale pour la section Request où le menu doit s'afficher à droite */
.item-request .actions-dropdown {
  right: auto;
  left: 0;
}

.action-item {
  width: 100%;
  background: none;
  border: none;
  padding: 0.85rem 1.2rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #495057;
  font-weight: 500;
}

.action-item:hover {
  background-color: #f8f9fa;
}

.comment-action {
  border-bottom: 1px solid #e2e8f0;
}

.comment-action:hover {
  background-color: #e3f2fd;
  color: #1976d2;
}

.delete-action:hover {
  background-color: #ffebee;
  color: #d32f2f;
}

/* Styles pour le modal de commentaire */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  max-height: 70vh;
  overflow: visible;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f7fafc;
  flex-shrink: 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: #e2e8f0;
  color: #2d3748;
}

.modal-body {
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.task-info {
  background-color: #f7fafc;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #13795b;
}

.task-info p {
  margin: 0.25rem 0;
  color: #4a5568;
}

.comment-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2d3748;
}

.comment-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s ease;
}

.comment-textarea:focus {
  outline: none;
  border-color: #13795b;
  box-shadow: 0 0 0 3px rgba(19, 121, 91, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  background-color: #f7fafc;
  flex-shrink: 0;
}

.btn-cancel,
.btn-submit {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background-color: #e2e8f0;
  color: #4a5568;
}

.btn-cancel:hover {
  background-color: #cbd5e0;
}

.btn-submit {
  background-color: #13795b;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background-color: #0e5a43;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
