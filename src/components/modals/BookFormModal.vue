<template>
  <el-dialog
    v-model="show"
    :title="isEditing ? 'Editar Reserva' : 'Crear Nueva Reserva'"
    width="40%"
    @close="closeModal"
  >
    <el-form
      ref="ruleFormRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
      class="event-form"
      @submit.prevent="submitForm"
    >
      <el-form-item label="Título" prop="title">
        <el-input v-model="formData.title" placeholder="Ingrese el título" />
      </el-form-item>

      <el-form-item label="Sala" prop="resourceId">
        <el-select v-model="formData.resourceId" placeholder="Selecciona una sala">
          <el-option-group
            v-for="building in groupedResources"
            :key="building.name"
            :label="building.name"
          >
            <el-option
              v-for="resource in building.resources"
              :key="resource.id"
              :label="resource.name"
              :value="resource.id"
            />
          </el-option-group>
        </el-select>
      </el-form-item>

      <el-form-item label="Fecha y Hora de Inicio" prop="startTime">
        <el-col :span="12">
          <el-form-item prop="startDate" label-width="0">
            <el-date-picker
              v-model="formData.startDate"
              type="date"
              placeholder="Fecha de inicio"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="startTime" label-width="0">
            <el-time-select
              v-model="formData.startTime"
              placeholder="Hora de inicio"
              style="width: 100%; margin-left: 10px;"
              :max-time="formData.endTime"
              start="00:00"
              step="00:15"
              end="23:45"
            />
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="Fecha y Hora de Fin" prop="endTime">
        <el-col :span="12">
          <el-form-item prop="endDate" label-width="0">
            <el-date-picker
              v-model="formData.endDate"
              type="date"
              placeholder="Fecha de fin"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="endTime" label-width="0">
            <el-time-select
              v-model="formData.endTime"
              placeholder="Hora de fin"
              style="width: 100%; margin-left: 10px;"
              :min-time="formData.startTime"
              start="00:00"
              step="00:15"
              end="23:45"
            />
          </el-form-item>
        </el-col>
      </el-form-item>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeModal">Cancelar</el-button>
          <el-button type="primary" @click="submitForm">Guardar Reserva</el-button>
        </span>
      </template>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElOptionGroup, ElDatePicker, ElTimeSelect, ElCol, ElButton } from 'element-plus';

const props = defineProps({
  show: Boolean,
  initialData: Object,
  allResources: Array,
});

const emit = defineEmits(['close', 'save-event']);

const show = computed(() => props.show);
const isEditing = computed(() => !!props.initialData.id);

const formData = ref({
  id: null,
  title: '',
  resourceId: '',
  startDate: null,
  startTime: null,
  endDate: null,
  endTime: null,
});

// watch(() => props.initialData, (newInitialData) => {
//   if (newInitialData) {
//     formData.value = {
//       id: newInitialData.id || null,
//       title: newInitialData.title || '',
//       resourceId: newInitialData.resourceId || '',
//       startDate: newInitialData.start ? new Date(newInitialData.start) : null,
//       startTime: newInitialData.start ? formatTime(newInitialData.start) : null,
//       endDate: newInitialData.end ? new Date(newInitialData.end) : null,
//       endTime: newInitialData.end ? formatTime(newInitialData.end) : null,
//     };
//   } else {
//     resetForm();
//   }
// }, { immediate: true });

const groupedResources = computed(() => {
  if (!props.allResources) return [];
  const groups = {};
  props.allResources.forEach(resource => {
    if (!groups[resource.building]) {
      groups[resource.building] = { name: resource.building, resources: [] };
    }
    groups[resource.building].resources.push(resource);
  });
  return Object.values(groups);
});

const errorMessage = ref('');
const ruleFormRef = ref(null);
const rules = ref({
  title: [{ required: true, message: 'Por favor, ingresa el título', trigger: 'blur' }],
  resourceId: [{ required: true, message: 'Por favor, selecciona una sala', trigger: 'change' }],
  startDate: [{ required: true, message: 'Por favor, selecciona la fecha de inicio', trigger: 'change' }],
  startTime: [{ required: true, message: 'Por favor, selecciona la hora de inicio', trigger: 'change' }],
  endDate: [{ required: true, message: 'Por favor, selecciona la fecha de fin', trigger: 'change' }],
  endTime: [{ required: true, message: 'Por favor, selecciona la hora de fin', trigger: 'change' }],
});

const resetForm = () => {
  formData.value = {
    id: null,
    title: '',
    resourceId: '',
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
  };
  errorMessage.value = '';
  if (ruleFormRef.value) {
    ruleFormRef.value.resetFields();
  }
};

const closeModal = () => {
  emit('close');
  resetForm();
};

const formatTime = (date) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const submitForm = () => {
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      const start = new Date(formData.value.startDate);
      const startTimeParts = formData.value.startTime.split(':');
      start.setHours(parseInt(startTimeParts[0]), parseInt(startTimeParts[1]));

      const end = new Date(formData.value.endDate);
      const endTimeParts = formData.value.endTime.split(':');
      end.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]));

      if (end <= start) {
        errorMessage.value = 'La hora de fin debe ser posterior a la hora de inicio.';
        return;
      }

      emit('save-event', { ...formData.value, start: start.toISOString(), end: end.toISOString() });
      closeModal();
    } else {
      console.log('Formulario no válido');
      return false;
    }
  });
};
</script>

<style scoped>
.el-dialog {
  height: 200px;
  padding: 20px;
}

.event-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.time-group {
  display: flex;
  gap: 10px;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #999;
}

.close-button:hover {
  color: #333;
}
</style>
