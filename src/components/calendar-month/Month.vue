<template>
  <div class="month-view">
    <h2>Mes de {{ selectedMonth.toLocaleString('default', { month: 'long' }) }} {{ selectedMonth.getFullYear() }}</h2>
    
    <div class="grid-container">
      <!-- Fila para los nombres de los días de la semana -->
      <div class="grid-header">Días de la semana</div>
      <div v-for="(weekday, index) in weekdays" :key="index" class="grid-header">
        {{ weekday }}
      </div>
      
      <!-- Fila para los días del mes -->
      <div v-for="(day, index) in monthDays" :key="index" class="grid-item">
        {{ day.getDate() }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['selectedMonth'],
  data() {
    return {
      weekdays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'], // Días de la semana
      monthDays: this.getMonthDays(this.selectedMonth) // Días del mes
    }
  },
  methods: {
    getMonthDays(date) {
      let days = []
      let start = new Date(date.getFullYear(), date.getMonth(), 1)
      let end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      while (start <= end) {
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
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr; /* 7 columnas, una para cada día */
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr; /* 7 filas para los días del mes */
  gap: 10px;
  width: 100%;
}

.grid-header {
  font-weight: bold;
  text-align: center;
  padding: 10px;
  background-color: #f4f4f4;
}

.grid-item {
  text-align: center;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
}
</style>
