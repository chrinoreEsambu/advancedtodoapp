<template>
  <div class="dashboard-container">
    <div class="sidebar-fixed">
      <div class="sidebar-header">
        <h3>Admin-Dash</h3>
      </div>
      <nav class="sidebar-nav">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['nav-button', { active: activeTab === tab.id }]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <div class="content-area">
      <keep-alive>
        <component :is="activeComponent" class="tab-content" />
      </keep-alive>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import dashelement from "../components/dashelement.vue";

const tabs = [{ id: "home", label: "User creation", component: dashelement }];

const activeTab = ref("home");

const activeComponent = computed(() => {
  return tabs.find((tab) => tab.id === activeTab.value)?.component;
});
</script>

<style scoped>
h3 {
  align-items: center;
  text-align: center;
  color: black;
}
.dashboard-container {
  display: flex;
  min-height: 100vh;
}

.sidebar-fixed {
  width: 280px;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  color: white;
  padding: 1rem;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  border-radius: 10px;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1rem;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-button {
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  background: none;
  border: none;
  color: rgba(0, 0, 0, 0.8);
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-button.active {
  background-color: #c3ebfc;
  color: rgb(0, 0, 0);
  font-weight: 520;
}

.content-area {
  flex: 1;
  margin-left: 300px;
  padding: 2rem;
  background-color: #f7f8fa;
}

.tab-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

@media (max-width: 992px) {
  .sidebar-fixed {
    width: 240px;
  }
  .content-area {
    margin-left: 240px;
  }
}

@media (max-width: 768px) {
  .sidebar-fixed {
    width: 100%;
    position: relative;
    height: auto;
  }
  .content-area {
    margin-left: 0;
  }
}
</style>
