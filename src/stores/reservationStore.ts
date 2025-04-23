import { defineStore } from 'pinia'
import { Reservation, TimeSlot } from '../types'
import { addDays, format, parseISO, startOfDay, isSameDay } from 'date-fns'

interface ReservationState {
  reservations: Reservation[]
  timeSlots: TimeSlot[]
}

export const useReservationStore = defineStore('reservation', {
  state: (): ReservationState => ({
    reservations: [
      {
        id: '1',
        title: 'Team Meeting',
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '10:00',
        endTime: '11:00',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-123-4567',
        notes: 'Discussing Q2 roadmap',
        status: 'confirmed',
        buildingId: '1',
        roomId: '1'
      },
      {
        id: '2',
        title: 'Client Presentation',
        date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        startTime: '14:00',
        endTime: '15:00',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '555-987-6543',
        notes: 'Product demo',
        status: 'pending',
        buildingId: '2',
        roomId: '3'
      }
    ],
    timeSlots: [
      { id: '1', startTime: '09:00', endTime: '10:00' },
      { id: '2', startTime: '10:00', endTime: '11:00' },
      { id: '3', startTime: '11:00', endTime: '12:00' },
      { id: '4', startTime: '13:00', endTime: '14:00' },
      { id: '5', startTime: '14:00', endTime: '15:00' },
      { id: '6', startTime: '15:00', endTime: '16:00' },
      { id: '7', startTime: '16:00', endTime: '17:00' }
    ]
  }),
  
  getters: {
    getReservationById: (state) => (id: string) => {
      return state.reservations.find(r => r.id === id)
    },
    
    getReservationsByDate: (state) => (date: string, buildingId?: string, roomId?: string) => {
      return state.reservations.filter(r => {
        const dateMatch = r.date === date
        if (buildingId && roomId) {
          return dateMatch && r.buildingId === buildingId && r.roomId === roomId
        }
        return dateMatch
      })
    },

    getAvailableTimeSlots: (state) => (date: string, buildingId: string, roomId: string) => {
      const dateReservations = state.reservations.filter(
        r => r.date === date && r.buildingId === buildingId && r.roomId === roomId
      )
      
      return state.timeSlots.filter(slot => {
        return !dateReservations.some(
          reservation => 
            reservation.startTime === slot.startTime && 
            reservation.endTime === slot.endTime
        )
      })
    },
    
    getDaysWithReservations: (state) => (month: number, year: number, buildingId?: string, roomId?: string) => {
      return state.reservations
        .filter(r => {
          const date = parseISO(r.date)
          const monthMatch = date.getMonth() === month && date.getFullYear() === year
          if (buildingId && roomId) {
            return monthMatch && r.buildingId === buildingId && r.roomId === roomId
          }
          return monthMatch
        })
        .map(r => parseISO(r.date).getDate())
    }
  },
  
  actions: {
    addReservation(reservation: Omit<Reservation, 'id' | 'status'>) {
      const id = Math.random().toString(36).substring(2, 9)
      const newReservation = { ...reservation, id, status: 'pending' } as Reservation
      this.reservations.push(newReservation)
      return newReservation.id
    },
    
    updateReservation(id: string, data: Partial<Reservation>) {
      const index = this.reservations.findIndex(r => r.id === id)
      if (index !== -1) {
        this.reservations[index] = { ...this.reservations[index], ...data }
      }
    },
    
    deleteReservation(id: string) {
      const index = this.reservations.findIndex(r => r.id === id)
      if (index !== -1) {
        this.reservations.splice(index, 1)
      }
    },
    
    confirmReservation(id: string) {
      const index = this.reservations.findIndex(r => r.id === id)
      if (index !== -1) {
        this.reservations[index].status = 'confirmed'
      }
    },
    
    cancelReservation(id: string) {
      const index = this.reservations.findIndex(r => r.id === id)
      if (index !== -1) {
        this.reservations[index].status = 'cancelled'
      }
    }
  }
})