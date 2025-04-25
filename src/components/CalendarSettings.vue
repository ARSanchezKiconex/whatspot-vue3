<template>
  <div class="calendar-settings">
    <h3>Filtrar por empresa</h3>
    <div v-for="empresa in empresas" :key="empresa">
      <label>
        <input
          type="checkbox"
          :value="empresa"
          v-model="empresasSeleccionadas"
          @change="emitirSeleccion"
        />
        {{ empresa }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    empresas: Array,
    seleccionInicial: Array
  },
  data() {
    return {
      empresasSeleccionadas: this.seleccionInicial ?? []
    }
  },
  methods: {
    emitirSeleccion() {
      this.$emit('actualizar-filtro', this.empresasSeleccionadas)
    }
  }
}
</script>

<style scoped>
.calendar-settings {
  padding: 10px;
  border-right: 1px solid #ccc;
  width: 200px;
}
</style>
