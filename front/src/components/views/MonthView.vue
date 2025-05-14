<template>
  <div class="month-view">
    <div class="month-header">
      <button @click="prevMonth">&lt;</button>
      <h2>{{ displayedMonth }} {{ displayedYear }}</h2>
      <button @click="nextMonth">&gt;</button>
    </div>
    <div class="week-days-header">
      <div v-for="dayName in shortWeekDays" :key="dayName" class="day-name">{{ dayName }}</div>
    </div>
    <div class="month-grid">
      <div
        v-for="dayInfo in daysInMonth"
        :key="dayInfo.date.toISOString()"
        class="day-cell"
        :class="{
          'empty': !dayInfo.isCurrentMonth,
          'has-events': hasEventsOnDay(dayInfo.date)
        }"
        @click="selectDay(dayInfo.date)"
      >
        <span class="day-number">{{ dayInfo.dayNumber }}</span>
        <div v-if="hasEventsOnDay(dayInfo.date)" class="event-indicator">
          {{ getEventsCountOnDay(dayInfo.date) }} evento(s)
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  selectedDate: Date,
  resources: Array,
  events: Array,
});

const currentDate = ref(new Date(props.selectedDate));

const displayedMonth = computed(() => {
  return currentDate.value.toLocaleDateString('es-ES', { month: 'long' });
});

const displayedYear = computed(() => {
  return currentDate.value.getFullYear();
});

const shortWeekDays = computed(() => {
  const days = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
  return days;
});

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const days = [];

  // Calcular los días del mes anterior para la primera semana
  const firstDayWeekday = firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay(); // Lunes es 1, Domingo es 7
  for (let i = firstDayWeekday - 1; i > 0; i--) {
    const prevMonthDay = new Date(year, month, 1 - i);
    days.push({
      date: prevMonthDay,
      dayNumber: prevMonthDay.getDate(),
      isCurrentMonth: false,
    });
  }

  // Añadir los días del mes actual
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const currentDay = new Date(year, month, i);
    days.push({
      date: currentDay,
      dayNumber: currentDay.getDate(),
      isCurrentMonth: true,
    });
  }

  // Calcular los días del mes siguiente para la última semana
  const lastDayWeekday = lastDayOfMonth.getDay() === 0 ? 7 : lastDayOfMonth.getDay();
  const daysToAdd = 7 - lastDayWeekday;
  for (let i = 1; i <= daysToAdd; i++) {
    const nextMonthDay = new Date(year, month + 1, i);
    days.push({
      date: nextMonthDay,
      dayNumber: nextMonthDay.getDate(),
      isCurrentMonth: false,
    });
  }

  return days;
});

function prevMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
}

function hasEventsOnDay(date) {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  return props.events.some(event => event.start >= dayStart && event.start <= dayEnd);
}

function getEventsCountOnDay(date) {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  return props.events.filter(event => event.start >= dayStart && event.start <= dayEnd).length;
}

function selectDay(date) {
  // Aquí puedes emitir un evento o actualizar otra variable para mostrar la vista semanal de este día.
  console.log('Día seleccionado:', date);
}
</script>

<style scoped>
.month-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
}

.month-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #eee;
}

.month-header button {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
  background-color: white;
}

.month-header h2 {
  margin: 0;
  font-size: 1.2em;
}

.week-days-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #eee;
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
}

.day-name {
  text-align: center;
  font-size: 0.9em;
  color: #666;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day-cell {
  padding: 10px;
  border-right: 1px solid #eee;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;
  position: relative;
}

.day-cell:last-child {
  border-right: none;
}

/* Ajustar la altura para que las semanas sean consistentes */
.month-grid .day-cell:nth-child(7n) ~ .day-cell {
  /* No aplicar borde inferior al final de cada semana */
}

.day-cell.empty {
  color: #ccc;
}

.day-number {
  font-size: 0.9em;
  font-weight: bold;
  margin-bottom: 5px;
}

.has-events {
  /* Puedes añadir un estilo visual para los días con eventos */
  /* background-color: #e0f7fa; */
}

.event-indicator {
  background-color: #007bff;
  color: white;
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 0.7em;
}
</style>