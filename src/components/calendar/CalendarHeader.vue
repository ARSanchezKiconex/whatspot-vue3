<template>
  <div class="calendar-header">
    <button @click="$emit('previous')" class="nav-button">&lt;</button>

    <div class="current-display">
      <div v-if="view === 'month'" class="month-year">
        <span class="month">{{ currentMonth }}</span>
        <span class="year">{{ currentYear }}</span>
      </div>
      <div v-if="view === 'week'" class="week-range">
        {{ currentWeekRange }} <span class="year">{{ currentYear }}</span>
      </div>
      <div v-if="view === 'day'" class="day-display">
        {{ currentDay }} <span class="year">{{ currentYear }}</span>
      </div>
    </div>
    <button @click="$emit('today')" class="nav-button today-button">Hoy</button> <button @click="$emit('next')" class="nav-button">&gt;</button>
  </div>
</template>

<script setup>
defineProps({
  currentMonth: String,
  currentYear: Number,
  currentWeekRange: String,
  currentDay: String,
  view: String, // 'month', 'week', 'day'
});

defineEmits(['previous', 'next', 'today']);
</script>

<style scoped>
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px; /* Menos padding vertical */
  background-color: #f8f8f8;
  border-bottom: 1px solid #eee;
  text-transform: capitalize;
}

.current-display {
    font-size: 1.1em; /* Ligeramente más pequeño */
    font-weight: bold;
    text-align: center;
    flex-grow: 1;
    margin: 0 10px; /* Espacio alrededor */
}

.month-year .month, .week-range, .day-display {
    margin-right: 5px;
}
.year {
    color: #666;
    font-weight: normal;
}


.nav-button {
  background: none;
  border: none;
  font-size: 1.4em;
  cursor: pointer;
  padding: 0 8px;
  color: #333;
}
.today-button {
    font-size: 0.9em; /* Botón 'Hoy' más pequeño */
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 3px 10px;
    margin: 0 10px; /* Espacio antes del botón > */
     background-color: #fff;
}


.nav-button:hover, .today-button:hover {
    color: #007bff;
}
.today-button:hover {
     border-color: #007bff;
}

</style>