<template>
  <div class="view-selector">
    <el-button-group>
      <el-button
        :type="selected === 'daily' ? 'primary' : 'default'"
        @click="selectView('daily')"
      >
        Diaria
      </el-button>
      <el-button
        :type="selected === 'weekly' ? 'primary' : 'default'"
        @click="selectView('weekly')"
      >
        Semanal
      </el-button>
      <el-button
        :type="selected === 'monthly' ? 'primary' : 'default'"
        @click="selectView('monthly')"
      >
        Mensual
      </el-button>
    </el-button-group>
  </div>
  <div class="custom-week-view">
    <div class="week-header">
      <el-button @click="prevWeek">Semana Anterior</el-button>
      <span>{{ weekRange }}</span>
      <el-button @click="nextWeek">Semana Siguiente</el-button>
    </div>
    <el-row :gutter="10" class="week-days-names">
      <el-col>Salas</el-col>
      <el-col v-for="(dayName, index) in dayNames" :key="index" :span="calcSpan">
        <div class="day-name-cell">
          {{ dayName }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col v-for="(day, index) in weekDays" :key="index" :span="calcSpan">
        <div class="day-cell">
          <span class="day-number">{{ dayjs(day).date() }}</span>
          </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElButton, ElButtonGroup } from 'element-plus'
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import isBetween from 'dayjs/plugin/isBetween';
import weekOfYear from 'dayjs/plugin/weekOfYear';

/* Métodos para el selector de vista */

const props = defineProps({
  modelValue: {
    type: String,
    default: 'daily',
  },
})

const emit = defineEmits(['update:modelValue'])

const selected = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  selected.value = newVal
})

const selectView = (view) => {
  selected.value = view
  emit('update:modelValue', view)
}

/* Métodos para visualizar la semana */

dayjs.extend(isBetween);
dayjs.extend(weekOfYear);
dayjs.locale('es');

const currentDate = ref(new Date());

const weekDays = computed(() => {
  const startOfWeek = dayjs(currentDate.value).startOf('week');
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(startOfWeek.add(i, 'day').toDate());
  }
  return days;
});

const weekRange = computed(() => {
  const startOfWeek = dayjs(weekDays.value[0]).format('DD MMM');
  const endOfWeek = dayjs(weekDays.value[6]).format('DD MMM');
  return `${startOfWeek} - ${endOfWeek}`;
});

const dayNames = computed(() => {
  const startOfWeek = dayjs(currentDate.value).startOf('week');
  const names = [];
  for (let i = 0; i < 7; i++) {
    names.push(dayjs(startOfWeek.add(i, 'day')).format('ddd')); // 'ddd' da el nombre abreviado del día (Lun, Mar, etc.)
  }
  return names;
});

const prevWeek = () => {
  currentDate.value = dayjs(currentDate.value).subtract(1, 'week').toDate();
};

const nextWeek = () => {
  currentDate.value = dayjs(currentDate.value).add(1, 'week').toDate();
};

const calcSpan = computed(() => {
  return 24 / 7;
});
</script>

<style scoped>
.view-selector {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.custom-week-view {
  /* Estilos generales del componente */
}

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

.week-days-names {
  margin-bottom: 5px; /* Espacio entre los nombres de los días y los números */
}

.day-name-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px; /* Altura para la celda del nombre del día */
  width: 200px;
  font-weight: bold;
  color: #555;
}

.day-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: auto; /* Ajusta este valor a la altura deseada */
  min-width: 200px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #f9f9f9;
  padding: 8px;
}

.day-number {
  font-weight: bold;
  margin-bottom: 5px;
}
</style>