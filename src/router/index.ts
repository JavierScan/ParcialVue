import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomePage from "../components/HomePage.vue";
import DetalleArticulo from "../components/DetalleArticulo.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/articulos",
    name: "articulos",
    component: () =>
      import(/* webpackChunkName: "map" */ "../components/ArticulosPage.vue"),
  },
  {
    path: "/articulos/:id",
    name: "detalle-articulo",
    component: DetalleArticulo,
  },
  {
    path: "/form/:id",
    name: "form",
    component: () =>
      import(
        /* webpackChunkName: "instrumentos" */ "../components/ArticuloForm.vue"
      ),
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
