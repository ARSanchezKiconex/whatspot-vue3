<template>
  <v-dialog v-model="dialog" max-width="500" transition="dialog-bottom-transition">
    <v-card class="pa-4 rounded-xl">
      <v-card-title class="text-center text-subtitle-1 font-weight-medium text-grey-darken-3">
        Selecciona día y hora
      </v-card-title>

      <v-card-text>

        <!-- Navegación de semanas -->
        <div class="d-flex justify-between align-center mb-3">
          <v-btn icon variant="text" @click="goToPreviousWeek">
            <i class="fa-solid fa-chevron-left"></i>
          </v-btn>
          <span class="text-caption text-grey-darken-1 font-weight-medium">
            {{ weekRangeText }}
          </span>
          <v-btn icon variant="text" @click="goToNextWeek">
            <i class="fa-solid fa-chevron-right"></i>
          </v-btn>
        </div>

        <!-- Días -->
        <div class="d-flex justify-space-around mb-5">
          <div
            v-for="day in weekDays"
            :key="day.dateString"
            class="text-center"
          >
            <div class="text-caption text-grey-darken-1">{{ day.shortName }}</div>

            <v-btn
              :color="day.dateString === selectedDate ? 'primary' : 'grey-lighten-3'"
              :variant="day.dateString === selectedDate ? 'flat' : 'text'"
              :disabled="day.isPast"
              class="elevation-0 mt-1"
              rounded
              size="small"
              @click="selectedDate = day.dateString"
            >
              <span :class="day.dateString === selectedDate ? 'text-white' : 'text-grey-darken-3'">
                {{ day.day }}
              </span>
            </v-btn>
          </div>
        </div>

        <!-- Horas en scroll -->
        <div class="hour-scroll">
          <div
            v-for="hour in hours"
            :key="hour"
            class="hour-block"
            @click="selectHour(hour)"
          >
            <div class="hour-text">
              {{ hour }}
            </div>

            <!-- Aquí podría ir una marca de ocupado en el futuro -->
            <!-- <div class="overlay" v-if="isHourTaken(hour)">Ocupado</div> -->
          </div>
        </div>

      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, computed } from 'vue'

const props = defineProps({ dialog: Boolean })
const emit = defineEmits(['update:dialog', 'next'])

const dialog = ref(props.dialog)
const selectedDate = ref(new Date().toISOString().substring(0, 10))

// Base de semana actual desde lunes
const today = new Date()
const offset = today.getDay() === 0 ? -6 : 1 - today.getDay()
const baseDate = ref(new Date(today.setDate(today.getDate() + offset)))

// 24 horas de 00:00 a 23:00
const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)

const weekDays = computed(() => {
  const days = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate.value)
    d.setDate(d.getDate() + i)

    const dateStr = d.toISOString().substring(0, 10)
    const isPast = new Date(dateStr) < new Date(new Date().toISOString().substring(0, 10))

    days.push({
      date: d,
      day: d.getDate(),
      shortName: d.toLocaleDateString('es-ES', { weekday: 'short' }),
      dateString: dateStr,
      isPast
    })
  }
  return days
})

const weekRangeText = computed(() => {
  const first = weekDays.value[0].date
  const last = weekDays.value[6].date
  const format = (d) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  return `${format(first)} - ${format(last)}`
})

function goToPreviousWeek() {
  baseDate.value.setDate(baseDate.value.getDate() - 7)
  baseDate.value = new Date(baseDate.value)
}
function goToNextWeek() {
  baseDate.value.setDate(baseDate.value.getDate() + 7)
  baseDate.value = new Date(baseDate.value)
}

function selectHour(hour) {
  emit('update:dialog', false)
  emit('next', {
    date: selectedDate.value,
    time: hour
  })
}

watch(() => props.dialog, (val) => {
  dialog.value = val
})
watch(dialog, (val) => {
  emit('update:dialog', val)
})
</script>

<style scoped>
.hour-scroll {
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 6px;
}
.hour-block {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  background-color: #f5f5f5;
  border-radius: 12px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}
.hour-block:hover {
  background-color: #e0e0e0;
}
.hour-text {
  font-size: 15px;
}
.overlay {
  position: absolute;
  right: 10px;
  font-size: 12px;
  color: red;
  font-weight: bold;
}
</style>
