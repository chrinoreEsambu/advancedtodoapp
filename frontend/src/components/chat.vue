<template>
  <div class="coming-soon-container">
    <div class="bubble">💬</div>
    <h2>Chat feature under development... <br />Thanks</h2>
    <p class="soon">Coming Soon</p>
  </div>
</template>

<script setup></script>

<style scoped>
.coming-soon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  text-align: center;
  font-family: sans-serif;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.bubble {
  font-size: 3rem;
  animation: pulse 1.5s infinite;
}

h2 {
  margin-top: 1rem;
  font-size: 1.5rem;
  color: #333;
}

.soon {
  margin-top: 0.5rem;
  font-weight: bold;
  color: #555;
  animation: blink 1.8s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
</style>
