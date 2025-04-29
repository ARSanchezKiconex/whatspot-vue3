<DayCard
    ...
    @click="handleDayClick(day)" />

<script setup>
// ... (resto del script como antes) ...
const emit = defineEmits(['date-selected']); // Definir el emit

function handleDayClick(dayData) {
  if (dayData.isCurrentMonth) {
    // Emitir la fecha completa al componente padre
    emit('date-selected', new Date(dayData.date));
  }
}
</script>