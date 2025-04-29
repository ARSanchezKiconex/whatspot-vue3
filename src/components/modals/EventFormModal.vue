<template>
  <dialog class="event-modal" :open="show" @close="closeModal">
    <form @submit.prevent="submitForm">
      <h3>{{ isEditing ? 'Editar Reserva' : 'Crear Nueva Reserva' }}</h3>

      <div class="form-group">
        <label for="title">Título:</label>
        <input type="text" id="title" v-model="formData.title" required />
      </div>

      <div class="form-group">
        <label for="resource">Sala:</label>
        <select id="resource" v-model="formData.resourceId" required>
          <option disabled value="">Selecciona una sala</option>
          <optgroup v-for="building in groupedResources" :key="building.name" :label="building.name">
            <option v-for="resource in building.resources" :key="resource.id" :value="resource.id">
              {{ resource.name }}
            </option>
          </optgroup>
        </select>
      </div>

      <div class="form-group time-group">
        <div>
            <label for="startDate">Fecha Inicio:</label>
            <input type="date" id="startDate" v-model="formData.startDate" required />
        </div>
         <div>
            <label for="startTime">Hora Inicio:</label>
            <select id="startTime" v-model="formData.startTime" required>
                <option disabled value="">Elige hora</option>
                <option v-for="time in timeOptions" :key="time" :value="time">
                    {{ time }}
                </option>
            </select>
        </div>
      </div>

      <div class="form-group time-group">
        <div>
            <label for="endDate">Fecha Fin:</label>
            <input type="date" id="endDate" v-model="formData.endDate" required />
        </div>
         <div>
            <label for="endTime">Hora Fin:</label>
             <select id="endTime" v-model="formData.endTime" required>
                 <option disabled value="">Elige hora</option>
                 <option v-for="time in timeOptions" :key="time" :value="time">
                    {{ time }}
                 </option>
            </select>
        </div>
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <div class="form-actions">
        <button type="button" @click="closeModal">Cancelar</button>
        <button type="submit">Guardar Reserva</button>
      </div>
       <button type="button" class="close-button" @click="closeModal" aria-label="Cerrar">&times;</button>
    </form>
  </dialog>
  <div v-if="show" class="modal-backdrop" @click="closeModal"></div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  show: Boolean, // Controla la visibilidad
  initialData: Object, // Datos iniciales para edición o pre-relleno
  allResources: Array, // Para el desplegable de salas
});

const emit = defineEmits(['close', 'save-event']);

const formData = ref({
  id: null,
  title: '',
  resourceId: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
});

const errorMessage = ref('');

// --- NUEVO: Generar opciones de tiempo ---
const timeOptions = computed(() => {
  const options = [];
  // Puedes ajustar el rango si no necesitas 24h completas
  const startHour = 0;
  const endHour = 24; // Hasta las 23:45

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 15) { // Incrementos de 15 min
      const hourStr = String(hour).padStart(2, '0');
      const minuteStr = String(minute).padStart(2, '0');
      options.push(`${hourStr}:${minuteStr}`);
    }
  }
  // options contendrá ["00:00", "00:15", ..., "23:45"]
  return options;
});

// Helper para formatear Date a YYYY-MM-DD
const formatDate = (date) => date ? date.toISOString().split('T')[0] : '';
// Helper para formatear Date a HH:MM
const formatTime = (date) => date ? date.toTimeString().slice(0, 5) : '';

// Agrupar recursos por edificio para el <select>
const groupedResources = computed(() => {
  const groups = {};
  props.allResources.forEach(resource => {
    const building = resource.building || 'Sin Edificio';
    if (!groups[building]) {
      groups[building] = { name: building, resources: [] };
    }
    groups[building].resources.push(resource);
  });
  return Object.values(groups);
});

// Detectar si estamos editando o creando
const isEditing = computed(() => !!formData.value.id);


// Observar cambios en initialData para pre-rellenar el formulario
watch(() => props.initialData, (newData) => {
  if (newData && props.show) { // Solo rellenar si hay datos y el modal se está mostrando
    formData.value = {
      id: newData.id || null,
      title: newData.title || '',
      resourceId: newData.resourceId || '',
      startDate: formatDate(newData.start || new Date()), // Valor por defecto: hoy
      startTime: formatTime(newData.start || new Date()), // Valor por defecto: ahora
      endDate: formatDate(newData.end || new Date(Date.now() + 60 * 60 * 1000)), // Default: +1 hora
      endTime: formatTime(newData.end || new Date(Date.now() + 60 * 60 * 1000)),
    };
    errorMessage.value = ''; // Limpiar errores al abrir/rellenar
  } else if (!props.show) {
      // Limpiar al cerrar (opcional, pero buena práctica)
       formData.value = { id: null, title: '', resourceId: '', startDate: '', startTime: '', endDate: '', endTime: '' };
       errorMessage.value = '';
  }
}, { immediate: true, deep: true }); // deep:true por si initialData es complejo

function closeModal() {
  emit('close');
}

function submitForm() {
  errorMessage.value = ''; // Limpiar error previo

  // Combinar fecha y hora en objetos Date
  const startDateTime = new Date(`${formData.value.startDate}T${formData.value.startTime}`);
  const endDateTime = new Date(`${formData.value.endDate}T${formData.value.endTime}`);

  // Validación básica
  if (!formData.value.title || !formData.value.resourceId || !formData.value.startDate || !formData.value.startTime || !formData.value.endDate || !formData.value.endTime) {
      errorMessage.value = "Por favor, rellena todos los campos.";
      return;
  }
  if (endDateTime <= startDateTime) {
    errorMessage.value = 'La hora de fin debe ser posterior a la hora de inicio.';
    return;
  }

  // Comprobar si las fechas son válidas (a veces el input puede dar fechas inválidas)
   if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
       errorMessage.value = "Las fechas u horas introducidas no son válidas.";
       return;
   }


  // Preparar datos del evento para emitir
  const eventData = {
    id: formData.value.id, // Será null si es nuevo
    title: formData.value.title,
    resourceId: formData.value.resourceId,
    start: startDateTime,
    end: endDateTime,
  };

  // Aquí podrías añadir validación de solapamiento si tuvieras acceso a todos los eventos
  // para la sala seleccionada en ese rango de tiempo.

  emit('save-event', eventData);
  // El componente padre se encargará de cerrar el modal si el guardado fue exitoso
}

</script>

<style scoped>
.event-modal {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 25px 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  margin: 50px auto; /* Centrado básico */
  position: fixed; /* Para que esté sobre el backdrop */
  top: 5vh; /* Ajustar verticalmente */
  left: 0;
  right: 0;
  background: white;
  z-index: 1001; /* Encima del backdrop */
}
/* Estilo para cuando se usa <dialog> nativo */
dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
}

label {
  color: #333
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 0.9em;
}
.form-group input[type="text"],
.form-group input[type="date"],
.form-group input[type="time"],
.form-group select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; /* Importante */
  font-size: 1em;
  background-color: rgb(255, 255, 255);
  color: #000000;
}

.time-group {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Dos columnas para fecha/hora */
    gap: 15px;
}


.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 25px;
  gap: 10px;
}

.form-actions button {
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.form-actions button[type="submit"] {
  background-color: #007bff;
  color: white;
  border: none;
}
.form-actions button[type="button"] {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 1.8em;
    line-height: 1;
    cursor: pointer;
    color: #aaa;
}
.close-button:hover {
    color: #333;
}

.error-message {
    color: red;
    font-size: 0.9em;
    margin-top: 10px;
    text-align: center;
}

</style>