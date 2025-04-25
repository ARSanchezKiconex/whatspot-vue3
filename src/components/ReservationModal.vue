<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded shadow max-w-md w-full">
      <h2 class="text-lg font-semibold mb-4">Nueva reserva</h2>

      <form @submit.prevent="saveReservation">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Título</label>
          <input v-model="title" class="w-full border rounded px-3 py-2" required />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Hora</label>
          <input v-model="time" type="time" class="w-full border rounded px-3 py-2" required />
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <button type="button" @click="$emit('close')" class="px-4 py-2 bg-gray-300 rounded">
            Cancelar
          </button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { format } from 'date-fns'
import { useReservationStore } from '../stores/reservationStore'

const props = defineProps<{
  day: Date
  room: any
}>()

const emit = defineEmits(['close'])

const title = ref('')
const time = ref('09:00')

const store = useReservationStore()

function saveReservation() {
  store.addReservation({
    id: crypto.randomUUID(),
    title: title.value,
    time: time.value,
    date: format(props.day, 'yyyy-MM-dd'),
    roomId: props.room.id
  })
  emit('close')
}
</script>
