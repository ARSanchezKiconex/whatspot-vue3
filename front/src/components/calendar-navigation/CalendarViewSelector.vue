<template>
  <div class="view-controls">
    <label for="view-select">Vista: </label>
    <v-select
      id="view-select"
      :model-value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      :items="options"
      item-value="value"
      item-title="label"
      density="compact"
      variant="outlined"
      style="margin-top: 10px; min-width: 150px;"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  }
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.view-controls label {
    margin-right: 8px;
    font-weight: bold;
    font-size: 1em;
}

.view-controls select {
  margin-top: 10px;
  padding: 5px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  min-width: 120px;
  color: #000000;
  background-color: #e9ecef;
}
</style>
