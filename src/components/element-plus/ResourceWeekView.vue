<template>
  <div class="resource-week-view">
    <div class="week-header">
      <el-button @click="prevWeek">Semana Anterior</el-button>
      <span>{{ weekRange }}</span>
      <el-button @click="nextWeek">Semana Siguiente</el-button>
    </div>
    <el-row class="calendar-grid" :gutter="0">
      <el-col :span="3">
        <div class="sticky-header">Recursos</div>
      </el-col>
      <el-col :span="21">
        <div class="time-header">
            <div v-for="hour in hours" :key="hour" :span="calcHourSpan" class="time-slot-header">{{ formatHour(hour) }}</div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col v-for="resource in resources" :key="resource.id" :span="3">
        <div class="resource-name sticky-resource">{{ resource.name }}</div>
      </el-col>
      <el-col :span="21">
        <el-row class="resource-schedule">
          <el-col v-for="hour in hours" :key="hour" :span="calcHourSpan" class="hour-cell">
            </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import isBetween from 'dayjs/plugin/isBetween';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(isBetween);
dayjs.extend(weekOfYear);
dayjs.locale('es');

const currentDate = ref(new Date());
const hours = ref(Array.from({ length: 24 }, (_, i) => i)); // Array de 0 a 23

// Datos de ejemplo (reemplazar con tu lógica real)
const resources = ref([
  { id: 1, name: 'Sala A' },
  { id: 2, name: 'Sala B' },
  { id: 3, name: 'Sala C' },
]);

const weekRange = computed(() => {
  const startOfWeek = dayjs(currentDate.value).startOf('week').format('DD MMM');
  const endOfWeek = dayjs(currentDate.value).endOf('week').format('DD MMM');
  return `${startOfWeek} - ${endOfWeek}`;
});

const prevWeek = () => {
  currentDate.value = dayjs(currentDate.value).subtract(1, 'week').toDate();
};

const nextWeek = () => {
  currentDate.value = dayjs(currentDate.value).add(1, 'week').toDate();
};

const calcHourSpan = computed(() => {
  return 24 / hours.value.length; // Distribuye las horas en el ancho disponible (24 spans)
});

const formatHour = (hour: number) => {
  return `${hour}:00`;
};
</script>

<style scoped>


.week-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.week-header el-button {
  margin: 0 5px;
}

.week-header span {
  font-weight: bold;
  margin: 0 15px;
}

.calendar-grid {
  display: flex;
  flex-direction: column;
}

.time-header {
  display: flex;
}

.time-slot-header {
  flex: 1;
  text-align: center;
  border-right: 1px solid #eee;
  padding: 8px;
  background-color: #f9f9f9;
}

.time-slot-header:last-child {
  border-right: none;
}

.resource-schedule {
  display: flex;
}

.hour-cell {
  flex: 1;
  border: 1px solid #eee;
  min-height: 60px; /* Ajusta la altura de las celdas de las horas */
}

.resource-name {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 8px;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sticky-header {
  background-color: #f9f9f9;
  padding: 8px;
  border-bottom: 1px solid #eee;
  font-weight: bold;
}

.sticky-resource {
  background-color: #f9f9f9;
  padding: 8px;
  border-right: 1px solid #eee;
  font-weight: bold;
}
</style>