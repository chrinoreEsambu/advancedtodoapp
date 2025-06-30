<template>
  <div>
    <label> {{ cv }}</label>
    
  </div>
</template>

<script setup>
import { ref } from 'vue'
const cv = ref(""); 
cv.value = "Create a User";
</script>

<style lang="scss" scoped></style>