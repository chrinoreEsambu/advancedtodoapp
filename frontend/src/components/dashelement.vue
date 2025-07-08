<template>
  <div class="form-container">
    <div class="form-wrapper">
      <div class="form">
        <h2>Add user</h2>

        <div class="form-row">
          <div class="form-group">
            <input v-model="nom" type="text" placeholder="Nom complet" />
          </div>
          <div class="form-group">
            <input v-model="mail" type="email" placeholder="Email" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <input
              v-model="password"
              type="password"
              placeholder="Mot de passe"
            />
          </div>
          <div class="form-group">
            <select v-model="role">
              <option value="users">Utilisateur normal</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
        </div>

        <div class="form-footer">
          <button @click="handleSubmit">Créer l'utilisateur</button>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success-message">
            {{ successMessage }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAdminStore } from "../store/admin.service";

const nom = ref("");
const mail = ref("");
const password = ref("");
const role = ref("users");
const errorMessage = ref("");
const successMessage = ref("");

const adminStore = useAdminStore();

const handleSubmit = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!nom.value || !mail.value || !password.value) {
    errorMessage.value = "Tous les champs sont obligatoires";
    return;
  }

  try {
    const result = await adminStore.createUser({
      nom: nom.value,
      mail: mail.value,
      password: password.value,
      role: role.value,
    });

    if (result.success) {
      successMessage.value = "Utilisateur créé avec succès";

      nom.value = "";
      mail.value = "";
      password.value = "";
      role.value = "users";
    } else {
      errorMessage.value =
        result.error?.message || "Erreur lors de la création";
    }
  } catch (err) {
    errorMessage.value = err.message || "Une erreur est survenue";
  }
};
</script>

<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.form-wrapper {
  width: 100%;
  max-width: 600px;
}

.form {
  width: 100%;
}

.form h2 {
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: 700;
}

.form-row {
  display: flex;
  gap: 5rem;
  margin-bottom: 1rem;
}

.form-group {
  flex: 1;
}

.form input,
.form select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
}

.form input:focus,
.form select:focus {
  outline: none;
  border-color: #646cff;
}

.form select {
  appearance: none;
  background-color: white;
  height: 42.4px;
}

.form-footer {
  margin-top: 1rem;
  text-align: center;
}

.form-footer button {
  width: 100%;
  max-width: 300px;
  padding: 0.8rem;
  background-color: #fae04d;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
}

.form-footer button:hover {
  background-color: #fae37d;
}

.error-message {
  color: red;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.success-message {
  color: green;
  margin-top: 1rem;
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .form-group {
    margin-bottom: 1rem;
  }
}
</style>
