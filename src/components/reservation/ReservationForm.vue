<script setup lang="ts">
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import { useReservationStore } from '../../stores/reservationStore'
import { useBuildingStore } from '../../stores/buildingStore'
import { Reservation } from '../../types'

const props = defineProps<{
  initialData?: Partial<Reservation>
  selectedDate?: Date
  mode: 'create' | 'edit'
}>()

const emit = defineEmits<{
  (e: 'submit', data: Omit<Reservation, 'id' | 'status'>): void
  (e: 'cancel'): void
}>()

const reservationStore = useReservationStore()
const buildingStore = useBuildingStore()

const formattedDate = computed(() => {
  if (props.initialData?.date) {
    return props.initialData.date
  } else if (props.selectedDate) {
    return format(props.selectedDate, 'yyyy-MM-dd')
  }
  return format(new Date(), 'yyyy-MM-dd')
})

const form = ref({
  title: props.initialData?.title || '',
  date: formattedDate.value,
  timeSlotId: '',
  buildingId: props.initialData?.buildingId || '',
  roomId: props.initialData?.roomId || '',
  name: props.initialData?.name || '',
  email: props.initialData?.email || '',
  phone: props.initialData?.phone || '',
  notes: props.initialData?.notes || ''
})

const selectedBuilding = computed(() => {
  return buildingStore.getBuildingById(form.value.buildingId)
})

const availableRooms = computed(() => {
  return selectedBuilding.value?.rooms || []
})

const availableTimeSlots = computed(() => {
  if (!form.value.buildingId || !form.value.roomId) return []
  return reservationStore.getAvailableTimeSlots(formattedDate.value, form.value.buildingId, form.value.roomId)
})

// Set the time slot if we're editing
if (props.initialData?.startTime && props.initialData?.endTime) {
  const timeSlot = reservationStore.timeSlots.find(
    slot => slot.startTime === props.initialData?.startTime && slot.endTime === props.initialData?.endTime
  )
  if (timeSlot) {
    form.value.timeSlotId = timeSlot.id
  }
}

const errors = ref<Record<string, string>>({})

const validateForm = (): boolean => {
  errors.value = {}
  
  if (!form.value.title.trim()) {
    errors.value.title = 'Title is required'
  }
  
  if (!form.value.buildingId) {
    errors.value.buildingId = 'Please select a building'
  }
  
  if (!form.value.roomId) {
    errors.value.roomId = 'Please select a room'
  }
  
  if (!form.value.timeSlotId) {
    errors.value.timeSlotId = 'Please select a time slot'
  }
  
  if (!form.value.name.trim()) {
    errors.value.name = 'Name is required'
  }
  
  if (!form.value.email.trim()) {
    errors.value.email = 'Email is required'
  } else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email'
  }
  
  if (!form.value.phone.trim()) {
    errors.value.phone = 'Phone number is required'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) return
  
  const selectedTimeSlot = reservationStore.timeSlots.find(slot => slot.id === form.value.timeSlotId)
  if (!selectedTimeSlot) return
  
  const reservationData: Omit<Reservation, 'id' | 'status'> = {
    title: form.value.title,
    date: form.value.date,
    startTime: selectedTimeSlot.startTime,
    endTime: selectedTimeSlot.endTime,
    buildingId: form.value.buildingId,
    roomId: form.value.roomId,
    name: form.value.name,
    email: form.value.email,
    phone: form.value.phone,
    notes: form.value.notes
  }
  
  emit('submit', reservationData)
}

const handleBuildingChange = () => {
  form.value.roomId = ''
  form.value.timeSlotId = ''
}

const handleRoomChange = () => {
  form.value.timeSlotId = ''
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-md p-6 animate-fade-in">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">
      {{ mode === 'create' ? 'New Reservation' : 'Edit Reservation' }}
    </h2>
    
    <div class="space-y-4">
      <!-- Title -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Reservation Title</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          :class="{ 'border-error-500': errors.title }"
          placeholder="e.g., Team Meeting"
        >
        <p v-if="errors.title" class="mt-1 text-sm text-error-500">{{ errors.title }}</p>
      </div>
      
      <!-- Building Selection -->
      <div>
        <label for="building" class="block text-sm font-medium text-gray-700 mb-1">Building</label>
        <select
          id="building"
          v-model="form.buildingId"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          :class="{ 'border-error-500': errors.buildingId }"
          @change="handleBuildingChange"
        >
          <option value="" disabled>Select a building</option>
          <option 
            v-for="building in buildingStore.buildings" 
            :key="building.id" 
            :value="building.id"
          >
            {{ building.name }}
          </option>
        </select>
        <p v-if="errors.buildingId" class="mt-1 text-sm text-error-500">{{ errors.buildingId }}</p>
      </div>
      
      <!-- Room Selection -->
      <div>
        <label for="room" class="block text-sm font-medium text-gray-700 mb-1">Room</label>
        <select
          id="room"
          v-model="form.roomId"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          :class="{ 'border-error-500': errors.roomId }"
          :disabled="!form.buildingId"
          @change="handleRoomChange"
        >
          <option value="" disabled>Select a room</option>
          <option 
            v-for="room in availableRooms" 
            :key="room.id" 
            :value="room.id"
          >
            {{ room.name }} (Capacity: {{ room.capacity }})
          </option>
        </select>
        <p v-if="errors.roomId" class="mt-1 text-sm text-error-500">{{ errors.roomId }}</p>
      </div>
      
      <!-- Date -->
      <div>
        <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          id="date"
          v-model="form.date"
          type="date"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
      </div>
      
      <!-- Time Slot -->
      <div>
        <label for="timeSlot" class="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
        <select
          id="timeSlot"
          v-model="form.timeSlotId"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          :class="{ 'border-error-500': errors.timeSlotId }"
          :disabled="!form.buildingId || !form.roomId"
        >
          <option value="" disabled>Select a time slot</option>
          <option 
            v-for="slot in availableTimeSlots" 
            :key="slot.id" 
            :value="slot.id"
          >
            {{ slot.startTime }} - {{ slot.endTime }}
          </option>
        </select>
        <p v-if="errors.timeSlotId" class="mt-1 text-sm text-error-500">{{ errors.timeSlotId }}</p>
      </div>
      
      <!-- Contact Information -->
      <div class="pt-4 border-t border-gray-200">
        <h3 class="text-lg font-medium text-gray-800 mb-3">Contact Information</h3>
        
        <!-- Name -->
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            :class="{ 'border-error-500': errors.name }"
            placeholder="Your full name"
          >
          <p v-if="errors.name" class="mt-1 text-sm text-error-500">{{ errors.name }}</p>
        </div>
        
        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            :class="{ 'border-error-500': errors.email }"
            placeholder="your.email@example.com"
          >
          <p v-if="errors.email" class="mt-1 text-sm text-error-500">{{ errors.email }}</p>
        </div>
        
        <!-- Phone -->
        <div class="mb-4">
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            :class="{ 'border-error-500': errors.phone }"
            placeholder="(555) 123-4567"
          >
          <p v-if="errors.phone" class="mt-1 text-sm text-error-500">{{ errors.phone }}</p>
        </div>
      </div>
      
      <!-- Notes -->
      <div>
        <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
        <textarea
          id="notes"
          v-model="form.notes"
          rows="3"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Any additional information"
        ></textarea>
      </div>
      
      <!-- Buttons -->
      <div class="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          @click="emit('cancel')"
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {{ mode === 'create' ? 'Create Reservation' : 'Update Reservation' }}
        </button>
      </div>
    </div>
  </form>
</template>