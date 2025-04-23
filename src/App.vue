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
    <footer class="bg-white py-4 border-t border-gray-200">
      <div class="container mx-auto text-center text-sm text-gray-500">
        <p>© {{ new Date().getFullYear() }} WhatsSpot. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>