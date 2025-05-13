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
