<template>
  <div class="login-container">
    <div class="login-image">
      <div class="image-placeholder"></div>
    </div>
    <div class="login-form-wrapper">
      <div class="login-form">
        <h2>Inscription</h2>
        <input v-model="nom" placeholder="Nom complet" />
        <input type="email" v-model="mail" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Mot de passe" />
        <button @click="handleInscription" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>S'inscrire</span>
        </button>
        <p class="login-link">
          Déjà un compte ? <a @click="goToLogin">Se connecter</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/UserTask.service";

const router = useRouter();
const userStore = useUserStore();

const nom = ref("");
const mail = ref("");
const password = ref("");
const loading = ref(false);

const handleInscription = async () => {
  loading.value = true;
  try {
    await userStore.register(nom.value, mail.value, password.value);
    router.push("/");
  } catch (error) {
    console.error("Erreur d'inscription:", error);
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push("/");
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.login-container {
  display: flex;
  height: 100vh;
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
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
  max-width: 400px;
}

.login-form h2 {
  margin-bottom: 1.5rem;
  color: #333;
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
  margin-top: 1rem;

  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form button:hover:not(:disabled) {
  background-color: #222;
}

.login-form button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  color: #ff4444;
  font-size: 0.8rem;
  margin-bottom: 1rem;
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
