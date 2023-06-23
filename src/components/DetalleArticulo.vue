<template>
  <div>
    <div v-if="!articulo">Cargando...</div>

    <div v-else class="container mt-3">
      <div class="row">
        <div class="col">
          <h3>Código:</h3>
          <h3>Denominación:</h3>
          <h3>Precio:</h3>
          <h3>idrubro:</h3>
        </div>
        <div class="col">
          <h4>{{ articulo.codigo }}</h4>
          <h4>{{ articulo.denominacion }}</h4>
          <h4>{{ articulo.precio }}</h4>
          <h4>{{ articulo.idrubro }}</h4>
        </div>
      </div>
      <router-link to="/articulos" class="btn btn-primary mt-3">Volver</router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

export default {
  name: "DetalleArticulo",
  setup() {
    const articulo = ref(null);
    const route = useRoute(); // Obtén la referencia a la ruta actual

    const fetchArticulo = async (id) => {
      try {
        const response = await axios.get(
          `http://168.194.207.98:8081/api_articulo/get_articulo.php?id=${id}`
        );
        articulo.value = response.data;
      } catch (error) {
        console.error(error);
      }
    };

    onMounted(() => {
      const id = route.params.id;
      fetchArticulo(id);
    });

    return {
      articulo,
    };
  },
};
</script>

<style>
/* Agrega estilos CSS según sea necesario */
</style>
