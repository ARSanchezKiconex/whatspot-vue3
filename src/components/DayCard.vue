<template>
  <div class="day-card" @click="handleClick">
    <span class="day-number">{{ dayData?.number }}</span>
    </div>
</template>

<script setup>
const props = defineProps({
  dayData: Object, 
});

const emit = defineEmits(['day-click']);

function handleClick() {
  if (props.dayData?.isCurrentMonth) {
    emit('day-click', props.dayData);
  }
}
</script>

<style scoped>
.day-card {
  border: 1px solid #eee;
  padding: 10px 5px;
  text-align: center;
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.9em;
  position: relative;
}

.day-card:hover {
  background-color: #f0f0f0;
}
</style>
