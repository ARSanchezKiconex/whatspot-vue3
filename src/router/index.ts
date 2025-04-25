import { RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import MonthView from '../views/MonthView.vue'
import WeekView from '../views/WeekView.vue'
import CreateReservation from '../views/CreateReservation.vue'
import ReservationDetails from '../views/ReservationDetails.vue'
import EditReservation from '../views/EditReservation.vue'
import CalendarioDe0 from '../views/CalendarView.vue'
import PruebasView2 from '../views/PruebasView2.vue'

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
    path: '/calendario-de-0',
    name: 'calendario-de-0',
    component: CalendarioDe0
  },
  {
    path: '/pruebas2',
    name: 'pruebas2',
    component: PruebasView2
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