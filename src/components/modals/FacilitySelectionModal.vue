<template>
  <v-dialog v-model="internalDialog" max-width="500" transition="dialog-bottom-transition">
    <v-card class="pa-4 rounded-xl">
      <v-card-title class="text-center text-subtitle-1 font-weight-medium text-grey-darken-3">
        Selecciona una instalación
      </v-card-title>
      <v-card-text>
        <v-list class="custom-list">
          <v-list-item
            v-for="facility in installations"
            :key="facility.id"
            @click="selectFacility(facility)"
            class="custom-list-item"
          >
            <span class="custom-item-text">{{ facility.name }}</span>
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
  installations: Array
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

function selectFacility(facility) {
  emit('next', facility)
  emit('update:dialog', false)
}
</script>

<style scoped>
.custom-list {
  padding: 0;
}

.custom-list-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: #f5f5f5;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.custom-list-item:hover {
  background-color: #e0e0e0;
}

.custom-item-text {
  font-size: 16px;
  color: #333;
}

.v-dialog__content {
  padding: 0;
}
</style>
