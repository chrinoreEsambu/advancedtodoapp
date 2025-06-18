<template>
  <div class="todo-container">
    <header class="header">
      <h2>Bonjour, {{ userStore.user }}</h2>
      <button @click="handleLogout" class="logout-btn">Déconnexion</button>
    </header>

    <div class="content">
      <div class="add-task">
        <input
          v-model="taskText"
          placeholder="Nouvelle tâche..."
          class="input-task"
        />
        <button @click="handleAddTask">Ajouter</button>
      </div>

      <div class="tasks">
        <h3>Mes Tâches :</h3>
        <div v-if="safeTasks.length === 0">Aucune tâche pour le moment.</div>
        <ul>
          <li v-for="task in safeTasks" :key="task.id">
            {{ task.task }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/UserTask.service";

const router = useRouter();
const taskText = ref("");
const userStore = useUserStore();


const safeTasks = computed(() => Array.isArray(userStore.tasks) ? userStore.tasks : []);

onMounted(async () => {
  await userStore.fetchTasks(); 
});

const handleAddTask = async () => {
  if (!taskText.value.trim()) return;

  await userStore.addTask({ task: taskText.value });
  taskText.value = "";
};

const handleLogout = async () => {
  await userStore.logout();
  router.push("/");
};
</script>

<style scoped>
.todo-container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.logout-btn {
  background-color: #000;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #222;
}

.content {
  display: flex;
  flex-direction: row;
  gap: 40px;
}

.add-task {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-task {
  padding: 10px;
  border: 1px solid #000;
  border-radius: 5px;
}

.add-task button {
  background-color: #000;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-task button:hover {
  background-color: #222;
}

.tasks {
  flex: 1;
}

.tasks ul {
  list-style: none;
  padding-left: 0;
}

.tasks li {
  background-color: #f5f5f5;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
}
</style>