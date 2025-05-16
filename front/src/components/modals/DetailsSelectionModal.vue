<template>
  <v-dialog v-model="dialog" max-width="600" transition="dialog-bottom-transition">
    <v-card class="pa-4 rounded-xl">
      <v-card-title class="text-center text-subtitle-1 font-weight-medium text-grey-darken-3">
        Detalles de la Reserva
      </v-card-title>
      <v-card-text class="dialog-content">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="form.facility_uuid"
                :items="props.installations"
                item-title="name"
                item-value="uuid"
                label="Edificio"
                @update:modelValue="onFacilityChange"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="form.room_uuid"
                :items="availableRooms"
                item-title="name"
                item-value="uuid"
                label="Sala"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="form.dateFrom"
                label="Desde"
                type="date"
                :min="today"
              />
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="form.timeFrom"
                label="Desde"
                :items="timeIntervals"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="form.dateTo"
                label="Hasta"
                type="date"
                :min="form.dateFrom || today"
              />
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="form.timeTo"
                label="Hasta"
                :items="timeIntervals"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.title"
                label="Título de la Reserva"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="form.details"
                label="Detalles de la Reserva"
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
  bookingsList: Array,
  dialog: Boolean,
  installations: Array,
  rooms: Array
})

const emit = defineEmits(['update:dialog', 'confirmBooking'])

const today = new Date().toISOString().substring(0, 10)
const availableRooms = ref([])
const timeIntervals = generateTimeIntervals()
const dialog = ref(props.dialog)

const form = ref({
  facility_uuid: '',
  room_uuid: '',
  dateFrom: '',
  timeFrom: '',
  dateTo: '',
  timeTo: '',
  title: '',
  details: ''
})

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

function addOneHour(hour) {
  if (!hour) return ''
  const [h, m] = hour.split(':').map(Number)
  const nuevaHora = new Date()
  nuevaHora.setHours(h + 1)
  nuevaHora.setMinutes(m)
  return nuevaHora.toTimeString().substring(0, 5)
}

function toDateString(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

function isValidDateTimeRange() {
  if (!form.value.dateFrom || !form.value.timeFrom || !form.value.dateTo || !form.value.timeTo) {
    return false
  }

  const from = new Date(`${form.value.dateFrom}T${form.value.timeFrom}`)
  const to = new Date(`${form.value.dateTo}T${form.value.timeTo}`)

  return to >= from
}

function onFacilityChange(newFacilityUuid) {
  availableRooms.value = props.rooms.filter(room => room.facility_uuid === newFacilityUuid) || []
  form.value.room_uuid = ''
}

function confirmReservation() {
  if (!isValidDateTimeRange()) {
    alert("La fecha/hora de finalización no puede ser anterior a la de inicio.")
    return
  }

  emit('update:dialog', false)
  emit('confirmBooking', { ...form.value })
}

watch(() => props.dialog, (val) => {
  dialog.value = val

  if (val) {
    form.value.facility_uuid = props.booking.facility.uuid || ''
    form.value.room_uuid = props.booking.room.uuid || ''
    form.value.dateFrom = toDateString(props.booking.date) || ''
    form.value.timeFrom = props.booking.time || ''
    form.value.dateTo = toDateString(props.booking.date) || ''
    form.value.timeTo = addOneHour(props.booking.time || '00:00')
    form.value.title = ''
    form.value.details = ''

    availableRooms.value = props.rooms.filter(room => room.facility_uuid === props.booking.facility.uuid)
  }
})

watch(dialog, (val) => {
  emit('update:dialog', val)
})
</script>

<style scoped>
.confirm-btn {
  font-weight: bold;
  text-transform: uppercase;
}

.dialog-content {
  max-height: 400px;
  overflow-y: auto;
}

.v-btn {
  border-radius: 12px;
}
</style>
