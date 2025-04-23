<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import { CalendarDay } from '../../types'

const props = defineProps<{
  day: CalendarDay
  selected: boolean
}>()

const dayClasses = computed(() => {
  return {
    'text-gray-400': !props.day.isCurrentMonth,
    'bg-primary-50 font-semibold text-primary-700': props.selected,
    'bg-primary-500 text-white': props.day.isToday && !props.selected,
    'calendar-day-hover': props.day.isCurrentMonth && !props.selected
  }
})
</script>

<template>
  <div 
    class="h-24 border-t border-r p-1 transition-all relative"
    :class="dayClasses"
    @click="$emit('click')"
  >
    <div class="text-right p-1">{{ day.dayOfMonth }}</div>
    
    <!-- Reservation indicator -->
    <div 
      v-if="day.hasReservations" 
      class="absolute bottom-2 left-2 w-2 h-2 bg-accent-500 rounded-full animate-pulse-once"
    ></div>
  </div>
</template>