<template>
  <div class="calendar-grid">
    <div class="grid-header">
      <div
        v-for="(dayName, index) in dayNames"
        :key="index"
        class="header-cell"
      >
        {{ dayName }}
      </div>
    </div>
    <div class="grid-body">
      <div
        v-for="(week, weekIndex) in monthGrid"
        :key="weekIndex"
        class="grid-row"
      >
        <div
          v-for="(day, dayIndex) in week"
          :key="dayIndex"
          class="grid-cell"
          :class="{
            'today': isToday(day),
            'other-month': isOtherMonth(day),
            'selected': isSelected(day)
          }"
          @click="selectDay(day)"
        >
          <span class="day-number">{{ day ? day.getDate() : '' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

const props = defineProps({
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number, // 0-indexed
    required: true,
  },
  selectedDate: {
    type: Date,
    default: null,
  },
});

const emit = defineEmits(['update:selectedDate']);

const dayNames = computed(() => {
  const startOfWeek = dayjs().startOf('week');
  return Array.from({ length: 7 }, (_, i) =>
    startOfWeek.add(i, 'day').format('dd')
  );
});

const monthGrid = computed(() => {
  const firstDayOfMonth = dayjs(new Date(props.year, props.month, 1)).startOf(
    'month'
  );
  const lastDayOfMonth = dayjs(new Date(props.year, props.month, 1)).endOf(
    'month'
  );
  const firstDayOfCalendar = firstDayOfMonth.startOf('week');
  const lastDayOfCalendar = lastDayOfMonth.endOf('week');

  const totalDays = lastDayOfCalendar.diff(firstDayOfCalendar, 'day') + 1;
  const daysArray = Array.from({ length: totalDays }, (_, i) =>
    firstDayOfCalendar.add(i, 'day').toDate()
  );

  const weeks = [];
  for (let i = 0; i < totalDays; i += 7) {
    weeks.push(daysArray.slice(i, i + 7));
  }
  return weeks;
});

const today = computed(() => new Date());

const isToday = (date: Date | null) => {
  return date ? dayjs(date).isSame(today.value, 'day') : false;
};

const isOtherMonth = (date: Date | null) => {
  if (!date) return false;
  const currentMonth = props.month;
  return dayjs(date).month() !== currentMonth;
};

const isSelected = (date: Date | null) => {
  return date && props.selectedDate
    ? dayjs(date).isSame(props.selectedDate, 'day')
    : false;
};

const selectDay = (date: Date | null) => {
  if (date && !isOtherMonth(date)) {
    emit('update:selectedDate', date);
  }
};
</script>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border: 1px solid #ccc;
  border-radius: 4px;
}

.grid-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.header-cell {
  padding: 8px;
  text-align: center;
  font-weight: bold;
  border-bottom: 1px solid #eee;
}

.grid-body {
  /* No necesitamos un display específico aquí, los elementos hijos (grid-row) fluirán */
}

.grid-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.grid-cell {
  padding: 10px;
  text-align: center;
  border-right: 1px solid #eee;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.grid-cell:last-child {
  border-right: none;
}

.grid-row:last-child .grid-cell {
  border-bottom: none;
}

.today {
  background-color: #f0f9eb;
  color: #67c23a;
  font-weight: bold;
}

.other-month {
  color: #bbb;
}

.selected {
  background-color: #409eff;
  color: white;
  font-weight: bold;
}

.day-number {
  display: block;
}
</style>