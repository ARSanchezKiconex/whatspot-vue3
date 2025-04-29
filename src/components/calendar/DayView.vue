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
      <div class="resource-column">
        <div v-for="resource in resources" :key="resource.id" class="resource-cell">
           <span class="resource-name">{{ resource.name }}</span>
           <span class="resource-building">{{ resource.building }}</span>
        </div>
      </div>
      <div class="time-grid">
         <div class="hour-lines">
             <div v-for="hour in timeSlots.slice(1)" :key="`line-${hour}`" class="hour-line"></div>
        </div>
        <div class="events-container">
           <div
              v-for="event in eventsForDay"
              :key="event.id"
              class="event-block"
              :style="getEventStyle(event)"
              :title="`${event.title} (${formatTime(event.start)} - ${formatTime(event.end)}) en ${getResourceName(event.resourceId)}`"
           >
               <span class="event-title">{{ event.title }}</span>
               <span class="event-time">{{ formatTime(event.start) }} - {{ formatTime(event.end) }}</span>
               <span class="event-resource">{{ getResourceName(event.resourceId) }}</span>
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

const startHour = 8; // Hora de inicio de la vista
const endHour = 19; // Hora de fin de la vista (no inclusiva)
const slotDurationMinutes = 60; // Duración de cada slot (e.g., 60 para horas)
const pixelsPerHour = 60; // Cuántos píxeles representa una hora (ajusta para escala)

// Generar slots de tiempo (e.g., [8, 9, 10 ... 18])
const timeSlots = computed(() => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(hour);
  }
  return slots;
});

// Formatear hora (e.g., 9 -> 09:00)
function formatHour(hour) {
  return `${String(hour).padStart(2, '0')}:00`;
}
// Formatear hora de evento
function formatTime(date) {
    if(!date) return '';
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
}


// Filtrar eventos solo para el día seleccionado
const eventsForDay = computed(() => {
  const dayStart = new Date(props.selectedDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(props.selectedDate);
  dayEnd.setHours(23, 59, 59, 999);

  return props.events.filter(event =>
    event.start >= dayStart && event.start < dayEnd // Eventos que empiezan hoy
  );
});

// Encontrar el índice de un recurso para posicionamiento vertical
function getResourceIndex(resourceId) {
    return props.resources.findIndex(r => r.id === resourceId);
}
// Obtener nombre de recurso
function getResourceName(resourceId) {
    const resource = props.resources.find(r => r.id === resourceId);
    return resource ? resource.name : 'Desconocido';
}


// Calcular estilo (posición y tamaño) para un bloque de evento
function getEventStyle(event) {
  const resourceIndex = getResourceIndex(event.resourceId);
  if (resourceIndex === -1) return {}; // No mostrar si el recurso no existe

  const startMinutes = event.start.getHours() * 60 + event.start.getMinutes();
  const endMinutes = event.end.getHours() * 60 + event.end.getMinutes();

  // Calcular minutos desde el inicio de la jornada visible
  const minutesFromViewStart = Math.max(0, startMinutes - startHour * 60);
  const eventDurationMinutes = Math.max(15, endMinutes - startMinutes); // Duración mínima de 15 min

  // Calcular posición y tamaño en píxeles
  const topOffset = (minutesFromViewStart / 60) * pixelsPerHour;
  const height = (eventDurationMinutes / 60) * pixelsPerHour;
  const resourceRowHeight = 70; // Debe coincidir con la altura de .resource-cell

  return {
    top: `${resourceIndex * resourceRowHeight + topOffset}px`, // Posición vertical basada en recurso y hora
    height: `${height - 2}px`, // Altura basada en duración (-2 por borde/padding)
    // El ancho y left se manejan por el contenedor, pero podrías añadir solapamiento aquí
    left: '0px', // Empieza al principio del slot de tiempo
    width: 'calc(100% - 4px)', // Ocupa el ancho del contenedor menos un margen
    position: 'absolute', // Necesario para top/left/height
  };
}

</script>

<style scoped>
.day-view {
  display: flex;
  flex-direction: column;
  height: 600px; /* Altura fija */
  border-top: 1px solid #eee;
  overflow: hidden; /* Ocultar desbordamiento general */
}

.header-row {
  display: flex;
  border-bottom: 1px solid #ccc;
  background-color: #f8f8f8;
  flex-shrink: 0;
}

.resource-header {
  width: 180px; /* Ancho columna recursos */
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
  width: 80px; /* Ancho de cada slot de hora */
  text-align: center;
  padding: 10px 5px;
  border-left: 1px solid #eee;
  font-size: 0.9em;
  color: #666;
  flex-shrink: 0; /* No encoger los slots */
}

.schedule-grid {
  display: flex;
  flex-grow: 1;
  overflow: hidden; /* Clave para que el scroll funcione abajo */
}

.resource-column {
  width: 180px; /* Mismo ancho que cabecera */
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden; /* No necesita scroll si el grid principal lo tiene */
}

.resource-cell {
  padding: 10px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
  height: 70px; /* Altura fija por recurso */
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.resource-cell .resource-name {
    font-weight: bold;
    font-size: 0.9em;
    margin-bottom: 3px;
}
.resource-cell .resource-building {
    font-size: 0.8em;
    color: #666;
}


.time-grid {
  flex-grow: 1;
  position: relative; /* Padre para posicionar eventos y líneas */
  overflow: auto; /* Scroll vertical y horizontal */
  display: flex; /* Necesario para que el contenido interno se expanda */
}


.hour-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%; /* Ocupa todo el ancho posible */
    height: 100%; /* Ocupa toda la altura posible */
    display: flex;
    pointer-events: none; /* Para no interferir con clicks en eventos */
}

.hour-line {
    width: 80px; /* Mismo ancho que header de hora */
    height: 100%; /* Línea vertical completa */
    border-left: 1px dashed #eee; /* Línea de hora */
    flex-shrink: 0;
}
/* La primera línea (implícita en el borde de resource-column) no se dibuja */


.events-container {
    position: relative; /* Contexto para los eventos absolutos */
    width: calc(80px * v-bind(timeSlots.length)); /* Ancho total basado en slots */
    min-height: calc(70px * v-bind(resources.length)); /* Altura mínima basada en recursos */
    height: 100%; /* Asegura que ocupe el espacio */
}


.event-block {
  background-color: rgba(0, 123, 255, 0.7); /* Azul con transparencia */
  border: 1px solid #0056b3;
  color: white;
  border-radius: 4px;
  padding: 3px 5px;
  font-size: 0.8em;
  overflow: hidden;
  cursor: pointer;
  box-sizing: border-box; /* Incluir padding/border en el tamaño */
}
.event-block:hover {
    opacity: 0.9;
}

.event-title {
    font-weight: bold;
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.event-time, .event-resource {
    font-size: 0.9em;
    display: block;
    opacity: 0.9;
     white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}


</style>