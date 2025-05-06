import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

// Import routes
import { routes } from './router'

// Importa Element Plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// Create Pinia store
const pinia = createPinia()

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(ElementPlus);
app.mount('#app');
