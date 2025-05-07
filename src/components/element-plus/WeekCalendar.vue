<template>
  <div class="view-selector">
    <el-button-group>
      <el-button
        :type="selected === 'daily' ? 'primary' : 'default'"
        @click="selectView('daily')"
      >
        Diaria
      </el-button>
      <el-button
        :type="selected === 'weekly' ? 'primary' : 'default'"
        @click="selectView('weekly')"
      >
        Semanal
      </el-button>
      <el-button
        :type="selected === 'monthly' ? 'primary' : 'default'"
        @click="selectView('monthly')"
      >
        Mensual
      </el-button>
    </el-button-group>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElButton, ElButtonGroup } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'daily',
  },
})

const emit = defineEmits(['update:modelValue'])

const selected = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  selected.value = newVal
})

const selectView = (view) => {
  selected.value = view
  emit('update:modelValue', view)
}
</script>

<style scoped>
.view-selector {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}
</style>
