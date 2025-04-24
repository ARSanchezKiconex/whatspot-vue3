<script setup lang="ts">
import { computed } from 'vue'
import { addDays, isSameDay, isSameWeek, getDay } from 'date-fns'
import { useReservationStore } from '../../stores/reservationStore'
import Day from './Day.vue'

const props = defineProps<{
  currentWeek: Date
  selectedDate: Date
}>()

const emit = defineEmits<{
  (e: 'select-date', date: Date): void
}>()

const reservationStore = useReservationStore()

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const weekDays = computed(() => {
  const week = []
  const base = props.currentWeek

  for (let i = 0; i < 7; i++) {
    const date = addDays(base, i)
    const dayOfMonth = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    const daysWithReservations = reservationStore.getDaysWithReservations(month, year)

    week.push({
      date,
      dayOfMonth,
      isCurrentMonth: true, // en la semana no importa mucho esto
      isToday: isSameDay(date, new Date()),
      hasReservations: daysWithReservations.includes(dayOfMonth)
    })
  }

  return week
})
</script>

<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <!-- Weekday headers -->
    <div class="grid grid-cols-7 bg-gray-50 border-b">
      <div 
        v-for="(weekday, index) in weekdays" 
        :key="index" 
        class="py-2 text-center text-sm font-medium text-gray-600"
      >
        {{ weekday }}
      </div>
    </div>
    
    <!-- Week days -->
    <div class="grid grid-cols-7">
      <Day 
        v-for="(day, index) in weekDays" 
        :key="index"
        :day="day"
        :selected="isSameDay(day.date, selectedDate)"
        @click="emit('select-date', day.date)"
      />
    </div>
  </div>
</template>
