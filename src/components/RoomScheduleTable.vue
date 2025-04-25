<template>
  <div class="bg-white rounded shadow p-4">
    <!-- Selector de vista -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Calendario de Reservas</h2>
      <div>
        <button
          v-for="option in viewOptions"
          :key="option"
          :class="['mx-1 px-3 py-1 rounded', { 'bg-blue-600 text-white': currentView === option }]"
          @click="currentView = option"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <!-- Encabezado: Días según vista -->
    <div class="grid" :style="`grid-template-columns: 200px repeat(${visibleDays.length}, 1fr)`">
      <div class="font-bold text-gray-600 border-b p-2">Sala</div>
      <div
        v-for="day in visibleDays"
        :key="day.toISOString()"
        class="text-center font-medium border-b p-2"
      >
        {{ day.toLocaleDateString() }}
      </div>

      <!-- Filas: Salas y celdas -->
      <template v-for="room in rooms" :key="room.id">
        <div class="border-r font-medium p-2">{{ room.name }}</div>
        <div
          v-for="day in visibleDays"
          :key="`${room.id}-${day.toISOString()}`"
          class="border p-2 hover:bg-blue-50 cursor-pointer"
          @click="handleCellClick(room, day)"
        >
          <!-- Aquí podrías renderizar eventos si los tienes -->
          <div v-for="ev in getEvents(room.id, day)" :key="ev.id" class="text-sm bg-blue-100 rounded p-1">
            {{ ev.title }}
          </div>
        </div>
      </template>
    </div>

    <!-- Modal (placeholder) -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded shadow max-w-sm w-full">
        <h3 class="text-lg font-bold mb-2">Nueva reserva</h3>
        <p class="mb-4">Sala: {{ selectedRoom?.name }}<br />Día: {{ selectedDay?.toLocaleDateString() }}</p>
        <button @click="showModal = false" class="bg-blue-600 text-white px-4 py-2 rounded">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { addDays, startOfWeek } from 'date-fns'
import { useBuildingStore } from '../stores/buildingStore'

const currentView = ref<'day' | 'week' | 'month'>('week')
const today = new Date()

const viewOptions = ['day', 'week', 'month']

// Obtener salas
const buildingStore = useBuildingStore()
const rooms = computed(() => buildingStore.getAllRooms)

// Calcular días visibles en base a la vista seleccionada
const visibleDays = computed(() => {
  const days = []
  const start = startOfWeek(today, { weekStartsOn: 1 })
  const count = currentView.value === 'day' ? 1 : currentView.value === 'week' ? 7 : 30
  for (let i = 0; i < count; i++) {
    days.push(addDays(start, i))
  }
  return days
})

// Eventos de prueba
const events = ref([
  {
    id: '1',
    roomId: '1',
    date: today.toDateString(),
    title: 'Reunión equipo'
  }
])

function getEvents(roomId: string, day: Date) {
  return events.value.filter(
    ev => ev.roomId === roomId && new Date(ev.date).toDateString() === day.toDateString()
  )
}

// Modal
const showModal = ref(false)
const selectedRoom = ref<any>(null)
const selectedDay = ref<Date | null>(null)

function handleCellClick(room: any, day: Date) {
  selectedRoom.value = room
  selectedDay.value = day
  showModal.value = true
}
</script>

<style scoped>
/* Puedes añadir más estilos o usar Tailwind como aquí */
</style>
