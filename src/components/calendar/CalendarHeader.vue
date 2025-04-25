<template>
  <div class="calendar-header">
    <button @click="$emit('previous-month')" class="nav-button">&lt;</button>
    <div class="current-month-year">
        <span class="month">{{ currentMonth }}</span>
        <span class="year">{{ currentYear }}</span>
    </div>
    <button @click="$emit('next-month')" class="nav-button">&gt;</button>
  </div>
</template>

<script setup>
defineProps({
  currentMonth: String,
  currentYear: Number,
});

// Definimos los eventos que este componente puede emitir
defineEmits(['previous-month', 'next-month']);
</script>

<style scoped>
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f8f8f8; /* Un color de fondo suave */
  border-bottom: 1px solid #eee;
  text-transform: capitalize; /* Para que el mes salga en mayúscula inicial */
}

.current-month-year {
    font-size: 1.2em;
    font-weight: bold;
    text-align: center;
    flex-grow: 1; /* Ocupa el espacio disponible */
}

.month {
    margin-right: 5px;
}

.nav-button {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  padding: 0 10px;
  color: #333;
}

.nav-button:hover {
    color: #007bff; /* Un color al pasar el ratón */
}
</style>