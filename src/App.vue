<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'

const drawer = ref(false)
const showProfileMenu = ref(false)
const router = useRouter()

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const goTo = (path: string) => {
  router.push(path)
  drawer.value = false
  showProfileMenu.value = false
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Navbar -->
    <header class="fixed top-0 left-0 right-0 bg-white shadow z-50 h-16 flex items-center px-4 justify-between">
      <!-- Menu icon -->
      <button @click="toggleDrawer" class="text-gray-700 hover:text-primary-600">
        <i class="fas fa-bars text-xl"></i>
      </button>

      <!-- Logo -->
      <RouterLink to="/" class="text-xl font-bold text-primary-600">WhatsSpot</RouterLink>

      <!-- Profile menu -->
      <div class="relative">
        <button @click="showProfileMenu = !showProfileMenu" class="text-gray-700 hover:text-primary-600">
          <i class="fas fa-user text-xl"></i>
        </button>
        <div
          v-if="showProfileMenu"
          class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow z-50"
        >
          <a @click="goTo('/profile')" class="block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">Perfil</a>
          <a @click="goTo('/logout')" class="block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">Cerrar sesión</a>
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <aside
      v-if="drawer"
      class="fixed inset-y-0 left-0 w-64 bg-white border-r shadow z-40 pt-16"
    >
      <nav class="p-4">
        <RouterLink
          to="/calendar"
          class="block px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
          @click="drawer = false"
        >
          <i class="fa-regular fa-calendar-check mr-2"></i>
          Reservas
        </RouterLink>
      </nav>
    </aside>

    <!-- Overlay for drawer -->
    <div v-if="drawer" @click="drawer = false" class="fixed inset-0 bg-black opacity-25 z-30"></div>

    <!-- Main content -->
    <main class="flex-1 pt-16 pb-16 px-4">
      <RouterView />
    </main>
  </div>
</template>
