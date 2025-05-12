<template>
  <v-dialog v-model="internalDialog" max-width="500">
    <v-card>
      <v-card-title>Selecciona una sala</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="(room, index) in rooms"
            :key="index"
            @click="selectRoom(room)"
          >
            {{ room }}
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
  dialog: Boolean,
  rooms: Array
})

const emit = defineEmits(['update:dialog', 'next'])

const internalDialog = ref(props.dialog)

// Mantener sincronía con v-model del padre
watch(() => props.dialog, (val) => {
  internalDialog.value = val
})

watch(internalDialog, (val) => {
  emit('update:dialog', val)
})

function selectRoom(room) {
  emit('update:dialog', false)
  emit('next', room)
}
</script>