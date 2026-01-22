// import { createRouter, createWebHistory } from "vue-router";
import { createRouter, createWebHashHistory } from "vue-router";

import { isAuth } from "../Auth/authfunc";

const routes = [
  {
    path: "/",
    redirect: "/login", // أي فتح للـ "/" يروح على "/login"
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../view/LoginPage.vue"),
  },
   {
    path: "/home",
    name: "home",
    component: () => import("../view/Home.vue"),
    beforeEnter: isAuth,
  },
  {
    path: "/users",
    name: "users",
    component: () => import("../view/Users/usersPage.vue"),
    beforeEnter: isAuth,
  },
  {
    path: "/doctors",
    name: "doctors",
    component: () => import("../view/Doctors/doctorsPage.vue"),
    beforeEnter: isAuth,
  },
  {
    path: "/materials",
    name: "materials",
    component: () => import("../view/Materials/materialsPage.vue"),
    beforeEnter: isAuth,
  },
  {
    path: "/patients",
    name: "patients",
    component: () => import("../view/Patients/Patients.vue"),
    beforeEnter: isAuth,
  },
  {
    path: "/visites",
    name: "visites",
    component: () => import("../view/Visit/visits.vue"),
    beforeEnter: isAuth,
  },
  {
    path: "/procedures",
    name: "procedures",
    component: () => import("../view/Procedures/Procedures.vue"),
    beforeEnter: isAuth,
  },
  {
    path: "/payments",
    name: "payments",
    component: () => import("../view/Payments.vue"),
    beforeEnter: isAuth,
  },
  {
    path: "/expenses",
    name: "expenses",
    component: () => import("../view/Expenses/Expenses.vue"),
    beforeEnter: isAuth,
  },
  {
    path: "/doctor-withdrawals",
    name: "doctor-withdrawals",
    component: () => import("../view/DrawalsDoctor/DoctorWithdrawals.vue"),
    beforeEnter: isAuth,
  },

  {
    path: "/accessibility",
    name: "accessibility",
    component: () => import("../view/Accessibility/Accessibility.vue"),
    beforeEnter: isAuth,
  },
];

const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes,
});

export default router;
