<script setup lang="ts">
import { computed } from 'vue'
import { format, addDays } from 'date-fns'

const props = defineProps<{
  currentDate: Date
}>()

const emit = defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
  (e: 'today'): void
}>()

const formattedRange = computed(() => {
  const start = props.currentDate
  const end = addDays(start, 6)
  return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`
})
</script>

<template>
  <div class="flex items-center justify-between mb-6">
    <h2 class="text-xl font-bold text-gray-800">{{ formattedRange }}</h2>
    <div class="flex space-x-2">
      <button 
        @click="emit('today')" 
        class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
      >
        Today
      </button>
      <button 
        @click="emit('prev')" 
        class="p-1 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
      <button 
        @click="emit('next')" 
        class="p-1 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>
