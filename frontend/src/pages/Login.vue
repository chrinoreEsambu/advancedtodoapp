<template>
  <div>
    <h2>login</h2>
    <form @submit.prevent="handleLogin">
      <input type="text" v-model="user_id" placeholder="User_id" />
      <input type="password" v-model="password" placeholder="Password " />
      <button type="submit">connect</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const user_id = ref("");
const password = ref("");
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await axios.post("http://localhost:5173/api/connexion", {
      user_id: user_id.value,
      password: password.value,
    });
    router.push("../todopage");
  } catch (error) {
    console.error({
      message: "erreur coter clien lors de l envoi",
      error: { message: error.message },
    });
    // console.error('Erreur de connexion :', error.response?.data?.message);
  }
};
</script>

<style lang="scss" scoped></style>
