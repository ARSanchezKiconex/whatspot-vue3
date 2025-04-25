<template>
  <div class="calendar-container">
    <CalendarHeader
      :current-month="currentMonthName"
      :current-year="currentYear"
      @previous-month="goToPreviousMonth"
      @next-month="goToNextMonth"
    />
    <CalendarGrid :year="currentYear" :month="currentMonthIndex" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CalendarHeader from './CalendarHeader.vue';
import CalendarGrid from './CalendarGrid.vue';

// Estado: Fecha actual como punto de partida
const currentDate = ref(new Date()); // Usamos ref para que sea reactivo

// Año y mes actuales (índice basado en 0: Enero=0, Diciembre=11)
const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonthIndex = computed(() => currentDate.value.getMonth());

// Nombre del mes actual para mostrar en la cabecera
const currentMonthName = computed(() => {
  return currentDate.value.toLocaleDateString('es-ES', { month: 'long' });
});

// Funciones para cambiar de mes
function goToPreviousMonth() {
  currentDate.value = new Date(
    currentYear.value,
    currentMonthIndex.value - 1,
    1
  );
}

function goToNextMonth() {
  currentDate.value = new Date(
    currentYear.value,
    currentMonthIndex.value + 1,
    1
  );
}
</script>

<style scoped>
.calendar-container {
  max-width: 600px; /* O el ancho que prefieras */
  margin: 20px auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-family: sans-serif;
  overflow: hidden; /* Para que el borde redondeado afecte a los hijos */
}
</style>