<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <Navbar />
    <main class="flex-1 container mx-auto p-4 animate-fade-in">
      <RouterView />
    </main>
  </div>
</template>
