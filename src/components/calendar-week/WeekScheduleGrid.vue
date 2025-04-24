<script setup lang="ts">
import { computed } from 'vue'
import { useReservationStore } from '../../stores/reservationStore'
import { useBuildingStore } from '../../stores/buildingStore'

const props = defineProps<{
  selectedDate: Date
}>()

const reservationStore = useReservationStore()
const buildingStore = useBuildingStore()

const date = computed(() => {
  return props.selectedDate.toISOString().split('T')[0]
})

const rooms = computed(() => buildingStore.getAllRooms)
const timeSlots = computed(() => reservationStore.timeSlots)

const getReservationForSlot = (roomId: string, startTime: string) => {
  return reservationStore.reservations.find(r =>
    r.roomId === roomId &&
    r.date === date.value &&
    r.startTime === startTime
  )
}
</script>

<template>
  <div class="overflow-x-auto">
    <div class="grid" :style="`grid-template-columns: 200px repeat(${timeSlots.length}, 1fr);`">
      <!-- Header: empty cell + hour slots -->
      <div class="bg-gray-100 p-2 font-semibold text-center border-b border-r">Room / Time</div>
      <div 
        v-for="slot in timeSlots" 
        :key="slot.id" 
        class="bg-gray-100 p-2 text-sm text-center font-semibold border-b border-r"
      >
        {{ slot.startTime }} - {{ slot.endTime }}
      </div>

      <!-- Room rows -->
      <template v-for="room in rooms" :key="room.id">
        <!-- Room name -->
        <div class="p-2 font-medium border-b border-r bg-gray-50">{{ room.name }}</div>

        <!-- Time slots per room -->
        <div 
          v-for="slot in timeSlots" 
          :key="`${room.id}-${slot.id}`"
          class="p-2 text-sm border-b border-r text-center hover:bg-gray-50 cursor-pointer"
        >
          <span v-if="getReservationForSlot(room.id, slot.startTime)">
            🔒 Reservado
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
}
</style>
