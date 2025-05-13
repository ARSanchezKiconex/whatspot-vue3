<template>
  <div class="calendar-layout">
  <v-navigation-drawer
    app
    fixed
    width="240"
    class="sidebar"
  >
    <!-- Vista MiniMes -->
    <v-card flat class="pa-2">
      <MiniMonthView 
        :selected-date="selectedDate"
        @dateSelected="selectedDate = $event"
        @previous="navigatePrevious"
        @next="navigateNext"
      />
    </v-card>

    <!-- Selector de Vista -->
    <v-card flat class="pa-2 mt-4">
      <div class="view-controls">
        <label for="view-select">Vista:</label>
        <v-select
          id="view-select"
          v-model="currentView"
          :items="viewOptions"
          item-value="value"
          item-title="label"
          density="compact"
          variant="outlined"
          style="margin-top: 10px; min-width: 150px;"
        />
      </div>
    </v-card>

    <!-- Filtro de Recursos -->
    <v-card flat class="pa-2 mt-4">
      <ResourceFilter
        :all-resources="allResources"
        v-model:selected-building-ids="selectedBuildingIds"
      />
    </v-card>

    <!-- Switch Solo Mío -->
    <v-card flat class="pa-2 mt-4">
      <UserOnlySwitch v-model="showOnlyMine" />
    </v-card>
  </v-navigation-drawer>

    <div class="main-content">
      <CalendarHeader

        :view="currentView"
        @previous="navigatePrevious"
        @next="navigateNext"
        @today="goToToday"
      />

      <div class="calendar-body">
        <DayView
          v-if="currentView === 'day'"
          :selected-date="selectedDate"
          :resources="filteredResources"
          :events="filteredEvents"
        />
        <WeekView
          v-if="currentView === 'week'"
          :selected-date="selectedDate"
          :resources="filteredResources"
          :events="allEvents"
        />
        <MonthView
          v-if="currentView === 'month'"
          :selected-date="selectedDate"
          :year="selectedDate.getFullYear()"
          :month="selectedDate.getMonth()"
          @date-selected="selectDateAndSwitchView"
          :resources="filteredResources"
          :events="filteredEvents"
        />
      </div>

      <v-btn
        class="fab-add-event"
        icon
        color="primary"
        @click="showFacilityModal = true"
        elevation="6"
      >
        <i class="fa-solid fa-plus"></i>
      </v-btn>
    </div>

    <FacilitySelectionModal 
      v-model:dialog="showFacilityModal"
      :installations="installations"
      @next="handleSelectedFacility"
    />

    <RoomSelectionModal
      v-model:dialog="showRoomModal"
      :rooms="availableRooms"
      @next="handleRoomSelected"
    />

    <DateSelectionModal
      v-model:dialog="showDateModal"
      @next="handleDateSelected"
    />

    <DetailsSelectionModal
      v-model:dialog="showDetailsModal"
      :booking="booking"
      :installations="installations"
      @confirmBooking="handleBooking"
    />

  </div>
</template>

<script setup>
import FacilitySelectionModal from './modals/FacilitySelectionModal.vue';
import RoomSelectionModal from './modals/RoomSelectionModal.vue';
import DateSelectionModal from './modals/DateSelectionModal.vue';
import DetailsSelectionModal from './modals/DetailsSelectionModal.vue';


import { ref, reactive, computed, watch } from 'vue';
import CalendarHeader from './calendar-navigation/CalendarHeader.vue';
import MonthView from './views/MonthView.vue';
import WeekView from './views/WeekView.vue';
import DayView from './views/DayView.vue';
import MiniMonthView from './views/MiniMonthView.vue';
import ResourceFilter from './filters/ResourceFilter.vue';
import { v4 as uuidv4 } from 'uuid';
import CalendarViewSelector from './calendar-navigation/CalendarViewSelector.vue';
import UserOnlySwitch from './filters/UserOnlySwitch.vue';

// SHOW MODALS
const showFacilityModal = ref(false);
const showRoomModal = ref(false);
const showDateModal = ref(false);
const showDetailsModal = ref(false); 

// DATOS DE RESERVA
const booking = reactive({
  facility: null,
  room: null,
  date: null,
  time: null,
  title: null,
  details: null
});


// PRUEBA
const installations = ref([
  { id: 'e1', name: 'Edificio 1', rooms:['Sala 01', 'Sala 02'] },
  { id: 'e2', name: 'Edificio 2', rooms:['Sala 13', 'Sala 14'] },
  { id: 'e3', name: 'Edificio 3', rooms:['Sala 25', 'Sala 26'] },
]);

const availableRooms = ref([]); 


// HANDLERS
function handleSelectedFacility(facility) {
  booking.facility = facility;
  availableRooms.value = facility.rooms; 

  showFacilityModal.value = false
  showRoomModal.value = true
}

function handleRoomSelected(room) {
  booking.room = room;

  showRoomModal.value = false
  showDateModal.value = true
}

function handleDateSelected(date) {
  booking.date = date.date;
  booking.time = date.time;

  showDateModal.value = false; 
  showDetailsModal.value = true;
}

//TODO: Cambiar a la función de reserva real
function handleBooking(bookingData) {
  allEvents.value.push(bookingData);
  console.log('Reservas:', allEvents.value);
}

// EVENTOS DE PRUEBA, mas adelante cargará las lista desde la base de datos
const allEvents = ref([
{
    id: 1,
    facility: 'Edificio Principal',
    room: 's1',
    dateFrom: '2025-05-06',
    timeFrom: '10:00',
    dateTo: '2025-05-06',
    timeTo: '11:30',
    title: 'Reunión de equipo',
    details: 'Planificación semanal'
  },
  {
    id: 2,
    facility: 'Edificio Principal',
    room: 's2',
    dateFrom: '2025-05-07',
    timeFrom: '09:00',
    dateTo: '2025-05-07',
    timeTo: '11:00',
    title: 'Presentación comercial',
    details: 'Cliente importante visita'
  },
  {
    id: 3,
    facility: 'Anexo Norte',
    room: 's3',
    dateFrom: '2025-05-09',
    timeFrom: '13:00',
    dateTo: '2025-05-09',
    timeTo: '14:30',
    title: 'Llamada internacional',
    details: 'Conferencia con socios'
  },
  {
    id: 4,
    facility: 'Anexo Norte',
    room: 's4',
    dateFrom: '2025-05-05',
    timeFrom: '15:00',
    dateTo: '2025-05-05',
    timeTo: '17:00',
    title: 'Sesión de brainstorming',
    details: 'Ideas para nuevo producto'
  },
  {
    id: 5,
    facility: 'Edificio Sur',
    room: 's5',
    dateFrom: '2025-05-06',
    timeFrom: '11:00',
    dateTo: '2025-05-06',
    timeTo: '12:45',
    title: 'Revisión de KPIs',
    details: 'Análisis mensual'
  },
  {
    id: 6,
    facility: 'Anexo Norte',
    room: 's4',
    dateFrom: '2025-05-08',
    timeFrom: '14:00',
    dateTo: '2025-05-08',
    timeTo: '15:30',
    title: 'Taller interno',
    details: 'Capacitación del personal'
  },
  {
    id: 7,
    facility: 'Edificio Principal',
    room: 's1',
    dateFrom: '2025-05-09',
    timeFrom: '08:30',
    dateTo: '2025-05-09',
    timeTo: '10:00',
    title: 'Desayuno de trabajo',
    details: 'Con proveedores'
  },
  {
    id: 8,
    facility: 'Edificio Principal',
    room: 's2',
    dateFrom: '2025-05-07',
    timeFrom: '16:00',
    dateTo: '2025-05-07',
    timeTo: '17:30',
    title: 'Formación sobre seguridad',
    details: 'Normativas actualizadas'
  },
  {
    id: 9,
    facility: 'Anexo Norte',
    room: 's3',
    dateFrom: '2025-05-05',
    timeFrom: '12:00',
    dateTo: '2025-05-05',
    timeTo: '13:30',
    title: 'Reunión con dirección',
    details: 'Actualización de proyectos'
  },
  {
    id: 10,
    facility: 'Edificio Sur',
    room: 's5',
    dateFrom: '2025-05-08',
    timeFrom: '10:00',
    dateTo: '2025-05-08',
    timeTo: '12:00',
    title: 'Evaluación de desempeño',
    details: 'Trimestre 1'
  }
]);



// const value1 = ref(true);
const showOnlyMine = ref(false);

const viewOptions = [
  { value: 'day', label: 'Día' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'diary', label: 'Agenda'}
];

const allResources = ref([
  { id: 's1', name: 'Sala A', building: 'Edificio Principal' },
  { id: 's2', name: 'Sala B', building: 'Edificio Principal' },
  { id: 's3', name: 'Despacho 1', building: 'Anexo Norte' },
  { id: 's4', name: 'Sala Grande', building: 'Anexo Norte' },
  { id: 's5', name: 'Auditorio', building: 'Edificio Sur' },
]);

const todayDate = new Date();
todayDate.setHours(0, 0, 0, 0);
const tomorrowDate = new Date(todayDate);
tomorrowDate.setDate(todayDate.getDate() + 1);
const dayAfterTomorrowDate = new Date(todayDate);
dayAfterTomorrowDate.setDate(todayDate.getDate() + 2);


const currentView = ref('week');
const selectedDate = ref(new Date());

const initialBuildingIds = computed(() => {
  const buildingMap = new Map();
  allResources.value.forEach(resource => {
    if (resource.building) {
      buildingMap.set(resource.building, true);
    }
  });
  return new Set(buildingMap.keys());
});
const selectedBuildingIds = ref(new Set(initialBuildingIds.value));

const filteredResources = computed(() => {
  if (selectedBuildingIds.value.size === 0) {
    return [];
  }
  return allResources.value.filter(resource =>
    selectedBuildingIds.value.has(resource.building)
  );
});

const filteredEvents = computed(() => {
  const visibleResourceIds = new Set(filteredResources.value.map(r => r.id));
  if (visibleResourceIds.size === 0) {
    return [];
  }
  return allEvents.value.filter(event =>
    visibleResourceIds.has(event.resourceId)
  );
});

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

</script>

<style scoped>
.calendar-layout {
  display: flex;
  height: 100%; /* 100% de la altura de la ventana */
  width: 100%; /* 100% del ancho de la ventana */
  max-width: none; /* Eliminar el ancho máximo */
  border: none; /* Eliminar borde si no lo deseas a pantalla completa */
  border-radius: 0; /* Eliminar bordes redondeados a pantalla completa */
  box-shadow: none; /* Eliminar sombra si no la deseas a pantalla completa */
  font-family: sans-serif;
  background-color: #ffffff; /* Fondo general ligero */
}

.sidebar {
  width: 240px; /* Ancho fijo para la barra lateral */
  flex-shrink: 0; /* Evitar que se encoja */
  border-right: 1px solid #ccc;
  background-color: #fff; /* Fondo blanco para la barra */
  display: flex;
  flex-direction: column;
  padding: 15px 0px; /* Padding vertical, sin horizontal */
  /* Si quieres que la barra lateral también ocupe toda la altura: */
  height: 100%; /* O 100vh si el padre es 100vh */
}

/* Estilos para el selector de vista */
.calendar-view-selector {
  margin-top: 20px;
  padding: 0 10px; /* Padding horizontal */
}

.v-select {
  width: auto;
}

/* Estilos del switch "Solo mío" */

.v-row span {
  margin-left: 10px;
}

.switch-booking {
  margin-left: 10px;
}

.main-content {
  flex-grow: 1; /* Ocupa el resto del espacio */
  display: flex;
  flex-direction: column;
  /* Si quieres que el contenido principal también ocupe toda la altura: */
  height: 100%; /* O 100vh si el padre es 100vh */
}

.view-controls label {
    margin-right: 8px;
    font-weight: bold;
    font-size: 0.9em;
}
.view-controls select {
    margin-top: 10px;
    padding: 5px 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    min-width: 120px; /* Ancho mínimo */
    color: #000000;
    background-color: #e9ecef; /* Fondo gris claro */
}


.calendar-body {
    flex-grow: 1; /* El cuerpo del calendario ocupa el espacio restante */
    background-color: #fff; /* Fondo blanco para el area principal */
    /* Si quieres que el cuerpo del calendario también ocupe toda la altura restante: */
    height: 100%;
}

.fab-add-event {
  position: fixed; /* O fixed si quieres que esté fijo en la ventana */
  bottom: 60px;
  right: 30px;
  width: 50px;
  height: 50px;
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
</style>