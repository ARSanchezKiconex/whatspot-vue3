import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

// Import routes
import { routes } from './router'

// Create Pinia store
const pinia = createPinia()

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Create and mount app
createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')