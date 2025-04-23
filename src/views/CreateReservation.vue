<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { parseISO } from 'date-fns'
import { useReservationStore } from '../stores/reservationStore'
import ReservationForm from '../components/reservation/ReservationForm.vue'
import { Reservation } from '../types'

const route = useRoute()
const router = useRouter()
const reservationStore = useReservationStore()

const selectedDate = computed(() => {
  const dateParam = route.query.date
  if (dateParam && typeof dateParam === 'string') {
    return parseISO(dateParam)
  }
  return new Date()
})

const handleSubmit = (data: Omit<Reservation, 'id' | 'status'>) => {
  const reservationId = reservationStore.addReservation(data)
  router.push({ name: 'reservation-details', params: { id: reservationId } })
}

const handleCancel = () => {
  router.push({ name: 'calendar' })
}
</script>

<template>
  <div class="max-w-2xl mx-auto animate-fade-in">
    <ReservationForm 
      mode="create"
      :selected-date="selectedDate"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>