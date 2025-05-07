<template>
  <el-calendar ref="calendar">
    <template #header="{ date }">
      <span>{{ date }}</span>
      <el-button-group>
        <el-button size="small" @click="selectDate('prev-year')">
          Año Anterior
        </el-button>
        <el-button size="small" @click="selectDate('prev-month')">
          Mes Anterior
        </el-button>
        <el-button size="small" @click="selectDate('today')">Hoy</el-button>
        <el-button size="small" @click="selectDate('next-month')">
          Mes Siguiente
        </el-button>
        <el-button size="small" @click="selectDate('next-year')">
          Año Siguiente
        </el-button>
      </el-button-group>
    </template>
  </el-calendar>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { CalendarDateType, CalendarInstance } from 'element-plus'

const calendar = ref<CalendarInstance>()
const selectDate = (val: CalendarDateType) => {
  if (!calendar.value) return
  calendar.value.selectDate(val)
}
</script>
