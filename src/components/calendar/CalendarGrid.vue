<template>
  <div class="calendar-grid">
    <div class="weekdays">
      <span v-for="day in weekdays" :key="day" class="weekday">{{ day }}</span>
    </div>
    <div class="days">
      <DayCard
        v-for="(day, index) in daysOfMonth"
        :key="`${year}-${month}-${index}`"
        :day-data="day"
        :class="{
          'is-today': day.isToday,
          'is-other-month': !day.isCurrentMonth,
          'is-weekend': day.isWeekend
        }"
        @day-click="handleDayClick"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import DayCard from './DayCard.vue';

const props = defineProps({
  year: Number,
  month: Number, // Mes basado en 0 (Enero=0)
});

// Nombres de los días de la semana (puedes ajustar el inicio)
const weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// Lógica principal para calcular los días del mes
const daysOfMonth = computed(() => {
  const days = [];
  const date = new Date(props.year, props.month, 1);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Poner a medianoche para comparar solo fechas

  const daysInMonth = new Date(props.year, props.month + 1, 0).getDate();
  // Día de la semana del primer día (0=Domingo, 1=Lunes... ajustamos a Lunes=0)
  let firstDayOfWeek = date.getDay();
  if (firstDayOfWeek === 0) firstDayOfWeek = 6; // Domingo pasa a ser 6
  else firstDayOfWeek -= 1; // Lunes es 0, Martes 1...

  // Días del mes anterior para rellenar
  const daysInPreviousMonth = new Date(props.year, props.month, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNumber = daysInPreviousMonth - i;
    days.push({
      number: dayNumber,
      isCurrentMonth: false,
      isToday: false,
      isWeekend: false, // Podrías calcularlo si quieres
      date: new Date(props.year, props.month - 1, dayNumber),
    });
  }

  // Días del mes actual
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(props.year, props.month, day);
    const dayOfWeek = currentDate.getDay(); // 0=Domingo, 6=Sábado
    days.push({
      number: day,
      isCurrentMonth: true,
      isToday: currentDate.getTime() === today.getTime(),
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      date: currentDate,
    });
  }

  // Días del mes siguiente para rellenar
  const gridsize = 42; // 6 semanas * 7 días = 42 celdas
  let nextMonthDay = 1;
  while (days.length < gridsize) { // Puedes ajustar esto si no quieres 6 semanas fijas
     days.push({
      number: nextMonthDay,
      isCurrentMonth: false,
      isToday: false,
      isWeekend: false, // Podrías calcularlo
      date: new Date(props.year, props.month + 1, nextMonthDay),
    });
    nextMonthDay++;
  }
  // Opcional: Truncar a 35 si cabe (5 semanas)
  // if (days.length > 35 && days[35].isCurrentMonth === false) {
  //    return days.slice(0, 35);
  // }


  return days.slice(0, gridsize); // Asegura 42 días o ajusta según necesites
});

// Función para manejar el clic en un día (opcional)
function handleDayClick(dayData) {
  console.log('Día clickeado:', dayData);
  // Aquí podrías emitir un evento hacia el padre o hacer otra acción
}

</script>

<style scoped>
.calendar-grid {
  padding: 10px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 10px;
  font-weight: bold;
  color: #666;
  font-size: 0.9em;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px; /* Espacio entre días */
}

/* Las clases dinámicas se aplican a DayCard, los estilos irán allí */
</style>