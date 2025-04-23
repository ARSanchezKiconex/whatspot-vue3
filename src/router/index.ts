import { RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import CalendarView from '../views/CalendarView.vue'
import CreateReservation from '../views/CreateReservation.vue'
import ReservationDetails from '../views/ReservationDetails.vue'
import EditReservation from '../views/EditReservation.vue'

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