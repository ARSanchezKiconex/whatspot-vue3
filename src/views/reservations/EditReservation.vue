<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReservationStore } from '../../stores/reservationStore'
import { Reservation } from '../types'

const route = useRoute()
const router = useRouter()
const reservationStore = useReservationStore()

const reservationId = computed(() => route.params.id as string)

const reservation = computed(() => {
  return reservationStore.getReservationById(reservationId.value)
})

const handleSubmit = (data: Omit<Reservation, 'id' | 'status'>) => {
  reservationStore.updateReservation(reservationId.value, data)
  router.push({ name: 'reservation-details', params: { id: reservationId.value } })
}

const handleCancel = () => {
  router.push({ name: 'reservation-details', params: { id: reservationId.value } })
}
</script>

<template>
  <div class="max-w-2xl mx-auto animate-fade-in">
    <div v-if="reservation">
      <ReservationForm 
        mode="edit"
        :initial-data="reservation"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
    
    <div v-else class="bg-white rounded-lg shadow-md p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-xl font-bold text-gray-800 mb-2">Reservation Not Found</h2>
      <p class="text-gray-600 mb-4">The reservation you're trying to edit doesn't exist or has been deleted.</p>
      <button @click="router.push({ name: 'calendar' })" class="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors">
        Back to Calendar
      </button>
    </div>
  </div>
</template>