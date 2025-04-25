<template>
  <div class="day-view">
    <h2>{{ selectedDate.toDateString() }}</h2>
    
    <div class="grid-container">
      <div class="grid-header">Salas</div>
      <div class="grid-header">{{ selectedDate.toDateString() }}</div>
      
      <div v-for="room in rooms" :key="room.id" class="grid-item">
        <h2>{{ room.building }}</h2>
        <h3>{{ room.name }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['selectedDate', 'rooms'],
  data() {
    return {
    }
  }
}
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: auto 1fr;
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
