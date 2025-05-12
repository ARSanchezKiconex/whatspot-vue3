<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>Detalles de la Reserva</v-card-title>
      <v-card-text>
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
              />
            </v-col>
          </v-row>

          <!-- Línea 3: Desde -->
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="form.dateFrom"
                label="Fecha Desde"
                type="date"
                :min="today"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="form.timeFrom"
                label="Hora Desde"
                type="time"
              />
            </v-col>
          </v-row>

          <!-- Línea 4: Hasta -->
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="form.dateTo"
                label="Fecha Hasta"
                type="date"
                :min="form.dateFrom || today"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="form.timeTo"
                label="Hora Hasta"
                type="time"
                
              />
            </v-col>
          </v-row>

          <!-- Línea 5: Título -->
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.title"
                label="Título de la Reserva"
              />
            </v-col>
          </v-row>

          <!-- Línea 6: Detalles -->
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
        <v-btn color="primary" @click="confirmReservation">
          Confirmar Reserva
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { install } from 'element-plus'
import { ref, watch } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  booking: Object,
  dialog: Boolean,
  installations: Array,
})

const today = new Date().toISOString().substring(0, 10) 

const availableRooms = ref([])

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
    form.value.timeTo = sumarUnaHora(props.booking.time || '')
    form.value.title = ''
    form.value.details = ''
  }
})

watch(() => props.dialog, (val) => {
  dialog.value = val
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
