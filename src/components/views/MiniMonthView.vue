<template>
  <div class="mini-month-view">
    <div class="mini-header">
      <button @click="prevMonth" class="nav-button">
        <i class="fa-solid fa-caret-left"></i>
      </button>
        <span class="month-name">{{ monthName }} {{ year }}</span>
      <button @click="nextMonth" class="nav-button">
        <i class="fa-solid fa-caret-right"></i>
      </button>
    </div>
    <div class="mini-weekdays">
      <span v-for="day in weekdays" :key="day">{{ day }}</span>
    </div>
    <div class="mini-days">
      <span
        v-for="(day, index) in daysOfMonth"
        :key="index"
        @click="selectDay(day)"
        :class="{
          'day-cell': true,
          'other-month': !day.isCurrentMonth,
          'is-selected': day.isSelected,
          'is-today': day.isToday && !day.isSelected // No solapar 'hoy' si está seleccionado
        }"
      >
        {{ day.number }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const emit = defineEmits(['dateSelected']);
const props = defineProps({
  selectedDate: Date,
});

const currentDate = ref(new Date(props.selectedDate));

// Actualizar `currentDate` si cambia `props.selectedDate` externamente
watch(() => props.selectedDate, (newVal) => {
  currentDate.value = new Date(newVal);
});

function prevMonth() {
  const newDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
  currentDate.value = newDate;
}

function nextMonth() {
  const newDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
  currentDate.value = newDate;
}

const year = computed(() => currentDate.value.getFullYear());
const month = computed(() => currentDate.value.getMonth());
const monthName = computed(() => currentDate.value.toLocaleDateString('es-ES', { month: 'long' }));

const weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const daysOfMonth = computed(() => {
  const days = [];
  const firstOfMonth = new Date(year.value, month.value, 1);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDayTime = new Date(props.selectedDate);
  selectedDayTime.setHours(0, 0, 0, 0);

  let firstDayOfWeek = firstOfMonth.getDay();
  if (firstDayOfWeek === 0) firstDayOfWeek = 6; else firstDayOfWeek -= 1;

  const daysInPreviousMonth = new Date(year.value, month.value, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayDate = new Date(year.value, month.value - 1, daysInPreviousMonth - i);
    days.push({ number: dayDate.getDate(), isCurrentMonth: false, isSelected: false, isToday: false });
  }

  const daysInThisMonth = new Date(year.value, month.value + 1, 0).getDate();
  for (let day = 1; day <= daysInThisMonth; day++) {
    const loopDate = new Date(year.value, month.value, day);
    loopDate.setHours(0, 0, 0, 0);
    days.push({
      number: day,
      isCurrentMonth: true,
      isSelected: loopDate.getTime() === selectedDayTime.getTime(),
      isToday: loopDate.getTime() === today.getTime(),
      date: loopDate,
    });
  }

  const totalCells = 42;
  let nextDay = 1;
  while (days.length < totalCells) {
    const dayDate = new Date(year.value, month.value + 1, nextDay++);
    days.push({ number: dayDate.getDate(), isCurrentMonth: false, isSelected: false, isToday: false });
  }

  return days;
});

function selectDay(day) {
  if (!day.isCurrentMonth) return;
  emit('dateSelected', day.date);
}
</script>


<style scoped>
.mini-month-view {
  padding: 10px;
  font-family: sans-serif;
  font-size: 0.8em; /* Más pequeño */
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #fff;
}

.month-name{
  margin: 0 15px;
  cursor: default;
}

.mini-header {
  text-align: center;
  font-weight: bold;
  margin-bottom: 8px;
  text-transform: capitalize;
}

.mini-weekdays, .mini-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}

.mini-weekdays span {
  font-weight: bold;
  color: #666;
  padding-bottom: 5px;
}

.day-cell {
  padding: 4px 2px;
  border-radius: 3px;
  line-height: 1.5; /* Mejor espaciado vertical */
  cursor: pointer;
}

.other-month {
  color: #ccc;
}

.is-today {
  /* background-color: #eaf6ff; */
  color:#007bff;
  font-weight: bold;
}

.nav-button:hover {
    color: #007bff;
}

.is-selected {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}
</style>