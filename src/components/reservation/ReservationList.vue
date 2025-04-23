<script setup lang="ts">
import { computed } from 'vue'
import { format, parseISO } from 'date-fns'
import { useReservationStore } from '../../stores/reservationStore'
import ReservationCard from './ReservationCard.vue'

const props = defineProps<{
  selectedDate?: Date
  limit?: number
}>()

const reservationStore = useReservationStore()

const filteredReservations = computed(() => {
  if (props.selectedDate) {
    const dateStr = format(props.selectedDate, 'yyyy-MM-dd')
    return reservationStore.getReservationsByDate(dateStr)
  } else {
    // Return all reservations, possibly limited
    const allReservations = [...reservationStore.reservations]
    
    // Sort by date (most recent first)
    allReservations.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`).getTime()
      const dateB = new Date(`${b.date}T${b.startTime}`).getTime()
      return dateA - dateB
    })
    
    if (props.limit) {
      return allReservations.slice(0, props.limit)
    }
    
    return allReservations
  }
})

const hasReservations = computed(() => {
  return filteredReservations.value.length > 0
})
</script>

<template>
  <div>
    <div v-if="hasReservations">
      <ReservationCard
        v-for="reservation in filteredReservations"
        :key="reservation.id"
        :reservation="reservation"
      />
    </div>
    <div v-else class="p-6 text-center text-gray-500 bg-white rounded-lg shadow-sm">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p v-if="selectedDate">No reservations for this date.</p>
      <p v-else>No reservations found.</p>
    </div>
  </div>
</template>