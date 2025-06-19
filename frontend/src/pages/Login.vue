<template>
  <div class="login-container">
    <div class="login-image">
      <div class="image-placeholder"></div>
    </div>
    <div class="login-form-wrapper">
      <div class="login-form">
        <h2>Connexion</h2>
        <input v-model="user_id" placeholder="User ID" />
        <input v-model="password" type="password" placeholder="Mot de passe" />
        <!-- <p>{{ password }}</p> -->
        <button @click="handleLogin">Se connecter</button>
        <p class="login-link">
          Pas de compte ? <a @click="goToregistration">S'inscrire</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/UserTask.service";

const user_id = ref("");
const password = ref("");
const router = useRouter();
const userStore = useUserStore();


const handleLogin = async () => {
  if (!user_id.value || !password.value) {
    alert("champs vide");
  }
  try {
    await userStore.login(user_id.value, password.value);
    router.push("/todopage");
  } catch (err) {
    alert("Erreur de connexion");
  }
};
const goToregistration = () => {
  router.push("/register");
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.login-container {
  display: flex;
  height: 100vh;

  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
}
.login-link {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.login-link a {
  color: #000;
  text-decoration: none;
  cursor: pointer;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}
.login-image {
  flex: 0 0 60%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image-placeholder {
  width: 80%;
  height: 80%;
  background-color: #e0e0e0;
  border-radius: 8px;
  background-image: url("/log.jpg");
  background-size: cover;
  background-position: center;
}

.login-form-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-form {
  width: 100%;
  /* max-width: 350px; */
}

.login-form h2 {
  margin-bottom: 1.5rem;
  color: #333;
  /* font-size: 1.8rem; */
  font-weight: 700;
}

.login-form input {
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.3s;
}

.login-form input:focus {
  outline: none;
  border-color: #646cff;
}

.login-form button {
  width: 100%;
  padding: 0.8rem;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-form button:hover {
  background-color: #222;
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .login-image {
    flex: 0 0 40%;
    width: 100%;
  }

  .login-form-wrapper {
    flex: 1;
    padding: 1rem;
  }
}
</style>
