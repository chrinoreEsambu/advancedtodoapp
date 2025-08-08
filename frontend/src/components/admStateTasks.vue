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
        <li v-for="task in paginatedInProgress" :key="task.task_id">
          {{ task.task }}
          <span :class="['badge', task.taskState.toLowerCase()]">{{
            task.taskState
          }}</span>
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

    <div class="item item-logo">
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
          
          <div class="request-controls">
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
        <li v-for="task in paginatedAccepted" :key="task.task_id">
          {{ task.task }}
          <span :class="['badge', task.taskState.toLowerCase()]">{{
            task.taskState
          }}</span>
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
        <li v-for="task in paginatedDone" :key="task.task_id">
          {{ task.task }}
          <span :class="['badge', task.taskState.toLowerCase()]">{{
            task.taskState
          }}</span>
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
        <li v-for="task in paginatedDenied" :key="task.task_id">
          {{ task.task }}
          <span :class="['badge', task.taskState.toLowerCase()]">{{
            task.taskState
          }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAdminStore } from "../store/admin.service";

const adminStore = useAdminStore();

const tachesTodo = ref([]);
const tachesInProgress = ref([]);
const tachesAccepted = ref([]);
const tachesDenied = ref([]);
const tachesDone = ref([]);
const tachesRequest = ref([]);
const allUsers = ref([]);
const selectedUser = ref("");

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
    (task) => task.assigneeId === selectedUser.value
  );
});
const filteredAccepted = computed(() => tachesAccepted.value);
const filteredDone = computed(() => tachesDone.value);
const filteredDenied = computed(() => tachesDenied.value);

const paginatedTodo = computed(() => paginate(filteredTodo.value, "todo"));
const paginatedInProgress = computed(() =>
  paginate(filteredInProgress.value, "inprogress")
);
const paginatedRequest = computed(() =>
  paginate(filteredRequest.value, "request")
);
const paginatedAccepted = computed(() =>
  paginate(filteredAccepted.value, "accepted")
);
const paginatedDone = computed(() => paginate(filteredDone.value, "done"));
const paginatedDenied = computed(() =>
  paginate(filteredDenied.value, "denied")
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
});

const adminChangeState = async (task) => {
  await adminStore.submitTasksState(task.task_id, task.taskState);
  fetchtaches();
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
  background-color: #c3ebfc;
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
</style>
