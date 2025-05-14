<template>
  <div class="day-view">
    <div class="header-row">
      <div class="resource-header">Salas</div>
      <div class="time-header">
        <div v-for="hour in timeSlots" :key="hour" class="hour-slot-header">
          {{ formatHour(hour) }}
        </div>
      </div>
    </div>

    <div class="schedule-grid">
      <div class="resource-row" v-for="resource in resources" :key="resource.id">
        <div class="resource-cell">
          <span class="resource-name">{{ resource.name }}</span>
          <span class="resource-building">{{ resource.building }}</span>
        </div>
        <div class="time-row">
          <div class="hour-lines">
            <div v-for="hour in timeSlots.slice(1)" :key="`line-${hour}`" class="hour-line"></div>
          </div>
          <div class="events-container">
            <div
              v-for="event in eventsByResource[resource.id] || []"
              :key="event.id"
              class="event-block"
              :style="getEventStyle(event)"
              :title="`${event.title} (${formatTime(event.start)} - ${formatTime(event.end)})`"
            >
              <span class="event-title">{{ event.title }}</span>
              <span class="event-time">{{ formatTime(event.start) }} - {{ formatTime(event.end) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  selectedDate: Date,
  resources: Array,
  events: Array,
});

const startHour = 0;
const endHour = 24;
const pixelsPerHour = 15;

const timeSlots = computed(() => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(hour);
  }
  return slots;
});

function formatHour(hour) {
  return `${String(hour).padStart(2, '0')}:00`;
}
function formatTime(date) {
  if (!date) return '';
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
}

const eventsForDay = computed(() => {
  const dayStart = new Date(props.selectedDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(props.selectedDate);
  dayEnd.setHours(23, 59, 59, 999);
  return props.events.filter(
    (event) => event.start >= dayStart && event.start < dayEnd
  );
});

// Agrupar eventos por recurso
const eventsByResource = computed(() => {
  const grouped = {};
  for (const event of eventsForDay.value) {
    if (!grouped[event.resourceId]) {
      grouped[event.resourceId] = [];
    }
    grouped[event.resourceId].push(event);
  }
  return grouped;
});

function getEventStyle(event) {
  const startMinutes = event.start.getHours() * 60 + event.start.getMinutes();
  const endMinutes = event.end.getHours() * 60 + event.end.getMinutes();

  const minutesFromViewStart = Math.max(0, startMinutes - startHour * 60);
  const eventDurationMinutes = Math.max(15, endMinutes - startMinutes);

  const leftOffset = (minutesFromViewStart / 60) * pixelsPerHour;
  const width = (eventDurationMinutes / 60) * pixelsPerHour;

  return {
    left: `${leftOffset}px`,
    width: `${width - 2}px`,
    position: 'absolute',
    top: '0px',
    height: '100%',
  };
}
</script>

<style scoped>
.day-view {
  display: flex;
  flex-direction: column;
  border-top: 1px solid #eee;
  overflow: auto;
}

.header-row {
  display: flex;
  border-bottom: 1px solid #ccc;
  background-color: #f8f8f8;
}

.resource-header {
  width: 180px;
  padding: 10px;
  border-right: 1px solid #ccc;
  font-weight: bold;
  flex-shrink: 0;
}

.time-header {
  flex-grow: 1;
  display: flex;
}

.hour-slot-header {
  width: 60px;
  text-align: center;
  padding: 10px 5px;
  border-left: 1px solid #eee;
  font-size: 0.9em;
  color: #666;
  flex-shrink: 0;
}

.schedule-grid {
  display: flex;
  flex-direction: column;
}

.resource-row {
  display: flex;
  border-bottom: 1px solid #eee;
  height: 70px;
  flex-shrink: 0;
}

.resource-cell {
  width: 180px;
  padding: 10px;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.resource-name {
  font-weight: bold;
  font-size: 0.9em;
  margin-bottom: 3px;
}
.resource-building {
  font-size: 0.8em;
  color: #666;
}

.time-row {
  flex-grow: 1;
  position: relative;
  display: flex;
  overflow: hidden;
  border-left: 1px solid #eee;
}

.hour-lines {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
}

.hour-line {
  width: 60px;
  border-left: 1px dashed #eee;
  flex-shrink: 0;
  height: 100%;
}

.events-container {
  position: relative;
  width: calc(60px * 11); /* slots 8 a 18 */
  height: 100%;
}

.event-block {
  background-color: rgba(0, 123, 255, 0.7);
  border: 1px solid #0056b3;
  color: white;
  border-radius: 4px;
  padding: 3px 5px;
  font-size: 0.75em;
  overflow: hidden;
  cursor: pointer;
  box-sizing: border-box;
}
.event-title {
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.event-time {
  font-size: 0.8em;
  opacity: 0.9;
}
</style>
