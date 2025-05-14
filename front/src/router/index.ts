import { RouteRecordRaw } from 'vue-router'
import CalendarView from '../views/CalendarView.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'calendar',
    component: CalendarView
  },
]