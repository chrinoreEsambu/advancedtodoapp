<template>
  <div class="dashboard-container">
    <button class="hamburger-btn" @click="toggleSidebar">
      <Menu />
    </button>

    <div :class="['sidebar-fixed', { 'sidebar-hidden': !isSidebarVisible }]">
      <div class="sidebar-header">
        <h3>Admin-Dash</h3>
      </div>
      <nav class="sidebar-nav">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="selectTab(tab.id)"
          :class="['nav-button', { active: activeTab === tab.id }]"
        >
          <component :is="tab.icon" class="icon" />
          <span>{{ tab.label }}</span>
        </button>

        <button @click="handleLogout" class="logout-btn">
          <LogOut class="icon" />
          <span>Déconnexion</span>
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
import {
  UserRoundPlus,
  UsersRound,
  ClipboardCheck,
  ListTodo,
  LogOut,
  Menu,
} from "lucide-vue-next";

import { ref, computed } from "vue";
import dashelement from "../components/dashelement.vue";
import creatUser from "../components/creatUser.vue";
import assign from "../components/assign.vue";
import tasklist from "../components/tasklist.vue";
import { useAdminStore } from "../store/admin.service";

const adminstore = useAdminStore();

const tabs = [
  {
    id: "home",
    icon: UserRoundPlus,
    label: "User creation",
    component: dashelement,
  },
  { id: "user", icon: UsersRound, label: "Users list", component: creatUser },
  {
    id: "assign",
    icon: ClipboardCheck,
    label: "Assign task",
    component: assign,
  },
  { id: "Tasklist", icon: ListTodo, label: "Tasklist", component: tasklist },
];

const activeTab = ref("home");
const isSidebarVisible = ref(true);

const activeComponent = computed(() => {
  return tabs.find((tab) => tab.id === activeTab.value)?.component;
});

const handleLogout = async () => {
  await adminstore.logout();
  router.push("/");
};

const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value;
};

const selectTab = (id) => {
  activeTab.value = id;
  if (window.innerWidth < 768) {
    isSidebarVisible.value = false;
  }
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  position: relative;
}

.hamburger-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  background: none;
  border: none;
  cursor: pointer;
  display: none;
}

.hamburger-btn svg {
  width: 28px;
  height: 28px;
  color: #333;
}

.sidebar-fixed {
  width: 280px;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  border-radius: 10px;
  transition: transform 0.3s ease;
  z-index: 1000;
}

.sidebar-hidden {
  transform: translateX(-100%);
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

.nav-button,
.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: none;
  border: none;
  color: rgba(0, 0, 0, 0.8);
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  width: 100%;
  text-align: left;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-button.active {
  background-color: #c3ebfc;
  color: rgb(0, 0, 0);
  font-weight: 520;
}

.logout-btn {
  background-color: #fdf6d9;
  border: 1px solid #d0ceff;
  margin-top: 20px;
}

.logout-btn:hover {
  background-color: #fff0b3;
}

.icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

h3 {
  text-align: center;
  color: black;
}

.content-area {
  flex: 1;
  margin-left: 300px;
  padding: 2rem;
  background-color: #f7f8fa;
  width: 100%;
  transition: margin-left 0.3s ease;
}

.tab-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .hamburger-btn {
    display: block;
  }

  .sidebar-fixed {
    transform: translateX(-100%);
  }

  .sidebar-fixed.sidebar-hidden {
    transform: translateX(-100%);
  }

  .sidebar-fixed:not(.sidebar-hidden) {
    transform: translateX(0);
  }

  .content-area {
    margin-left: 0;
    padding-top: 80px;
  }
}
</style>
