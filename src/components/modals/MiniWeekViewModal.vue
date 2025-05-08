<template>
  <el-dialog
    v-model="isVisible"
    title="Añadir Reserva por Hora"
    width="70%"
    @close="closeModal"
  >
    <div class="mini-week-view-hourly">
      <div class="week-header">
        <el-button @click="prevWeek">Semana Anterior</el-button>
        <span>{{ weekRange }}</span>
        <el-button @click="nextWeek">Semana Siguiente</el-button>
      </div>
      <div class="schedule-grid">
        <div class="time-column">
          <div class="time-header">Hora</div>
          <div
            v-for="hour in timeSlots"
            :key="hour"
            class="time-slot"
          >
            {{ formatHour(hour) }}
          </div>
        </div>
        <div
          v-for="(day, index) in weekDays"
          :key="index"
          class="day-column"
        >
          <div class="day-header">{{ formatDayHeader(day) }}</div>
          <div
            v-for="hour in timeSlots"
            :key="hour"
            class="add-button-cell"
          >
            <el-button @click="openBookingForm(day, formatHour(hour))" size="small">
              <el-icon><Plus /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeModal">Cancelar</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import isBetween from 'dayjs/plugin/isBetween';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { ElDialog, ElButton, ElIcon } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

dayjs.extend(isBetween);
dayjs.extend(weekOfYear);
dayjs.locale('es');

const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(['close', 'open-booking']);

const isVisible = computed(() => props.show);

const currentDate = ref(new Date());
const timeSlots = ref(Array.from({ length: 24 }, (_, i) => i)); // Array de 0 a 23

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

const prevWeek = () => {
  currentDate.value = dayjs(currentDate.value).subtract(1, 'week').toDate();
};

const nextWeek = () => {
  currentDate.value = dayjs(currentDate.value).add(1, 'week').toDate();
};

const formatDayHeader = (date: Date) => {
  return dayjs(date).format('ddd DD');
};

const formatHour = (hour: number) => {
  return `${String(hour).padStart(2, '0')}:00`;
};

const openBookingForm = (date: Date, time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const bookingDate = new Date(date);
  bookingDate.setHours(hours, minutes, 0, 0);

  emit('open-booking', { date: bookingDate });
  closeModal();
};

const closeModal = () => {
  emit('close');
  currentDate.value = new Date(); // Reset to current week when closed
};
</script>

<style scoped>
.mini-week-view-hourly {
  display: flex;
  flex-direction: column;
  max-height: 50vh; /* Ejemplo: 80% de la altura de la ventana */
  overflow-y: auto; /* Añade scroll vertical cuando el contenido excede la altura */
}

.week-header {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
  flex-shrink: 0; /* Evita que el encabezado se encoja con el scroll */
}

.week-header el-button {
  margin: 0 10px;
}

.schedule-grid {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr); /* Hora + 7 días */
  border: 1px solid #ccc;
}

.time-column,
.day-column {
  display: flex;
  flex-direction: column;
}

.time-header,
.day-header {
  padding: 10px;
  text-align: center;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  flex-shrink: 0; /* Evita que los encabezados se encojan */
}

.time-slot,
.add-button-cell {
  padding: 8px;
  text-align: center;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: center;
  align-items: center;
}

.time-column .time-slot {
  text-align: left;
  padding-left: 15px;
  justify-content: flex-start;
  flex-shrink: 0; /* Evita que la columna de tiempo se encoja */
}

.day-column .add-button-cell {
  border-left: 1px solid #eee;
}

.schedule-grid > *:nth-child(9n) {
  border-right: 1px solid #ccc; /* Borde derecho para la última columna del día */
}

.schedule-grid > *:nth-child(n + 2):nth-child(-n + 9) {
  /* Estilos para los encabezados de los días */
  flex-shrink: 0; /* Evita que los encabezados de los días se encojan */
}
</style>