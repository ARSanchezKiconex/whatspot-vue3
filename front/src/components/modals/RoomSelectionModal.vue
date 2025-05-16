<template>
  <v-dialog v-model="internalDialog" max-width="500" transition="dialog-bottom-transition">
    <v-card class="pa-4 rounded-xl">
      <v-card-title class="text-center text-subtitle-1 font-weight-medium text-grey-darken-3">
        Selecciona una sala
      </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="room in rooms"
            :key="room.uuid"
            @click="selectRoom(room)"
            class="custom-list-item"
          >
            <div class="item-content">
              <span class="custom-item-text">{{ room.name }}</span>
              <span class="capacity-text">{{ room.capacity }} personas</span>
            </div>
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

<style scoped>
.custom-list-item {
  padding: 12px 16px;
  border-radius: 12px;
  background-color: #f5f5f5;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.custom-list-item:hover {
  background-color: #e0e0e0;
}

.item-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.custom-item-text {
  font-size: 16px;
  color: #333;
}

.capacity-text {
  font-size: 14px;
  color: #666;
}
</style>