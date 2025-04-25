<template>
  <div class="week-view">
    <h2>Semana de {{ selectedWeek.toDateString() }}</h2>
    
    <div class="grid-container">
      <div class="grid-header">Salas</div>
      
      <!-- Mostrar solo de lunes a viernes -->
      <div v-for="(day, index) in weekDays" :key="index" class="grid-header">
        {{ day.toDateString() }}
      </div>
      
      <div v-for="room in rooms" :key="room.id" class="grid-item">
        <h2>{{ room.building }}</h2>
        <h3>{{ room.name }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['selectedWeek', 'rooms'],
  data() {
    return {
      weekDays: this.getWeekDays(this.selectedWeek),
    }
  },
  methods: {
    getWeekDays(date) {
      let days = []
      let start = new Date(date)
      
      // Ajustar para que la semana comience el lunes (en vez del domingo)
      let dayOfWeek = start.getDay()
      let diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // Si es domingo (0), retrocede 6 días, si es cualquier otro día, retrocede hasta el lunes

      // Establecer el inicio de la semana (lunes)
      start.setDate(start.getDate() + diffToMonday)
      
      // Solo agregar de lunes a viernes
      for (let i = 0; i < 5; i++) {
        days.push(new Date(start))
        start.setDate(start.getDate() + 1)
      }
      return days
    }
  }
}
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: auto repeat(5, 1fr); /* Solo 5 columnas */
  gap: 10px;
  grid-auto-rows: auto;
  width: 100%;
}

.grid-header {
  font-weight: bold;
  text-align: center;
  padding: 10px;
  background-color: #f4f4f4;
}

.grid-item {
  grid-column: 1 / 2;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: 10px;
  border: 1px solid #000000;
}

</style>
