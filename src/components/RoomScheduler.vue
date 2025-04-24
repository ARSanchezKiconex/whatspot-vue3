<template>
  <div>
    <VueCal
      style="height: 800px;"
      view="week"
      :views="['day', 'week', 'month']"
      :disable-views="['year', 'years']"
      :time="false"
      :resources="resources"
      hideWeekends
      locale="es"
      :cellContextmenu="true"
      :events="events"
      :editable-events="false"
      @event-change="onEventChange"
      @cell-click="onCellClick"
      class="vuecal--blue-theme"
    />

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">Nueva Reserva</h2>
        <form @submit.prevent="submitReservation">
          <label class="block mb-2">
            Título:
            <input v-model="newEvent.title" class="w-full border p-2 rounded" required />
          </label>
          <label class="block mb-2">
            Hora inicio:
            <input v-model="newEvent.startTime" type="time" class="w-full border p-2 rounded" required />
          </label>
          <label class="block mb-2">
            Hora fin:
            <input v-model="newEvent.endTime" type="time" class="w-full border p-2 rounded" required />
          </label>
          <label class="block mb-2">
            Sala:
            <select v-model="newEvent.roomId" class="w-full border p-2 rounded" required>
              <option v-for="room in rooms" :key="room.id" :value="room.id">
                {{ room.name }}
              </option>
            </select>
          </label>
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" @click="showModal = false" class="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

import { useReservationStore } from '../stores/reservationStore'
import { useBuildingStore } from '../stores/buildingStore'

const reservationStore = useReservationStore()
const buildingStore = useBuildingStore()

const rooms = computed(() => buildingStore.getAllRooms)

const events = computed(() =>
  reservationStore.reservations.map(res => ({
    ...res,
    start: `${res.date}T${res.startTime}`,
    end: `${res.date}T${res.endTime}`,
    resource: res.roomId,
    title: res.title,
  }))
)

// Computed property para obtener todas las salas de todos los edificios
const resources = [
  { id: '1', name: 'Conference Room A' },
  { id: '2', name: 'Meeting Room 1' },
  { id: '3', name: 'Creative Studio' },
  { id: '4', name: 'Quiet Room' }
]


function onEventChange(event: any) {
  reservationStore.updateReservation(event.id, {
    date: event.start.split('T')[0],
    startTime: event.start.split('T')[1],
    endTime: event.end.split('T')[1],
    roomId: event.resource,
  })
}

// Modal state
const showModal = ref(false)
const newEvent = ref({
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  roomId: '',
})

function onCellClick({ startDateTime }: { startDateTime: Date }) {
  const date = startDateTime.toISOString().split('T')[0]
  const time = startDateTime.toTimeString().slice(0, 5)
  newEvent.value = {
    title: '',
    date,
    startTime: time,
    endTime: '',
    roomId: rooms.value.length > 0 ? rooms.value[0].id : '',
  }
  showModal.value = true
}

function submitReservation() {
  const { date, startTime, endTime, roomId, title } = newEvent.value
  reservationStore.addReservation({
    title,
    date,
    startTime,
    endTime,
    name: 'Anon', // Dummy info for now
    email: 'anon@example.com',
    phone: '000-000-0000',
    notes: '',
    buildingId: rooms.value.find(r => r.id === roomId)?.buildingId || '',
    roomId,
  })
  showModal.value = false
}
</script>
