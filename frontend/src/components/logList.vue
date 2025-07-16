<template>
  <div class="p-4">
    <h2 class="text-xl font-semibold mb-4">Journal des actions admin</h2>

    <div v-if="loading" class="text-gray-500">Chargement des logs...</div>
    <div v-else-if="logs.length === 0" class="text-gray-500">
      Aucun log trouvé.
    </div>
    <div v-else class="space-y-3">
      <div
        v-for="log in logs"
        :key="log.log_id"
        class="p-4 border rounded-md shadow-sm bg-white"
      >
        <p class="text-sm text-gray-700">
          <span class="font-semibold">Admin ID:</span> {{ log.adminId }}
        </p>
        <p class="text-sm text-gray-700">
          <span class="font-semibold">Action:</span> {{ log.action }}
        </p>
        <p class="text-sm text-gray-700">
          <span class="font-semibold">Détail:</span> {{ log.details }}
        </p>
        <p class="text-xs text-gray-500 italic">
          {{ new Date(log.createdAt).toLocaleString() }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useAdminStore } from "../store/admin.service";

const adminStore = useAdminStore();
const loading = ref(true);
const logs = ref([]);

onMounted(async () => {
  loading.value = true;
  const response = await adminStore.adminlog();
  if (response.success) {
    logs.value = adminStore.logs;
  }
  loading.value = false;
});
</script>

<style scoped>

</style>
