import { RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import MonthView from '../views/MonthView.vue'
import WeekView from '../views/WeekView.vue'
import CreateReservation from '../views/CreateReservation.vue'
import ReservationDetails from '../views/ReservationDetails.vue'
import EditReservation from '../views/EditReservation.vue'
import PruebasView from '../views/PruebasView.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/mensual',
    name: 'mensual',
    component: MonthView
  },
  {
    path: '/semanal',
    name: 'semanal',
    component: WeekView
  },
  {
    path: '/pruebas',
    name: 'pruebas',
    component: PruebasView
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