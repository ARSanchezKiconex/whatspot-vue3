<template>
  <v-row align="center">
    <span>Solo mío</span>
    <v-switch
      class="switch-booking"
      :model-value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      hide-details
      color="primary"
    />
  </v-row>
</template>

<script setup>
defineProps({
  modelValue: Boolean
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.v-row span {
  margin-left: 20px;
}

.switch-booking {
  margin-left: 10px;
}
</style>
