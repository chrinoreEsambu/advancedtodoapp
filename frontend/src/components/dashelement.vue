<template>
  <div>
    <label>hello {{ cv }}</label>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const cv = ref(""); 
cv.value = "chrinore";
</script>

<style lang="scss" scoped></style>