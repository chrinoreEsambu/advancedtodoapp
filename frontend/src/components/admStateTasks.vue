<template>
  <div class="bento-grid">
    <div class="item item-billboard">
      <h2>Grow<br />customer retention</h2>
      <p>Transform one-time buyers into lifelong customers.</p>
    </div>

    <div class="item item-tote">
      <p>Tote bag design<br />with slogan</p>
    </div>

    <div class="item item-logo">
      <h1>upzelo</h1>
    </div>

    <div class="item item-badge">
      <p>Badge / Pin<br />Design</p>
    </div>

    <div class="item item-shirt">
      <p>T-shirt<br />Branding</p>
    </div>

    <div class="item item-mobile">
      <p>Upzelo:<br />Loyalty & Rewards</p>
      <small>Mobile app icon</small>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 1rem;
  height: 100vh;
  padding: 1rem;
  background-color: #e6f4f1;
}

.item {
  display: flex;

  border-radius: 1rem;
  text-align: center;
  color: white;
  padding: 1rem;
  font-family: sans-serif;
}

.item-billboard {
  grid-column: span 2;
  background-color: #1f7c6e;
  flex-direction: column;
}

.item-tote {
  background-color: #064c45;
}

.item-logo {
  grid-column: span 3;
  background-color: #043f3b;
}

.item-badge {
  background-color: #c3f0e6;
  color: #0a3d36;
}

.item-shirt {
  background-color: #e9fdfa;
  color: #0a3d36;
}

.item-mobile {
  background-color: #b0ebe0;
  color: #0a3d36;
  flex-direction: column;
}
</style>
