import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

// Import routes
import { routes } from './router'

// Importa Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, fa } from 'vuetify/iconsets/fa'
import '@fortawesome/fontawesome-free/css/all.css';

const vuetify = createVuetify({
  components,
  directives,
});

// Create Pinia store
const pinia = createPinia()

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Create and mount app
createApp(App)
  .use(vuetify)
  .use(pinia)
  .use(router)
  .mount('#app')

  export default createVuetify({
    icons: {
      defaultSet: 'fa',
      aliases,
      sets: { fa },
    },
  })