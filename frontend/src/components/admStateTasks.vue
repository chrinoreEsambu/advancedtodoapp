<template>
  <div class="bento-grid">
    <div class="item item-billboard">
      <h1>Inprogress</h1>
      <ul>
        <li v-for="task in tachesInProgress" :key="task.task_id">
          {{ task.task }}
          <span :class="['badge', task.taskState.toLowerCase()]">{{
            task.taskState
          }}</span>
        </li>
      </ul>
    </div>

    <div class="item item-tote">
      <h1>Todo</h1>
      <ul>
        <li v-for="task in tachesTodo" :key="task.task_id">
          {{ task.task }}
          <span :class="['badge', task.taskState.toLowerCase()]">{{
            task.taskState
          }}</span>
        </li>
      </ul>
    </div>

    <div class="item item-logo">
      <h1>Request</h1>
      <ul>
        <li
          v-for="task in tachesRequest"
          :key="task.task_id"
          class="request-item"
        >
          <span>{{ task.task }}</span>
          <div class="request-controls">
            <span :class="['badge', task.taskState.toLowerCase()]">{{
              task.taskState
            }}</span>
            <span>for: {{ task.assigneeId }}</span>
            <select v-model="task.taskState" @change="adminChangeState(task)">
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
      <h1>Accepted</h1>
      <ul>
        <li v-for="task in tachesAccepted" :key="task.task_id">
          {{ task.task }}
          <span :class="['badge', task.taskState.toLowerCase()]">{{
            task.taskState
          }}</span>
        </li>
      </ul>
    </div>

    <div class="item item-shirt">
      <h1>Done</h1>
      <ul>
        <li v-for="task in tachesDone" :key="task.task_id">
          {{ task.task }}
          <span :class="['badge', task.taskState.toLowerCase()]">{{
            task.taskState
          }}</span>
        </li>
      </ul>
    </div>

    <div class="item item-mobile">
      <h1>Denied</h1>
      <ul>
        <li v-for="task in tachesDenied" :key="task.task_id">
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
import { ref, onMounted } from "vue";
import { useAdminStore } from "../store/admin.service";

const adminStore = useAdminStore();

const tachesTodo = ref([]);
const tachesInProgress = ref([]);
const tachesAccepted = ref([]);
const tachesDenied = ref([]);
const tachesDone = ref([]);
const tachesRequest = ref([]);

const fetchtaches = async () => {
  try {
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
};
</script>

<style scoped>
* {
  list-style: none;
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
  height: 810px;
}

.item {
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  color: white;
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
  background-color: #fb8d75;
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
  margin-bottom: 0.5rem;
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
</style>
