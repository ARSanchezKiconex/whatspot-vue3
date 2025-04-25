// stores/reservation.ts
import { defineStore } from 'pinia'

export interface Reservation {
  id: string
  title: string
  date: string // formato: 'YYYY-MM-DD'
  time: string // formato: 'HH:mm'
  roomId: string
}

export const useReservationStore = defineStore('reservation', {
  state: () => ({
    reservations: [] as Reservation[],
  }),

  actions: {
    addReservation(reservation: Reservation) {
      this.reservations.push(reservation)
    }
  }
})
