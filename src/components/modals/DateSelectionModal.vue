<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>Selecciona día y hora</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-date-picker v-model="selectedDate" :min="minDate" />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="selectedTime"
                label="Hora"
                type="time"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="confirmSelection" :disabled="!selectedDate || !selectedTime">
          Continuar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
  dialog: Boolean
})

const emit = defineEmits(['update:dialog', 'next'])

const dialog = ref(props.dialog)
const selectedDate = ref(null)
const selectedTime = ref(new Date().toTimeString().substring(0, 5))

const minDate = new Date().toISOString().substring(0, 10)

// Sincronización con el padre
watch(() => props.dialog, (val) => {
  dialog.value = val
})

watch(dialog, (val) => {
  emit('update:dialog', val)
})

function confirmSelection() {
  emit('update:dialog', false)
  emit('next', {
    date: selectedDate.value,
    time: selectedTime.value
  })
}
</script>
