<template>
  <div class="day-card" @click="handleClick">
    <span class="day-number">{{ dayData?.number }}</span>
    </div>
</template>

<script setup>
const props = defineProps({
  dayData: Object, // Espera un objeto como { number: 15, isCurrentMonth: true, ... }
});

const emit = defineEmits(['day-click']);

function handleClick() {
  // Solo emitir si es un día válido del mes actual (o como prefieras)
  if (props.dayData?.isCurrentMonth) {
    emit('day-click', props.dayData);
  }
}
</script>

<style scoped>
.day-card {
  border: 1px solid #eee;
  padding: 10px 5px; /* Ajusta el padding */
  text-align: center;
  min-height: 50px; /* Altura mínima para las celdas */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.9em;
  position: relative; /* Para futuros elementos absolutos como badges */
}

.day-card:hover {
  background-color: #f0f0f0; /* Efecto hover suave */
}

/* Estilos aplicados desde CalendarGrid */
.day-card.is-other-month {
  color: #aaa;
  opacity: 0.6;
  cursor: default; /* No hacer clic en días de otro mes */
  background-color: #fafafa;
}

.day-card.is-other-month:hover {
    background-color: #fafafa; /* Evitar hover en días de otro mes */
}

.day-card.is-today {
  font-weight: bold;
  background-color: #eaf6ff; /* Un fondo sutil para hoy */
  border-color: #007bff;
}

.day-card.is-weekend {
    color: #d9534f; /* Color diferente para fines de semana */
}

/* Sobrescribir si es finde Y de otro mes */
.day-card.is-weekend.is-other-month {
    color: #eeb4b2;
    opacity: 0.6;
}


.day-number {
    /* Estilos para el número si necesitas */
}
</style>