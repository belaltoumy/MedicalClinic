import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/login", // أي فتح للـ "/" يروح على "/login"
  },
  {
    path: "/home",
    name: "home",
    component: () => import("../view/Home.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../view/LoginPage.vue"),
  },
  {
    path: "/users",
    name: "users",
    component: () => import("../view/usersPage.vue"),
  },
  {
    path: "/doctors",
    name: "doctors",
    component: () => import("../view/doctorsPage.vue"),
  },
  {
    path: "/materials",
    name: "materials",
    component: () => import("../view/materialsPage.vue"),
  },
  {
    path: "/patients",
    name: "patients",
    component: () => import("../view/Patients.vue"),
  },
  {
    path: "/visites",
    name: "visites",
    component: () => import("../view/visits.vue"),
  },
  {
    path: "/procedures",
    name: "procedures",
    component: () => import("../view/Procedures.vue"),
  },
  {
    path: "/payments",
    name: "payments",
    component: () => import("../view/Payments.vue"),
  },
  // باقي الصفحات هنا
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
