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
      <MiniMonthView :selected-date="selectedDate" />
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
          :events="filteredEvents"
        />
        <CalendarGrid
          v-if="currentView === 'month'"
          :selected-date="selectedDate"
          :year="selectedDate.getFullYear()"
          :month="selectedDate.getMonth()"
          @date-selected="selectDateAndSwitchView"
          :resources="filteredResources"
          :events="filteredEvents"
        />
        <NoWeekendView
          v-if="currentView === 'no-weekend'"
          :selected-date="selectedDate"
          :resources="filteredResources"
          :events="filteredEvents"
        />
      </div>

      <v-btn
        class="fab-add-event"
        icon
        color="primary"
        @click="openEventModal()"
        elevation="6"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>

    <MiniWeekViewModal
      :show="isMiniWeekViewVisible"
      :resources="filteredResources"
      @close="closeMiniWeekViewModal"
      @open-booking="handleOpenBookingForm"
    />
    <BookFormModal
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
import CalendarHeader from './date-picker/CalendarHeader.vue';
import CalendarGrid from './date-picker/CalendarGrid.vue';
import WeekView from './views/WeekView.vue';
import DayView from './views/DayView.vue';
import MiniMonthView from './views/MiniMonthView.vue';
import ResourceFilter from './filters/ResourceFilter.vue';
import BookFormModal from './modals/BookFormModal.vue';
import MiniWeekViewModal from './modals/MiniWeekViewModal.vue';
import { v4 as uuidv4 } from 'uuid';
import CalendarViewSelector from './CalendarViewSelector.vue';
import UserOnlySwitch from './UserOnlySwitch.vue';

const value1 = ref(true);
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

const allEvents = ref([
  { id: 'e1', resourceId: 's1', title: 'Reunión equipo', start: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 10, 0), end: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 11, 30) },
  { id: 'e2', resourceId: 's2', title: 'Presentación', start: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 12, 0), end: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 13, 0) },
  { id: 'e4', resourceId: 's3', title: 'Planificación Sprint', start: new Date(tomorrowDate.getFullYear(), tomorrowDate.getMonth(), tomorrowDate.getDate(), 10, 0), end: new Date(tomorrowDate.getFullYear(), tomorrowDate.getMonth(), tomorrowDate.getDate(), 12, 0) },
  { id: 'e5', resourceId: 's4', title: 'Demo Interna', start: new Date(dayAfterTomorrowDate.getFullYear(), dayAfterTomorrowDate.getMonth(), dayAfterTomorrowDate.getDate(), 15, 0), end: new Date(dayAfterTomorrowDate.getFullYear(), dayAfterTomorrowDate.getMonth(), dayAfterTomorrowDate.getDate(), 16, 0) },
  { id: 'e6', resourceId: 's5', title: 'Charla Tech', start: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 16, 0), end: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 17, 0) },
]);

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

const isMiniWeekViewVisible = ref(false);

const openMiniWeekViewModal = () => {
  isMiniWeekViewVisible.value = true;
};

const closeMiniWeekViewModal = () => {
  isMiniWeekViewVisible.value = false;
};

const handleOpenBookingForm = (payload) => {
  const { date, resource } = payload;
  openEventModal({
    start: date,
    end: new Date(date.getTime() + 60 * 60 * 1000),
    resourceId: resource.id,
  });
};

const isModalVisible = ref(false);
const modalInitialData = ref({});

function openEventModal(initialData = {}) {
  const now = new Date();
  const defaultStart = initialData.start || now;
  const defaultEnd = initialData.end || new Date(defaultStart.getTime() + 60 * 60 * 1000);

  modalInitialData.value = {
    id: initialData.id || null,
    title: initialData.title || '',
    resourceId: initialData.resourceId || '',
    start: defaultStart,
    end: defaultEnd,
  };
  isModalVisible.value = true;
}

function closeEventModal() {
  isModalVisible.value = false;
  modalInitialData.value = {};
}

function handleSaveEvent(eventData) {
  if (eventData.id) {
    const index = allEvents.value.findIndex(e => e.id === eventData.id);
    if (index !== -1) {
      allEvents.value.splice(index, 1, { ...eventData });
    }
  } else {
    const newEvent = {
      ...eventData,
      id: uuidv4(),
    };
    allEvents.value.push(newEvent);
  }
  closeEventModal();
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