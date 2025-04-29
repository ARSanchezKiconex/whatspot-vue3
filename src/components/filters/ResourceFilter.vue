<template>
  <div class="resource-filter">
    <h4>Filtrar Salas</h4>
    <div v-for="building in buildings" :key="building.id" class="building-group">
      <label>
        <input
          type="checkbox"
          :checked="selectedBuildingIds.has(building.id)"
          @change="toggleBuilding(building.id)"
        />
        {{ building.name }}
      </label>
    </div>
     <button @click="selectAll" v-if="hasSelection && !allSelected">Seleccionar Todos</button>
     <button @click="deselectAll" v-if="allSelected">Deseleccionar Todos</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  allResources: { // Lista completa original de recursos
    type: Array,
    required: true
  },
  selectedBuildingIds: { // Set reactivo con los IDs seleccionados
    type: Set,
    required: true
  }
});

const emit = defineEmits(['update:selectedBuildingIds']);

// Obtener lista única de edificios desde los recursos
const buildings = computed(() => {
  const buildingMap = new Map();
  props.allResources.forEach(resource => {
    if (resource.building && !buildingMap.has(resource.building)) {
      // Usamos el nombre del edificio como ID aquí por simplicidad
      buildingMap.set(resource.building, { id: resource.building, name: resource.building });
    }
  });
  return Array.from(buildingMap.values());
});

// Función para actualizar la selección
function toggleBuilding(buildingId) {
  const newSelection = new Set(props.selectedBuildingIds);
  if (newSelection.has(buildingId)) {
    newSelection.delete(buildingId);
  } else {
    newSelection.add(buildingId);
  }
  emit('update:selectedBuildingIds', newSelection); // Emitir el nuevo Set
}

// Funciones para seleccionar/deseleccionar todos
const allBuildingIds = computed(() => buildings.value.map(b => b.id));
const allSelected = computed(() => props.selectedBuildingIds.size === buildings.value.length);
const hasSelection = computed(() => props.selectedBuildingIds.size > 0);


function selectAll() {
    emit('update:selectedBuildingIds', new Set(allBuildingIds.value));
}
function deselectAll() {
     emit('update:selectedBuildingIds', new Set());
}


</script>

<style scoped>
.resource-filter {
  padding: 15px 10px;
  font-size: 0.9em;
}

h4 {
  margin-top: 0;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.building-group {
  margin-bottom: 8px;
}

label {
  display: flex; /* Mejor alineación */
  align-items: center;
  cursor: pointer;
}

input[type="checkbox"] {
  margin-right: 8px;
}

button {
    font-size: 0.8em;
    padding: 3px 8px;
    margin-top: 10px;
    margin-right: 5px;
    cursor: pointer;
}
</style>