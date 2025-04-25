<template>
  <div>
    <!-- Controles para cambiar entre vistas -->
    <div class="view-controls">
      <button @click="changeView('day')">Día</button>
      <button @click="changeView('week')">Semana</button>
      <!-- <button @click="changeView('month')">Mes</button> -->
    </div>

    <!-- Mostrar el calendario según la vista seleccionada -->
    <div v-if="currentView === 'day'">
      <!-- Vista Día -->
      <DayView :selectedDate="selectedDate" :rooms="rooms" />
    </div>
    <div v-if="currentView === 'week'">
      <!-- Vista Semana -->
      <WeekView :selectedWeek="selectedWeek" :rooms="rooms" />
    </div>
    <div v-if="currentView === 'month'">
      <!-- Vista Mes -->
      <MonthView :selectedMonth="selectedMonth" :rooms="rooms" />
    </div>
  </div>
</template>

<script>
import DayView from './DayView.vue'
import WeekView from './WeekView.vue'
import MonthView from './MonthView.vue'

export default {
  components: {
    DayView,
    WeekView,
    MonthView
  },
  data() {
    return {
      currentView: 'week', // Vista por defecto
      selectedDate: new Date(), // Fecha seleccionada
      selectedWeek: new Date(), // Semana seleccionada
      selectedMonth: new Date(), // Mes seleccionado
      rooms: [
        // Lista de salas (podrías obtenerla de una API o de tu store)
        // Edificio Intarcon
        { id: '1', building: 'Intarcon', name: 'Conference Room A' },
        { id: '2', building: 'Intarcon', name: 'Meeting Room 1' },
        { id: '3', building: 'Intarcon', name: 'Creative Studio' },
        { id: '4', building: 'Intarcon', name: 'Training Room' },
        { id: '5', building: 'Intarcon', name: 'Board Room' },
        // Edificio Keyter
        { id: '6', building: 'Keyter', name: 'Executive Suite' },
        { id: '7', building: 'Keyter', name: 'Project Room' },
        { id: '8', building: 'Keyter', name: 'Breakout Room' },
        { id: '9', building: 'Keyter', name: 'Video Conference Room' },
        { id: '10', building: 'Keyter', name: 'Training Room 2' },
        // Edificio Genaq
        { id: '11', building: 'Genaq', name: 'Workshop Room' },
        { id: '12', building: 'Genaq', name: 'Innovation Lab' },
        { id: '13', building: 'Genaq', name: 'Strategy Room' },
        { id: '14', building: 'Genaq', name: 'Focus Room' },
        { id: '15', building: 'Genaq', name: 'Collaboration Space' },
        // Más salas...
      ]
    }
  },
  methods: {
    changeView(view) {
      this.currentView = view
    }
  }
}
</script>

<style scoped>
.view-controls {
  margin-bottom: 10px;
}
.view-controls button {
  margin-right: 5px;
  padding: 8px;
  cursor: pointer;
}
</style>