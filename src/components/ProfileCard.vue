<template>
  <div
    class="flex flex-col items-center text-center p-10 pt-5 pb-5 max-w-sm mx-auto rounded-xl shadow-xl"
    style="font-family: var(--font-primary);"
  >
    <!-- الصورة الشخصية -->
    <div
      class="w-20 h-20 mb-4 mx-auto flex items-center justify-center bg-[#054239] rounded-full shadow border-4 border-white"
    >
      <i class="fa-solid fa-user text-white text-4xl"></i>
    </div>

    <!-- الاسم الكامل -->
    <h2 class="text-xl font-bold main-color mb-4">{{ fullName }}</h2>

    <!-- بيانات المستخدم -->
    <div class="w-full flex items-center justify-between bg-green-50 main-color rounded-md p-3 mb-3 shadow-inner">
      <span class="font-medium">اسم المستخدم: </span>{{ username }}
    </div>

    <div class="w-full flex items-center justify-between bg-green-50 rounded-md p-3 mb-3 shadow-inner">
      <span class="font-medium">نوع الحساب: </span>{{ typeUserName }}
    </div>

    <div class="w-full flex items-center justify-between bg-green-50 rounded-md p-3 mb-6 shadow-inner">
      <span class="font-medium">محور الاختبار: </span>{{ subjectName }}
    </div>

    <!-- زر تغيير كلمة المرور -->
    <button
      @click="changePassword"
      class="w-full bg-[#054239] text-white py-2 rounded-full font-bold transition duration-200 shadow hover:bg-[#428177]"
    >
      تغيير كلمة المرور
    </button>
    <LogoutButton />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { dataUserStore } from "../store/dataUser";
import LogoutButton from "./LogoutButton.vue";

const userStore = dataUserStore();

const fullName = computed(() => userStore.fullName);
const username = computed(() => userStore.username);
const typeUserName = computed(() => userStore.nameTypeUser);
const subjectName = computed(() => userStore.getSubjectName);

const props = defineProps(["onChangePassword"]);
function changePassword() {
  props.onChangePassword?.(); // استدعاء الديالوج من الصفحة الرئيسية
}
</script>

<style scoped>
.main-color {
  color: #054239;
}
</style>
