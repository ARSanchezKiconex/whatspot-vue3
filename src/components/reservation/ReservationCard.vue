<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useBuildingStore } from '../../stores/buildingStore'
import { Reservation } from '../../types'

const props = defineProps<{
  reservation: Reservation
}>()

const buildingStore = useBuildingStore()

const building = computed(() => {
  return buildingStore.getBuildingById(props.reservation.buildingId)
})

const room = computed(() => {
  return buildingStore.getRoomById(props.reservation.buildingId, props.reservation.roomId)
})

const statusClasses = computed(() => {
  switch (props.reservation.status) {
    case 'pending':
      return 'reservation-pending'
    case 'confirmed':
      return 'reservation-confirmed'
    case 'cancelled':
      return 'reservation-cancelled'
    default:
      return ''
  }
})

const statusLabel = computed(() => {
  switch (props.reservation.status) {
    case 'pending':
      return 'Pending'
    case 'confirmed':
      return 'Confirmed'
    case 'cancelled':
      return 'Cancelled'
    default:
      return ''
  }
})

const statusColor = computed(() => {
  switch (props.reservation.status) {
    case 'pending':
      return 'text-warning-500'
    case 'confirmed':
      return 'text-success-500'
    case 'cancelled':
      return 'text-error-500'
    default:
      return ''
  }
})
</script>

<template>
  <div :class="['reservation-card', statusClasses]">
    <div class="flex justify-between items-start">
      <h3 class="text-lg font-semibold">{{ reservation.title }}</h3>
      <span :class="['px-2 py-1 text-xs font-medium rounded-full', statusColor]">
        {{ statusLabel }}
      </span>
    </div>
    
    <div class="mt-2 text-gray-600">
      <div class="flex items-center mb-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <span>{{ building?.name }} - {{ room?.name }}</span>
      </div>
      
      <div class="flex items-center mb-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{{ reservation.date }}</span>
      </div>
      
      <div class="flex items-center mb-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ reservation.startTime }} - {{ reservation.endTime }}</span>
      </div>
      
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>{{ reservation.name }}</span>
      </div>
    </div>
    
    <div class="mt-3 flex justify-end">
      <RouterLink 
        :to="`/reservations/${reservation.id}`" 
        class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
      >
        View Details
      </RouterLink>
    </div>
  </div>
</template>