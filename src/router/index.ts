import { RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import CalendarView from '../views/CalendarView.vue'
import ElementPlusView from '../views/ElementPlusView.vue'

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
    path: '/element-plus',
    name: 'element-plus',
    component: ElementPlusView,
  },
]