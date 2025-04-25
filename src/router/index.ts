import { RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import CreateReservation from '../views/reservations/CreateReservation.vue'
import ReservationDetails from '../views/reservations/ReservationDetails.vue'
import EditReservation from '../views/reservations/EditReservation.vue'
import CalendarView from '../views/CalendarView.vue'
import CalendarViewGemini from '../views/CalendarViewGemini.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: CalendarView
  },
  {
    path: '/calendarGemini',
    name: 'calendarGemini',
    component: CalendarViewGemini
  },
  {
    path: '/reservations/create',
    name: 'create-reservation',
    component: CreateReservation
  },
  {
    path: '/reservations/:id',
    name: 'reservation-details',
    component: ReservationDetails,
    props: true
  },
  {
    path: '/reservations/:id/edit',
    name: 'edit-reservation',
    component: EditReservation,
    props: true
  }
]