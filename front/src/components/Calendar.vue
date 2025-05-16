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
      <!-- <v-card flat class="pa-2 mt-4">
        <CalendarViewSelector
          v-model="currentView"
          :options="viewOptions"
        />
      </v-card> -->
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
        <!-- <DayView
          v-if="currentView === 'day'"
          :selected-date="selectedDate"
          :resources="filteredResources"
          :events="allEvents"
        /> -->
        <WeekView
          v-if="currentView === 'week'"
          :selected-date="selectedDate"
          :resources="filteredResources"
          :bookingsList="bookingsList"
        />
        <!-- <MonthView
          v-if="currentView === 'month'"
          :selected-date="selectedDate"
          :year="selectedDate.getFullYear()"
          :month="selectedDate.getMonth()"
          @date-selected="selectDateAndSwitchView"
          :resources="filteredResources"
          :events="allEvents"
        /> -->
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
        :bookingsList="bookingsList"
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
const bookingsList = ref([]);

const availableRooms = ref([]); 

onMounted(async () => {
  await service.get('rooms').then((res) => {
    roomsList.value = res.data;
  });

  await service.get('facilities').then((res) => {
    installationsList.value = res.data;
  });

  loadBookings();

  const facilityMap = new Map();
  installationsList.value.forEach(facility => {
    facilityMap.set(facility.uuid, facility.name);
  });

  allResources.value = roomsList.value.map(room => {
    return {
      id: room.uuid,
      name: room.name,
      building: facilityMap.get(room.facility_uuid),
    };
  });

  console.log('Rooms: ', roomsList.value);
  console.log('Installations: ', installationsList.value);
  console.log('Bookings: ', bookingsList.value);
  console.log('Resources: ', allResources.value);
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

  await service.post('bookings', newBooking).then((res) => {
    console.log('Booking saved:');

    loadBookings();

  }).catch(() => {
    console.error('Error saving booking:');
  })
}

async function loadBookings() {

  await service.get('bookings').then((res) => {
    bookingsList.value = res.data;
  });
}


const allResources = ref([]);

// FILTERS
const showOnlyMine = ref(false);

const viewOptions = [
  { value: 'day', label: 'Día' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'diary', label: 'Agenda'}
];


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
  return bookingsList.value
    .filter(event => visibleResourceIds.has(event.room_uuid))
    .map(event => {
      const start = new Date(`${event.start_date}T${event.start_time}`);
      const end = new Date(`${event.end_date}T${event.end_time}`);

      return {
        ...event,
        start,
        end,
        resourceId: event.room_uuid,
      };
    });
});

// NAVIGATION
function navigatePrevious() {
  const d = new Date(selectedDate.value); 
  if (currentView.value === 'month') {
    d.setMonth(d.getMonth() - 1);
  } else if (currentView.value === 'week') {
    d.setDate(d.getDate() - 7);
  } else {
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
