export interface Building {
  id: string
  name: string
  description?: string
  image?: string
  rooms: Room[]
}

export interface Room {
  id: string
  buildingId: string
  name: string
  capacity: number
  description?: string
  image?: string
  features: string[]
}

export interface Reservation {
  id: string
  title: string
  date: string // ISO format YYYY-MM-DD
  startTime: string // Format HH:MM
  endTime: string // Format HH:MM
  name: string
  email: string
  phone: string
  notes?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  buildingId: string
  roomId: string
}

export interface TimeSlot {
  id: string
  startTime: string
  endTime: string
}

export interface CalendarDay {
  date: Date
  dayOfMonth: number
  isCurrentMonth: boolean
  isToday: boolean
  hasReservations: boolean
}