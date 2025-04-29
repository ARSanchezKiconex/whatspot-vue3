<template>
  <div class="mini-month-view">
    <div class="mini-header">
      <span>{{ monthName }} {{ year }}</span>
    </div>
    <div class="mini-weekdays">
      <span v-for="day in weekdays" :key="day">{{ day }}</span>
    </div>
    <div class="mini-days">
      <span
        v-for="(day, index) in daysOfMonth"
        :key="index"
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
import { computed } from 'vue';

const props = defineProps({
  selectedDate: Date, // La fecha actualmente seleccionada en el calendario principal
});

const weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const year = computed(() => props.selectedDate.getFullYear());
const month = computed(() => props.selectedDate.getMonth()); // 0-indexed
const monthName = computed(() => props.selectedDate.toLocaleDateString('es-ES', { month: 'long' }));

// Lógica para calcular días (similar a CalendarGrid, pero simplificada)
const daysOfMonth = computed(() => {
  const days = [];
  const currentMonthDate = new Date(year.value, month.value, 1);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDayTime = new Date(props.selectedDate); // Copia para evitar mutaciones
  selectedDayTime.setHours(0, 0, 0, 0);

  const daysInMonth = new Date(year.value, month.value + 1, 0).getDate();
  let firstDayOfWeek = currentMonthDate.getDay();
  if (firstDayOfWeek === 0) firstDayOfWeek = 6; else firstDayOfWeek -= 1;

  const daysInPreviousMonth = new Date(year.value, month.value, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({ number: daysInPreviousMonth - i, isCurrentMonth: false, isSelected: false, isToday: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const loopDate = new Date(year.value, month.value, day);
    loopDate.setHours(0,0,0,0); // Normalizar para comparar
    days.push({
      number: day,
      isCurrentMonth: true,
      isSelected: loopDate.getTime() === selectedDayTime.getTime(),
      isToday: loopDate.getTime() === today.getTime(),
      date: loopDate // Guardamos la fecha por si se quisiera añadir click
    });
  }

  const gridCells = 35; // Usar 5 semanas para la vista mini
  let nextMonthDay = 1;
  while (days.length < gridCells) {
    days.push({ number: nextMonthDay++, isCurrentMonth: false, isSelected: false, isToday: false });
  }

  // Si el mes tiene 6 semanas y el día seleccionado está en la última, mostrar 42
  if(days.length >= 35 && firstDayOfWeek + daysInMonth > 35 && days.slice(35).some(d => d.isSelected)) {
       while (days.length < 42) {
           days.push({ number: nextMonthDay++, isCurrentMonth: false, isSelected: false, isToday: false });
       }
       return days.slice(0,42);
  }


  return days.slice(0, gridCells); // Devolver 35 celdas por defecto
});

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
}

.other-month {
  color: #ccc;
}

.is-today {
  background-color: #eaf6ff;
  font-weight: bold;
}

.is-selected {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}
</style>