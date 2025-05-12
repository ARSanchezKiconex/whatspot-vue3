<template>
  <v-dialog v-model="dialog" max-width="600" transition="dialog-bottom-transition">
    <v-card class="pa-4 rounded-xl">
      <v-card-title class="text-center text-subtitle-1 font-weight-medium text-grey-darken-3">
        Detalles de la Reserva
      </v-card-title>
      <v-card-text class="dialog-content">
        <v-container>
          <!-- Línea 1: Edificio -->
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="form.facility"
                :items="props.installations.map(i => i.name)"
                label="Edificio"
                return-object
                @update:modelValue="onFacilityChange"
                item-title="name"
                class="custom-input"
              />
            </v-col>
          </v-row>

          <!-- Línea 2: Sala -->
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="form.room"
                :items="availableRooms"
                label="Sala"
                :disabled="!form.facility"
                class="custom-input"
              />
            </v-col>
          </v-row>

          <!-- Línea 3: Desde -->
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="form.dateFrom"
                label="Desde"
                type="date"
                :min="today"
                class="custom-input"
              />
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="form.timeFrom"
                label="Desde"
                :items="timeIntervals"
                class="custom-input"
              />
            </v-col>
          </v-row>

          <!-- Línea 4: Hasta -->
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="form.dateTo"
                label="Hasta"
                type="date"
                :min="form.dateFrom || today"
                class="custom-input"
              />
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="form.timeTo"
                label="Hasta"
                :items="timeIntervals"
                class="custom-input"
              />
            </v-col>
          </v-row>

          <!-- Línea 5: Título -->
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.title"
                label="Título de la Reserva"
                class="custom-input"
              />
            </v-col>
          </v-row>

          <!-- Línea 6: Detalles -->
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="form.details"
                label="Detalles de la Reserva"
                class="custom-input"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="confirmReservation" class="confirm-btn">
          Confirmar Reserva
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  booking: Object,
  dialog: Boolean,
  installations: Array,
})

const today = new Date().toISOString().substring(0, 10)

const availableRooms = ref([])
const timeIntervals = ref([])

// Generate time intervals in 15-minute increments
function generateTimeIntervals() {
  const intervals = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = hour.toString().padStart(2, '0')
      const formattedMinute = minute.toString().padStart(2, '0')
      intervals.push(`${formattedHour}:${formattedMinute}`)
    }
  }
  return intervals
}

// Initialize the time intervals
timeIntervals.value = generateTimeIntervals()

const emit = defineEmits(['update:dialog', 'confirmBooking'])

const dialog = ref(props.dialog)

const form = ref({
  facility: '',
  room: '',
  dateFrom: '',
  timeFrom: '',
  dateTo: '',
  timeTo: '',
  title: '',
  details: ''
})

// Utilidad para sumar una hora
function sumarUnaHora(hora) {
  if (!hora) return ''
  const [h, m] = hora.split(':').map(Number)
  const nuevaHora = new Date()
  nuevaHora.setHours(h + 1)
  nuevaHora.setMinutes(m)
  return nuevaHora.toTimeString().substring(0, 5)
}

function toDateString(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toISOString().split('T')[0] // Devuelve "YYYY-MM-DD"
}

function isValidDateTimeRange() {
  if (!form.value.dateFrom || !form.value.timeFrom || !form.value.dateTo || !form.value.timeTo) {
    return false
  }

  const from = new Date(`${form.value.dateFrom}T${form.value.timeFrom}`)
  const to = new Date(`${form.value.dateTo}T${form.value.timeTo}`)

  return to >= from
}

function onFacilityChange(newFacilityName) {
  const selectedFacility = props.installations.find(i => i.name === newFacilityName)
  availableRooms.value = selectedFacility?.rooms || []
  form.value.room = '' // borrar solo cuando cambia manualmente
}

// Sincronización

watch(() => props.dialog, (val) => {
  dialog.value = val

  // Cuando se abre el modal, copiar los valores del booking al form
  if (val) {
    form.value.facility = props.booking.facility.name || ''
    
    const selectedFacility = props.installations.find(i => i.name === form.value.facility)
    availableRooms.value = selectedFacility?.rooms || []
    form.value.room = props.booking.room || ''

    form.value.dateFrom = toDateString(props.booking.date) || ''
    form.value.timeFrom = props.booking.time || ''
    form.value.dateTo = toDateString(props.booking.date) || ''
    form.value.timeTo = sumarUnaHora(props.booking.time || '00:00')
    form.value.title = ''
    form.value.details = ''
  }
})

watch(dialog, (val) => {
  emit('update:dialog', val)
})

// Emitir los datos finales
function confirmReservation() {
  if (!isValidDateTimeRange()) {
    alert("La fecha/hora de finalización no puede ser anterior a la de inicio.")
    return
  }

  emit('update:dialog', false)
  emit('confirmBooking', { ...form.value })
}
</script>

<style scoped>
.custom-input {
  margin-bottom: 16px;
}

.confirm-btn {
  font-weight: bold;
  text-transform: uppercase;
}

.dialog-content {
  max-height: 400px; /* Ajustar según el tamaño necesario */
  overflow-y: auto; /* Habilita el scroll */
}

.v-dialog__content {
  padding: 0;
}

.v-btn {
  border-radius: 12px;
}
</style>
