<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <header class="bg-white shadow-sm">
    <nav class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center">
          <span class="text-2xl font-bold text-primary-600">WhatsSpot</span>
        </RouterLink>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:flex space-x-6">
          <RouterLink to="/" class="py-2 text-gray-700 hover:text-primary-600 transition-colors" active-class="font-medium text-primary-600">
            Inicio
          </RouterLink>
          <RouterLink to="/calendar" class="py-2 text-gray-700 hover:text-primary-600 transition-colors" active-class="font-medium text-primary-600">
            Calendario
          </RouterLink>
        </div>
        
        <!-- Mobile menu button -->
        <button @click="toggleMobileMenu" class="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Mobile Navigation -->
      <div v-show="isMobileMenuOpen" class="md:hidden mt-3 pb-3 space-y-1 animate-slide-up">
        <RouterLink to="/" class="block py-2 px-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-md" active-class="font-medium text-primary-600 bg-primary-50">
          Inicio
        </RouterLink>
        <RouterLink to="/calendar" class="block py-2 px-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-md" active-class="font-medium text-primary-600 bg-primary-50">
          Calendario
        </RouterLink>
      </div>
    </nav>
  </header>
</template>