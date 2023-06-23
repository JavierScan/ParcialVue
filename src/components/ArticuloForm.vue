<template>
  <form @submit="handleSubmit">
    <div class="form-group">
      <label v-if="selectedArticulo" class="form-label">Id</label>
      <input
        v-if="selectedArticulo"
        type="text"
        name="id"
        :value="formArticulo.id"
        disabled
        class="form-control"
      />
    </div>
    <div class="form-group">
      <label class="form-label">Código</label>
      <input
        type="text"
        name="codigo"
        v-model="formArticulo.codigo"
        required
        class="form-control"
      />
      <div v-if="showAlert" class="alert alert-danger">
        Este código ya está asignado a otro artículo.
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Denominación</label>
      <input
        type="text"
        name="denominacion"
        v-model="formArticulo.denominacion"
        required
        class="form-control"
      />
    </div>
    <div class="form-group">
      <label class="form-label">Precio</label>
      <input
        type="number"
        name="precio"
        v-model="formArticulo.precio"
        required
        class="form-control"
      />
    </div>
    <div class="form-group">
      <label class="form-label">Rubro</label>
      <select
        name="idrubro"
        v-model="formArticulo.idrubro"
        required
        class="form-select"
      >
        <option value="">Seleccione un rubro</option>
        <option
          v-for="rubro in rubros"
          :key="rubro.id"
          :value="rubro.id"
        >{{ rubro.denominacion }}</option>
      </select>
    </div>
    <button type="submit" class="btn btn-primary mt-3 me-2" :disabled="showAlert">Guardar</button>
    <button type="button" class="btn btn-secondary mt-3 me-2" @click="onCancel">
      Cancelar
    </button>
  </form>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  name: "ArticuloForm",
  props: {
    onSubmit: {
      type: Function,
      required: true,
    },
    onCancel: {
      type: Function,
      required: true,
    },
    selectedArticulo: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const formArticulo = ref({
      id: props.selectedArticulo ? props.selectedArticulo.id : 0,
      codigo: props.selectedArticulo ? props.selectedArticulo.codigo : "",
      denominacion: props.selectedArticulo
        ? props.selectedArticulo.denominacion
        : "",
      precio: props.selectedArticulo ? props.selectedArticulo.precio : 0,
      idrubro: props.selectedArticulo ? props.selectedArticulo.idrubro : 0,
    });

    const rubros = ref([]);
    const showAlert = ref(false);

    const fetchRubros = async () => {
      try {
        const response = await axios.get(
          "http://168.194.207.98:8081/api_articulo/get_rubros.php"
        );
        rubros.value = response.data;
      } catch (error) {
        console.error(error);
      }
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      const articulo = { ...formArticulo.value };

      if (articulo.codigo) {
        try {
          const response = await axios.get(
            `http://168.194.207.98:8081/api_articulo/get_articulos_por_codigo.php?codigo=${encodeURIComponent(
              articulo.codigo
            )}`
          );
          const existingArticulos = response.data;
          const existingArticulo = existingArticulos[0];

          if (
            existingArticulo &&
            existingArticulo.id !== articulo.id?.toString() &&
            existingArticulo.id !== props.selectedArticulo.id?.toString()
          ) {
            showAlert.value = true;
            setTimeout(() => {
              showAlert.value = false;
            }, 3000);
          } else {
            props.onSubmit(articulo);
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        props.onSubmit(articulo);
      }
    };

    onMounted(() => {
      fetchRubros();
    });

    return {
      formArticulo,
      rubros,
      handleSubmit,
      showAlert,
    };
  },
};
</script>
