<template>
  <div class="calendar-layout">
    <div class="sidebar">
      <v-card flat class="pa-2">
        <MiniMonthView 
          :selected-date="selectedDate"
          @dateSelected="selectedDate = $event"
          @previous="navigatePrevious"
          @next="navigateNext"
        />
      </v-card>
      <v-card flat class="pa-2 mt-4">
        <CalendarViewSelector
          v-model="currentView"
          :options="viewOptions"
        />
      </v-card>
      <v-card flat class="pa-2 mt-4">
        <ResourceFilter
          :all-resources="allResources"
          v-model:selected-building-ids="selectedBuildingIds"
        />
      </v-card>
      <v-card flat class="pa-2 mt-4">
        <UserOnlySwitch v-model="showOnlyMine" />
      </v-card>
    </div>

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
      <FacilitySelectionModal 
        v-model:dialog="showFacilityModal"
        :installations="installationsList"
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
        :installations="installationsList"
        :rooms="roomsList"
        @confirmBooking="handleBooking"
      />
    </div>
  </div>
</template>

<script setup>
import FacilitySelectionModal from './modals/FacilitySelectionModal.vue';
import RoomSelectionModal from './modals/RoomSelectionModal.vue';
import DateSelectionModal from './modals/DateSelectionModal.vue';
import DetailsSelectionModal from './modals/DetailsSelectionModal.vue';

import { ref, reactive, computed, watch, onMounted } from 'vue';
import CalendarHeader from './calendar-navigation/CalendarHeader.vue';
import MonthView from './views/MonthView.vue';
import WeekView from './views/WeekView.vue';
import DayView from './views/DayView.vue';
import MiniMonthView from './views/MiniMonthView.vue';
import ResourceFilter from './filters/ResourceFilter.vue';
import { v4 as uuidv4 } from 'uuid';
import CalendarViewSelector from './calendar-navigation/CalendarViewSelector.vue';
import UserOnlySwitch from './filters/UserOnlySwitch.vue';
import service from '../services/Service';

// SHOW MODALS
const showFacilityModal = ref(false);
const showRoomModal = ref(false);
const showDateModal = ref(false);
const showDetailsModal = ref(false); 

// OBJETO RESERVA TEMPORAL
const booking = reactive({
  facility: null,
  room: null,
  date: null,
  time: null,
});

const installationsList = ref([]);
const roomsList = ref([]);


const availableRooms = ref([]); 

onMounted(async () => {
  await service.get('rooms').then((res) => {
    roomsList.value = res.data;
  });

  await service.get('facilities').then((res) => {
    installationsList.value = res.data;
  });

  console.log('Rooms: ', roomsList.value);
  console.log('Installations: ', installationsList.value);
});

// HANDLERS
function handleSelectedFacility(facility) {
  booking.facility = facility;
  availableRooms.value = roomsList.value.filter(room => room.facility_uuid === facility.uuid);

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
  const newBooking = {

    user_uuid: '5dec78cd-316b-11f0-acb2-00155d98b300',
    room_uuid: bookingData.room_uuid,
    start_date: bookingData.dateFrom,
    end_date: bookingData.dateTo,
    start_time: bookingData.timeFrom,
    end_time: bookingData.timeTo,
    title: bookingData.title,
    details: bookingData.details
  };

  saveBooking(newBooking);
}

async function saveBooking(newBooking) {

  await service.post('booking', newBooking).then((res) => {
    console.log('Booking saved:', res.data);

    //volver a llamar al get
  }).catch((error) => {
    console.error('Error saving booking:', error);
  })
  
}


// PRUEBA
// const installations = ref([
//   { id: 'e1', name: 'Edificio 1', rooms:['Sala 01', 'Sala 02'] },
//   { id: 'e2', name: 'Edificio 2', rooms:['Sala 13', 'Sala 14'] },
//   { id: 'e3', name: 'Edificio 3', rooms:['Sala 25', 'Sala 26'] },
// ]);

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
  },
  {
    id: 11,
    facility: 'Edificio Principal',
    room: 's2',
    dateFrom: '2025-05-07',
    timeFrom: '10:15',
    dateTo: '2025-05-09',
    timeTo: '11:00',
    title: 'Reunión de ventas',
    details: 'Estrategia para el próximo trimestre'
  },
  {
    id: 12,
    facility: 'Edificio Principal',
    room: 's2',
    dateFrom: '2025-05-07',
    timeFrom: '11:15',
    dateTo: '2025-05-06',
    timeTo: '12:30',
    title: 'Café con el equipo de marketing',
    details: 'Nuevas campañas'
  }
]);


// FILTERS
const showOnlyMine = ref(false);

const viewOptions = [
  { value: 'day', label: 'Día' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'diary', label: 'Agenda'}
];

// TODO: sustituir por lista de base de datos
const allResources = ref([
  { id: 's1', name: 'Sala A', building: 'Edificio Principal' },
  { id: 's2', name: 'Sala B', building: 'Edificio Principal' },
  { id: 's3', name: 'Despacho 1', building: 'Anexo Norte' },
  { id: 's4', name: 'Sala Grande', building: 'Anexo Norte' },
  { id: 's5', name: 'Auditorio', building: 'Edificio Sur' },
  { id: 's6', name: 'Sala de Juntas', building: 'Edificio Sur' },
  { id: 's7', name: 'Sala de Conferencias', building: 'Edificio Sur' },
  { id: 's8', name: 'Sala de Capacitación', building: 'Edificio Sur' },
  { id: 's9', name: 'Sala de Proyectos', building: 'Edificio Sur' },
  { id: 's10', name: 'Sala de Innovación', building: 'Edificio Sur' },
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

// NAVIGATION
function navigatePrevious() {
  const d = new Date(selectedDate.value); 
  if (currentView.value === 'month') {
    d.setMonth(d.getMonth() - 1);
  } else if (currentView.value === 'week') {
    d.setDate(d.getDate() - 7);
  } else { // day
    d.setDate(d.getDate() - 1);
  }

  selectedDate.value = new Date(d);
}

function navigateNext() {
  const d = new Date(selectedDate.value);
  if (currentView.value === 'month') {
    d.setMonth(d.getMonth() + 1);
  } else if (currentView.value === 'week') {
    d.setDate(d.getDate() + 7);
  } else {
    d.setDate(d.getDate() + 1);
  }
  selectedDate.value = new Date(d);
}

function goToToday() {
  selectedDate.value = new Date();
}

function selectDateAndSwitchView(date) {
  selectedDate.value = new Date(date);
  currentView.value = 'day';
}
</script>

<style scoped>
.calendar-layout {
  display: flex;
  height: 100%;
  width: 100%;
  max-width: none;
  border: none;
  border-radius: 0;
  box-shadow: none;
  font-family: sans-serif;
  background-color: #ffffff;
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
  border-right: 1px solid #ccc;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 15px 0px;
  height: 100%;
}

.main-content {
  flex-grow: 1; 
  display: flex;
  flex-direction: column;
  height: 100%;
}

.calendar-body {
  flex-grow: 1;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.fab-add-event {
  position: fixed;
  bottom: 60px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  border: none;
  font-size: 2em;
  line-height: 56px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 999;
  transition: background-color 0.2s ease;
}
</style>
