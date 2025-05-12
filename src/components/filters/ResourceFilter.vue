<template>
  <div class="resource-filter">
    <h4>Filtrar Salas</h4>
    <v-checkbox
      v-for="building in buildings"
      :key="building.id"
      :label="building.name"
      :value="building.id"
      v-model="selectedBuildingArray"
      density="compact"
      hide-details
      margin-right="10px"
      class="building-checkbox"
    />
    <div class="action-buttons">
      <v-btn
        density="compact"
        variant="tonal"
        @click="selectAll"
        v-if="hasSelection && !allSelected"
      >
        Seleccionar Todos
      </v-btn>
      <v-btn
        density="compact"
        variant="tonal"
        color="secondary"
        @click="deselectAll"
        v-if="allSelected"
      >
        Deseleccionar Todos
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  allResources: {
    type: Array,
    required: true
  },
  selectedBuildingIds: {
    type: Set,
    required: true
  }
});

const emit = defineEmits(['update:selectedBuildingIds']);

const buildings = computed(() => {
  const buildingMap = new Map();
  props.allResources.forEach(resource => {
    if (resource.building && !buildingMap.has(resource.building)) {
      buildingMap.set(resource.building, { id: resource.building, name: resource.building });
    }
  });
  return Array.from(buildingMap.values());
});

const selectedBuildingArray = computed({
  get() {
    return Array.from(props.selectedBuildingIds);
  },
  set(newValue) {
    emit('update:selectedBuildingIds', new Set(newValue));
  }
});

function toggleBuilding(buildingId) {
  const newSelection = new Set(props.selectedBuildingIds);
  if (newSelection.has(buildingId)) {
    newSelection.delete(buildingId);
  } else {
    newSelection.add(buildingId);
  }
  emit('update:selectedBuildingIds', newSelection);
}

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

.building-checkbox {
  margin-right: 10px;
  margin-bottom: 8px;
  display: inline-block;
}

.action-buttons {
  margin-top: 10px;
  display: flex;
  gap: 8px;
}
</style>
