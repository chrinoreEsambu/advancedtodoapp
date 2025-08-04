<template>
  <div class="dashboard-container">
    <button class="hamburger-btn" @click="toggleSidebar">
      <Menu />
    </button>

    <div :class="['sidebar-fixed', { 'sidebar-hidden': !isSidebarVisible }]">
      <div class="sidebar-header">
        <h3>
          <span class="main_title"
            ><img src="/box.png" class="imgTop" />Admin <br /></span
          >todox-Dash
        </h3>
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
      <label class="admconnect">Welcome {{ adminstore.admin }}</label>
      <div class="dashboard-stats">
        <div class="stat-card" v-for="stat in stats" :key="stat.title">
          <component :is="stat.icon" class="stat-icon" />
          <div class="stat-info">
            <h4>{{ stat.title }}</h4>
            <p>{{ stat.value }}</p>
          </div>
        </div>
      </div>

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
  Shield,
  LogOut,
  Menu,
  FileClock,
  CircleDotDashed,
  MessageCircleMore,
} from "lucide-vue-next";

import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAdminStore } from "../store/admin.service";
import dashelement from "../components/dashelement.vue";
import creatUser from "../components/creatUser.vue";
import assign from "../components/assign.vue";
import tasklist from "../components/tasklist.vue";
import logList from "../components/logList.vue";
import admStateTasks from "../components/admStateTasks.vue";
import chat from "../components/chat.vue";

const router = useRouter();
const adminstore = useAdminStore();

const tabs = [
  {
    id: "home",
    icon: CircleDotDashed,
    label: "Task states",
    component: admStateTasks,
  },
  {
    id: "hom",
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
  { id: "Tasklist", icon: Shield, label: "Tasklist", component: tasklist },
  { id: "logList", icon: FileClock, label: "Log list", component: logList },

  { id: "chat", icon: MessageCircleMore, label: "Chat", component: chat },
];

const activeTab = ref("home");
const isSidebarVisible = ref(true);
const activeComponent = computed(() => {
  return tabs.find((tab) => tab.id === activeTab.value)?.component;
});

const stats = ref([
  { title: "Total users", value: 0, icon: UsersRound },
  { title: "Total admins", value: 0, icon: Shield },
  { title: "Normal users", value: 0, icon: UserRoundPlus },
  { title: "Total tasks", value: 0, icon: ClipboardCheck },
]);

onMounted(async () => {
  await adminstore.fetchStats();
  stats.value[0].value = adminstore.stats.totalUsers;
  stats.value[1].value = adminstore.stats.totalAdmin;
  stats.value[2].value = adminstore.stats.totalNormalUsers;
  stats.value[3].value = adminstore.stats.totaltasks;
});

const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value;
};

const selectTab = (id) => {
  activeTab.value = id;
  if (window.innerWidth < 768) {
    isSidebarVisible.value = false;
  }
};

const handleLogout = async () => {
  await adminstore.logoutAdmin();
  router.push("/adminlogin");
};
</script>

<style scoped>
.admconnect {
  position: absolute;
  justify-content: right;
  top: 1px;
  right: 37px;
}
.main_title {
  color: #84a98c;
}
.imgTop {
  align-items: center;
  justify-content: center;
  height: 30px;
  margin-left: -20px;
}
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
  margin-top: -20px;
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

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 1.2rem;
  border-radius: 10px;
  background: #fae37d;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  width: 30px;
  height: 30px;
  margin-right: 1rem;
  color: #3f3f3f;
}

.stat-info h4 {
  margin: 0;
  font-size: 1rem;
  color: #444;
}

.stat-info p {
  margin: 0;
  font-weight: bold;
  font-size: 1.2rem;
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
