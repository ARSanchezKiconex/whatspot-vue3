<script setup lang="ts">
import { computed } from 'vue'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO } from 'date-fns'
import { useReservationStore } from '../../stores/reservationStore'
import { CalendarDay } from '../../types'
import CalendarDayComponent from './CalendarDay.vue'

const props = defineProps<{
  currentMonth: Date
  selectedDate: Date
}>()

const emit = defineEmits<{
  (e: 'select-date', date: Date): void
}>()

const reservationStore = useReservationStore()

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const calendarDays = computed(() => {
  const monthStart = startOfMonth(props.currentMonth)
  const monthEnd = endOfMonth(props.currentMonth)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)
  
  const month = props.currentMonth.getMonth()
  const year = props.currentMonth.getFullYear()
  
  const daysWithReservations = reservationStore.getDaysWithReservations(month, year)
  
  const days: CalendarDay[] = []
  let day = startDate
  
  while (day <= endDate) {
    const dayOfMonth = day.getDate()
    const isCurrentMonth = isSameMonth(day, monthStart)
    
    days.push({
      date: new Date(day),
      dayOfMonth,
      isCurrentMonth,
      isToday: isSameDay(day, new Date()),
      hasReservations: isCurrentMonth && daysWithReservations.includes(dayOfMonth)
    })
    
    day = addDays(day, 1)
  }
  
  return days
})
</script>

<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <!-- Weekday headers -->
    <div class="grid grid-cols-7 bg-gray-50 border-b">
      <div 
        v-for="weekday in weekdays" 
        :key="weekday" 
        class="py-2 text-center text-sm font-medium text-gray-600"
      >
        {{ weekday }}
      </div>
    </div>
    
    <!-- Calendar days -->
    <div class="grid grid-cols-7">
      <CalendarDayComponent 
        v-for="(day, index) in calendarDays" 
        :key="index"
        :day="day"
        :selected="isSameDay(day.date, selectedDate)"
        @click="emit('select-date', day.date)"
      />
    </div>
  </div>
</template>