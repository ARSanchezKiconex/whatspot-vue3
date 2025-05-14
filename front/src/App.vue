<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
</script>

<template>
  <v-app>
    <Navbar />
    <v-main class="bg-gray-50">
      <RouterView />
    </v-main>
  </v-app>
</template>

<style scoped>
  .v-main {
    margin-left: 20px;
    margin-right: 10px;
  }
</style>
