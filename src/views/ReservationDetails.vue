<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReservationStore } from '../stores/reservationStore'

const route = useRoute()
const router = useRouter()
const reservationStore = useReservationStore()

const reservationId = computed(() => route.params.id as string)

const reservation = computed(() => {
  return reservationStore.getReservationById(reservationId.value)
})

const statusColor = computed(() => {
  if (!reservation.value) return ''
  
  switch (reservation.value.status) {
    case 'pending':
      return 'bg-warning-500'
    case 'confirmed':
      return 'bg-success-500'
    case 'cancelled':
      return 'bg-error-500'
    default:
      return ''
  }
})

const handleEdit = () => {
  router.push({ name: 'edit-reservation', params: { id: reservationId.value } })
}

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this reservation?')) {
    reservationStore.deleteReservation(reservationId.value)
    router.push({ name: 'calendar' })
  }
}

const handleConfirm = () => {
  reservationStore.confirmReservation(reservationId.value)
}

const handleCancel = () => {
  if (confirm('Are you sure you want to cancel this reservation?')) {
    reservationStore.cancelReservation(reservationId.value)
  }
}

const handleBack = () => {
  router.back()
}
</script>

<template>
  <div class="max-w-2xl mx-auto animate-fade-in">
    <button 
      @click="handleBack" 
      class="mb-4 flex items-center text-gray-600 hover:text-primary-600"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
      </svg>
      Back
    </button>
    
    <div v-if="reservation" class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">{{ reservation.title }}</h1>
            <div class="flex items-center mt-2">
              <span :class="['inline-block w-3 h-3 rounded-full mr-2', statusColor]"></span>
              <span class="text-gray-600 font-medium capitalize">{{ reservation.status }}</span>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <button 
              @click="handleEdit" 
              class="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-full"
              title="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button 
              @click="handleDelete" 
              class="p-2 text-gray-600 hover:text-error-500 hover:bg-gray-100 rounded-full"
              title="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Details -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 class="text-lg font-medium text-gray-800 mb-3">Reservation Details</h2>
            
            <div class="space-y-3">
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <div class="text-sm text-gray-500">Date</div>
                  <div>{{ reservation.date }}</div>
                </div>
              </div>
              
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div class="text-sm text-gray-500">Time</div>
                  <div>{{ reservation.startTime }} - {{ reservation.endTime }}</div>
                </div>
              </div>
              
              <div v-if="reservation.notes" class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <div class="text-sm text-gray-500">Notes</div>
                  <div>{{ reservation.notes }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 class="text-lg font-medium text-gray-800 mb-3">Contact Information</h2>
            
            <div class="space-y-3">
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <div class="text-sm text-gray-500">Name</div>
                  <div>{{ reservation.name }}</div>
                </div>
              </div>
              
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <div class="text-sm text-gray-500">Email</div>
                  <div>{{ reservation.email }}</div>
                </div>
              </div>
              
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <div class="text-sm text-gray-500">Phone</div>
                  <div>{{ reservation.phone }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="p-6 bg-gray-50 border-t border-gray-200">
        <div class="flex justify-end space-x-3">
          <button 
            v-if="reservation.status === 'pending'"
            @click="handleConfirm" 
            class="px-4 py-2 bg-success-500 text-white rounded-md hover:bg-success-600 transition-colors"
          >
            Confirm Reservation
          </button>
          <button 
            v-if="reservation.status !== 'cancelled'"
            @click="handleCancel" 
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel Reservation
          </button>
        </div>
      </div>
    </div>
    
    <div v-else class="bg-white rounded-lg shadow-md p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-xl font-bold text-gray-800 mb-2">Reservation Not Found</h2>
      <p class="text-gray-600 mb-4">The reservation you're looking for doesn't exist or has been deleted.</p>
      <button @click="router.push({ name: 'calendar' })" class="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors">
        Back to Calendar
      </button>
    </div>
  </div>
</template>