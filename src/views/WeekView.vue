<script setup lang="ts">
import { ref } from 'vue'
import { format, addWeeks, subWeeks, startOfWeek, isSameDay } from 'date-fns'
import { useRouter } from 'vue-router'
import Header from '../components/calendar-week/Header.vue'
import WeekScheduleGrid from '../components/calendar-week/WeekScheduleGrid.vue'

const router = useRouter()

const currentWeek = ref(startOfWeek(new Date(), { weekStartsOn: 1 })) // Lunes como inicio
const selectedDate = ref(new Date())

const handlePrevWeek = () => {
  currentWeek.value = subWeeks(currentWeek.value, 1)
}

const handleNextWeek = () => {
  currentWeek.value = addWeeks(currentWeek.value, 1)
}

const handleToday = () => {
  currentWeek.value = startOfWeek(new Date(), { weekStartsOn: 1 })
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
          <h1 class="text-2xl font-bold text-gray-800">Weekly Reservation Calendar</h1>
          <button
            @click="handleCreateReservation"
            class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            New Reservation
          </button>
        </div>
        
        <Header 
          :current-date="currentWeek"
          @prev="handlePrevWeek"
          @next="handleNextWeek"
          @today="handleToday"
        />
        
        <WeekScheduleGrid 
          :current-week="currentWeek"
          :selected-date="selectedDate"
          @select-date="handleSelectDate"
        />
      </div>
    </div>
  </div>
</template>
