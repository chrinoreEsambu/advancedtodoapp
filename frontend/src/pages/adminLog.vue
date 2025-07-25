<template>
  <div class="login-container">
    <div class="login-image">
      <div class="image-placeholder"></div>
    </div>
    <div class="login-form-wrapper">
      <div class="login-form">
        <h2>Admin-area</h2>

        <input v-model="mail" type="email" placeholder="email@exemple.com" />
        <input v-model="password" type="password" placeholder="Mot de passe" />

        <button @click="handleLogin">Se connecter</button>
        <p class="login-link">
          Pas Admin ? <a @click="loginAdmin">connexion</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAdminStore } from "../store/admin.service";

const mail = ref("");
const password = ref("");
const router = useRouter();
const adminstore = useAdminStore();


const handleLogin = async () => {
  if (!mail.value || !password.value) {
    alert("Veuillez remplir tous les champs");
    return;
  }
  
  const success = await adminstore.adminlogin(mail.value, password.value);
  
  if (success) {
    router.push("/dashboard");
  } else {
    alert(adminstore.errorMessage || "Échec de la connexion");
  }
};
const loginAdmin = () => {
  router.push("/");
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.alert {
  color: red;
  text-align: center;
  display: flex;
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
  /* background-color: #f5f5f5; */
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
  background-image: url("/one.jpg");
  background-size: cover;
  /* background-position: center; */
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
  background-color: #fae04d;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-form button:hover {
  background-color: #fae37d;
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
