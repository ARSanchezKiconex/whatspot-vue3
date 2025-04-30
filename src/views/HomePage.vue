<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="animate-fade-in">
    <!-- Hero section -->
    <section class="bg-gradient-to-br from-primary-600 to-accent-600 text-white rounded-lg shadow-lg p-8 mb-8">
      <div class="max-w-2xl">
        <h1 class="text-3xl md:text-4xl font-bold mb-4">Simple Reservation Management</h1>
        <p class="text-lg mb-6 text-white/90">
          Easily book, manage and track your reservations with our intuitive calendar system.
        </p>
        <div class="flex flex-wrap gap-4">
          <RouterLink to="/calendar" class="px-6 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            View Calendar
          </RouterLink>
        </div>
      </div>
    </section>
    
    <!-- Upcoming reservations section -->
    <section class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-gray-800">Upcoming Reservations</h2>
        <RouterLink to="/calendar" class="text-primary-600 hover:text-primary-700">
          View All
        </RouterLink>
      </div>
    </section>
    
    <!-- Features section -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">Calendar View</h3>
        <p class="text-gray-600">
          Visualize all your reservations in an easy-to-use calendar interface.
        </p>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="w-12 h-12 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">Easy Booking</h3>
        <p class="text-gray-600">
          Book new reservations in seconds with our streamlined booking form.
        </p>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="w-12 h-12 bg-green-100 text-success-500 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">Status Tracking</h3>
        <p class="text-gray-600">
          Keep track of all your reservations with clear status indicators.
        </p>
      </div>
    </section>
  </div>
</template>