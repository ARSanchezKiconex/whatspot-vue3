<script setup lang="ts">
import { ref } from 'vue'
import { format, addMonths, subMonths, startOfMonth, isSameDay } from 'date-fns'
import { useRouter } from 'vue-router'
import CalendarHeader from '../components/calendar/CalendarHeader.vue'
import CalendarGrid from '../components/calendar/CalendarGrid.vue'
import ReservationList from '../components/reservation/ReservationList.vue'

const router = useRouter()

const currentMonth = ref(startOfMonth(new Date()))
const selectedDate = ref(new Date())

const handlePrevMonth = () => {
  currentMonth.value = subMonths(currentMonth.value, 1)
}

const handleNextMonth = () => {
  currentMonth.value = addMonths(currentMonth.value, 1)
}

const handleToday = () => {
  currentMonth.value = startOfMonth(new Date())
  selectedDate.value = new Date()
}

const handleSelectDate = (date: Date) => {
  selectedDate.value = date
}

const handleCreateReservation = () => {
  router.push({
    name: 'create-reservation',
    query: { date: format(selectedDate.value, 'yyyy-MM-dd') }
  })
}
</script>

<template>
  <div class="animate-fade-in">
    <div class="md:flex md:space-x-6">
      <!-- Calendar section -->
      <div class="md:w-7/12 mb-8 md:mb-0">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl font-bold text-gray-800">Reservation Calendar</h1>
          <button
            @click="handleCreateReservation"
            class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            New Reservation
          </button>
        </div>
        
        <CalendarHeader 
          :current-month="currentMonth"
          @prev-month="handlePrevMonth"
          @next-month="handleNextMonth"
          @today="handleToday"
        />
        
        <CalendarGrid 
          :current-month="currentMonth"
          :selected-date="selectedDate"
          @select-date="handleSelectDate"
        />
      </div>
      
      <!-- Reservations for selected date -->
      <div class="md:w-5/12">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-800">
            Reservations for {{ format(selectedDate, 'MMMM d, yyyy') }}
          </h2>
        </div>
        
        <ReservationList :selected-date="selectedDate" />
      </div>
    </div>
  </div>
</template>