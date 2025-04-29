<template>
  <div class="calendar-layout">
    <div class="sidebar">
      <MiniMonthView :selected-date="selectedDate" />
      <ResourceFilter
        :all-resources="allResources"
        v-model:selected-building-ids="selectedBuildingIds"
      />
    </div>

    <div class="main-content">
      <div class="view-controls">
          <label for="view-select">Vista: </label>
          <select id="view-select" v-model="currentView">
              <option value="month">Mes</option>
              <option value="week">Semana</option>
              <option value="day">Día</option>
              <option value="agenda" disabled>Agenda (Próximamente)</option> </select>
      </div>

      <CalendarHeader
        :current-month="displayMonthName"
        :current-year="displayYear"
        :current-week-range="displayWeekRange"
        :current-day="displayDay"
        :view="currentView"
        @previous="navigatePrevious"
        @next="navigateNext"
        @today="goToToday"
      />

      <div class="calendar-body">
        <CalendarGrid
          v-if="currentView === 'month'"
          :year="selectedDate.getFullYear()"
          :month="selectedDate.getMonth()"
          @date-selected="selectDateAndSwitchView"
        />
        <WeekView
          v-if="currentView === 'week'"
          :selected-date="selectedDate"
          :resources="filteredResources" :events="filteredEvents"       />
        <DayView
          v-if="currentView === 'day'"
          :selected-date="selectedDate"
          :resources="filteredResources" :events="filteredEvents"       />
      </div>

        <button class="fab-add-event" @click="openEventModal()" title="Crear Nueva Reserva">
         +
        </button>

    </div> <EventFormModal
      :show="isModalVisible"
      :initial-data="modalInitialData"
      :all-resources="allResources"
      @close="closeEventModal"
      @save-event="handleSaveEvent"
    />

    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import CalendarHeader from './CalendarHeader.vue';
import CalendarGrid from './CalendarGrid.vue';
import WeekView from './WeekView.vue';
import DayView from './DayView.vue';
import MiniMonthView from './MiniMonthView.vue'; // Importar MiniMonthView
import ResourceFilter from '../filters/ResourceFilter.vue'; // Importar ResourceFilter
import EventFormModal from '../modals/EventFormModal.vue'; // Importar el modal
import { v4 as uuidv4 } from 'uuid'; // Importar librería para IDs únicos (npm install uuid)

// --- Datos Originales (no los modificaremos directamente) ---
const allResources = ref([ // Usamos ref para que sea reactivo si viniera de una API
  { id: 's1', name: 'Sala A', building: 'Edificio Principal' },
  { id: 's2', name: 'Sala B', building: 'Edificio Principal' },
  { id: 's3', name: 'Despacho 1', building: 'Anexo Norte' },
  { id: 's4', name: 'Sala Grande', building: 'Anexo Norte' },
  { id: 's5', name: 'Auditorio', building: 'Edificio Sur' },
]);

const todayDate = new Date();
todayDate.setHours(0,0,0,0);
const tomorrowDate = new Date(todayDate);
tomorrowDate.setDate(todayDate.getDate() + 1);
const dayAfterTomorrowDate = new Date(todayDate);
dayAfterTomorrowDate.setDate(todayDate.getDate() + 2);

const allEvents = ref([ // Usamos ref
  { id: 'e1', resourceId: 's1', title: 'Reunión equipo', start: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 10, 0), end: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 11, 30) },
  { id: 'e2', resourceId: 's2', title: 'Presentación', start: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 12, 0), end: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 13, 0) },
  { id: 'e4', resourceId: 's3', title: 'Planificación Sprint', start: new Date(tomorrowDate.getFullYear(), tomorrowDate.getMonth(), tomorrowDate.getDate(), 10, 0), end: new Date(tomorrowDate.getFullYear(), tomorrowDate.getMonth(), tomorrowDate.getDate(), 12, 0) },
  { id: 'e5', resourceId: 's4', title: 'Demo Interna', start: new Date(dayAfterTomorrowDate.getFullYear(), dayAfterTomorrowDate.getMonth(), dayAfterTomorrowDate.getDate(), 15, 0), end: new Date(dayAfterTomorrowDate.getFullYear(), dayAfterTomorrowDate.getMonth(), dayAfterTomorrowDate.getDate(), 16, 0) },
  { id: 'e6', resourceId: 's5', title: 'Charla Tech', start: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 16, 0), end: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 17, 0) },
]);
// --- Fin Datos Originales ---


const currentView = ref('week'); // Empezar en semana para ver el filtro en acción
const selectedDate = ref(new Date());

// --- Estado del Filtro ---
// Inicializar con todos los edificios seleccionados
const initialBuildingIds = computed(() => {
    const buildingMap = new Map();
    allResources.value.forEach(resource => {
      if (resource.building) {
        buildingMap.set(resource.building, true);
      }
    });
    return new Set(buildingMap.keys());
});
const selectedBuildingIds = ref(new Set(initialBuildingIds.value)); // Set reactivo con los IDs de edificios


// --- Datos Filtrados (Computados) ---
const filteredResources = computed(() => {
  // Si no hay edificios seleccionados, devolver vacío o todos? Decidimos vacío.
  if (selectedBuildingIds.value.size === 0) {
      return [];
  }
  return allResources.value.filter(resource =>
    selectedBuildingIds.value.has(resource.building)
  );
});

const filteredEvents = computed(() => {
  const visibleResourceIds = new Set(filteredResources.value.map(r => r.id));
  // Si no hay recursos visibles, no mostrar eventos
   if (visibleResourceIds.size === 0) {
      return [];
  }
  return allEvents.value.filter(event =>
    visibleResourceIds.has(event.resourceId)
  );
});

// --- Estado del Modal ---
const isModalVisible = ref(false);
const modalInitialData = ref({}); // Para pre-rellenar o editar

// --- Funciones del Modal ---
function openEventModal(initialData = {}) {
  // Pre-rellenar con la fecha/hora actual si no se proporcionan datos iniciales
  const now = new Date();
  const defaultStart = initialData.start || now;
  // Por defecto, final 1 hora después del inicio
  const defaultEnd = initialData.end || new Date(defaultStart.getTime() + 60 * 60 * 1000);

  modalInitialData.value = {
    id: initialData.id || null, // Para saber si es edición
    title: initialData.title || '',
    resourceId: initialData.resourceId || '',
    start: defaultStart,
    end: defaultEnd,
  };
  isModalVisible.value = true;
}

function closeEventModal() {
  isModalVisible.value = false;
  modalInitialData.value = {}; // Limpiar datos al cerrar
}

function handleSaveEvent(eventData) {
  console.log('Guardando evento:', eventData);
  if (eventData.id) {
    // --- Lógica de Edición ---
    const index = allEvents.value.findIndex(e => e.id === eventData.id);
    if (index !== -1) {
      // Actualizar el evento existente en la lista reactiva
       allEvents.value.splice(index, 1, { ...eventData }); // Reemplazar con los nuevos datos
      // O si prefieres modificar directamente:
      // Object.assign(allEvents.value[index], eventData);
    } else {
        console.error("Error: Evento a editar no encontrado con ID:", eventData.id);
        // Podrías mostrar un error al usuario aquí
        return; // No cerrar el modal si hubo un error
    }
  } else {
    // --- Lógica de Creación ---
    const newEvent = {
      ...eventData,
      id: uuidv4(), // Generar un ID único para el nuevo evento
    };
     allEvents.value.push(newEvent); // Añadir el nuevo evento a la lista reactiva
  }

  closeEventModal(); // Cerrar el modal después de guardar
}


// --- Lógica de Navegación y Selección (sin cambios) ---
function navigatePrevious() {
  const d = new Date(selectedDate.value); // Crear copia
  if (currentView.value === 'month') {
    d.setMonth(d.getMonth() - 1);
  } else if (currentView.value === 'week') {
    d.setDate(d.getDate() - 7);
  } else { // day
    d.setDate(d.getDate() - 1);
  }
  // Asignar una NUEVA instancia de Date para asegurar reactividad
  selectedDate.value = new Date(d);
}

function navigateNext() {
  const d = new Date(selectedDate.value); // Crear copia
  if (currentView.value === 'month') {
    d.setMonth(d.getMonth() + 1);
  } else if (currentView.value === 'week') {
    d.setDate(d.getDate() + 7);
  } else { // day
    d.setDate(d.getDate() + 1);
  }
  // Asignar una NUEVA instancia de Date
  selectedDate.value = new Date(d);
}

function goToToday() {
  // También usar nueva instancia aquí por consistencia
  selectedDate.value = new Date();
}

// Modificar también selectDateAndSwitchView
function selectDateAndSwitchView(date) {
  // Asegurar que sea una nueva instancia si viene de otro componente
  selectedDate.value = new Date(date);
  currentView.value = 'day';
}
// --- Propiedades Computadas para Cabecera (sin cambios) ---
const displayYear = computed(() => {/* ... */});
const displayMonthName = computed(() => {/* ... */});
const displayDay = computed(() => {/* ... */});
const displayWeekRange = computed(() => {/* ... */});
// --- Watcher para selectedDate (sin cambios) ---
watch(selectedDate, (newDate) => { /* ... */ });


</script>

<style scoped>
.calendar-layout {
  display: flex;
  height: calc(100vh - 40px); /* Altura ejemplo, ajustar según tu app */
  max-width: 1400px; /* Ancho máximo */
  margin: 20px auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-family: sans-serif;
  background-color: #f9f9f9; /* Fondo general ligero */
}

.sidebar {
  width: 240px; /* Ancho fijo para la barra lateral */
  flex-shrink: 0; /* Evitar que se encoja */
  border-right: 1px solid #ccc;
  background-color: #fff; /* Fondo blanco para la barra */
  display: flex;
  flex-direction: column;
  padding: 15px 0px; /* Padding vertical, sin horizontal */
}
/* Añadir margen interno a los componentes dentro del sidebar si es necesario */
.sidebar > * {
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 15px;
}


.main-content {
  flex-grow: 1; /* Ocupa el resto del espacio */
  display: flex;
  flex-direction: column;
}

.view-controls {
    padding: 10px 20px;
    background-color: #e9ecef;
    border-bottom: 1px solid #ccc;
    text-align: right; /* Alinear a la derecha o como prefieras */
    flex-shrink: 0;
}
.view-controls label {
    margin-right: 8px;
    font-weight: bold;
    font-size: 0.9em;
}
.view-controls select {
    padding: 5px 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    min-width: 120px; /* Ancho mínimo */
    color: #000000;
    background-color: #e9ecef; /* Fondo gris claro */
}


/* CalendarHeader no necesita cambios de estilo aquí */

.calendar-body {
    flex-grow: 1; /* El cuerpo del calendario ocupa el espacio restante */
    background-color: #fff; /* Fondo blanco para el area principal */
}

.fab-add-event {
  position: fixed; /* O fixed si quieres que esté fijo en la ventana */
  bottom: 30px;
  right: 30px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  border: none;
  font-size: 2em;
  line-height: 56px; /* Centrar el + verticalmente */
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 999; /* Asegurar que esté por encima del contenido */
  transition: background-color 0.2s ease;
}
.fab-add-event:hover {
    background-color: #0056b3;
}
</style>