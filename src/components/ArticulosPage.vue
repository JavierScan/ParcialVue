<template>
  <div>
    <h1>LISTA DE ARTICULOS</h1>
    <div class="w-200">
      <select
        class="form-select custom-select-sm w-auto"
        v-model="selectedRubro"
        @change="handleRubroChange"
      >
        <option value="">Seleccione un rubro</option>
        <option v-for="rubro in rubros" :key="rubro.id" :value="rubro.id">
          {{ rubro.denominacion }}
        </option>
      </select>
    </div>

    <div class="table-container">
      <button @click="handleAdd" class="btn btn-primary mt-3">Agregar</button>
      <table class="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Codigo</th>
            <th>Denominación</th>
            <th>Precio</th>
            <th>Rubro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="articulo in articulos" :key="articulo.id">
            <td>{{ articulo.id }}</td>
            <td>{{ articulo.codigo }}</td>
            <td>{{ articulo.denominacion }}</td>
            <td>{{ articulo.precio }}</td>
            <td>{{ getRubroDenominacion(articulo.idrubro) }}</td>
            <td>
              <button
                @click="handleUpdate(articulo)"
                class="btn btn-primary me-2"
              >
                Editar
              </button>
              <button
                @click="handleDelete(articulo)"
                class="btn btn-danger me-2"
              >
                Eliminar
              </button>
              <button
                @click="handleVerDetalles(articulo.id)"
                class="btn btn-info me-2"
              >
                Ver Detalles
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="selectedArticulo || isAdding" class="modal">
      <div class="modal-content">
        <h2>{{ selectedArticulo ? "Editar Articulo" : "Agregar Articulo" }}</h2>
        <ArticuloForm
          @submit="handleSubmit"
          @cancel="handleCancel"
          :selectedArticulo="selectedArticulo || { id: 0 }"
        />
        <button @click="handleCancel" class="btn btn-secondary mt-3">
          Cerrar
        </button>
      </div>
    </div>

    <router-link to="/" class="btn btn-primary mt-3">Volver</router-link>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router"; // Importa useRouter desde vue-router
import ArticuloForm from "./ArticuloForm.vue";

export default {
  name: "ArticulosPage",
  components: {
    ArticuloForm,
  },
  setup() {
    const articulos = ref([]);
    const selectedArticulo = ref(null);
    const isAdding = ref(false);
    const selectedRubro = ref("");
    const router = useRouter();

    const columns = [
      { title: "Id", field: "id" },
      { title: "Codigo", field: "codigo" },
      { title: "Denominación", field: "denominacion" },
      { title: "Precio", field: "precio" },
    ];

    const actions = {
      create: true,
      update: true,
      delete: true,
      verDetalles: true,
    };

    const fetchArticulos = async (idRubro) => {
      try {
        const response = await axios.get(
          `http://168.194.207.98:8081/api_articulo/get_articulos_por_rubro.php?idrubro=${idRubro}`
        );
        articulos.value = response.data.map((articulo) => ({ ...articulo }));
      } catch (error) {
        console.error(error);
      }
    };

    const handleAdd = () => {
      selectedArticulo.value = null;
      isAdding.value = true;
    };

    const handleUpdate = (articulo) => {
      selectedArticulo.value = articulo;
      isAdding.value = true;
    };

    const handleDelete = async (articulo) => {
      await axios.delete(
        `http://168.194.207.98:8081/api_articulo/delete_articulo.php?id=${articulo.id}`
      );
      fetchArticulos(selectedRubro.value);
    };

    const handleSubmit = async (articulo) => {
      if (articulo.id === 0) {
        await axios.post(
          "http://168.194.207.98:8081/api_articulo/post_articulo.php",
          articulo
        );
      } else {
        articulo.id = selectedArticulo.value.id;
        await axios.put(
          "http://168.194.207.98:8081/api_articulo/put_articulo.php",
          articulo
        );
      }
      selectedArticulo.value = null;
      isAdding.value = false;
      fetchArticulos(selectedRubro.value);
    };

    const handleCancel = () => {
      selectedArticulo.value = null;
      isAdding.value = false;
    };

    const handleRubroChange = (event) => {
      selectedRubro.value = event.target.value;
      fetchArticulos(selectedRubro.value);
    };

    const handleVerDetalles = (id) => {
      router.push(`/articulos/${id}`);
    };

    const getRubroDenominacion = (rubroId) => {
      const rubro = rubros.value.find((rubro) => rubro.id === rubroId);
      return rubro ? rubro.denominacion : '';
    };


    const rubros = ref([]);

    const fetchRubros = async () => {
      try {
        const response = await fetch(
          "http://168.194.207.98:8081/api_articulo/get_rubros.php"
        );
        const data = await response.json();
        rubros.value = data;
      } catch (error) {
        console.error(error);
      }
    };

    onMounted(() => {
      fetchRubros();
    });

    return {
      articulos,
      selectedArticulo,
      isAdding,
      selectedRubro,
      columns,
      actions,
      rubros,
      fetchArticulos,
      handleAdd,
      handleUpdate,
      handleDelete,
      handleSubmit,
      handleCancel,
      handleRubroChange,
      handleVerDetalles,
      getRubroDenominacion,
    };
  },
};
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
}

/* Agrega otros estilos CSS según sea necesario */
</style>
