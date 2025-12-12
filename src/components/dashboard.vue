<template>
  <div dir="rtl" class="relative min-h-screen bg-gray-100 flex type-font">
    <ComboNav />
    <i
      @click="toggleSidebar"
      :class="[isSidebarOpen ? 'fas fa-xmark' : 'fas fa-bars']"
      class="fixed top-7 right-6 z-60 text-white text-2xl cursor-pointer hover:scale-110 transition-transform duration-300"
      title="عرض/إخفاء القائمة الجانبية"
    ></i>
 
    <!--  السايد بار -->
    <transition name="slide">
      <aside
        v-if="isSidebarOpen"
        class="w-full sm:w-80 bg-[#054239] shadow-lg p-4 z-40 fixed top-0 right-0 h-full"
        style="min-width: 320px"
      >
        <div class="pt-14">
          <Combolinkmanagement class="text-white" />
        </div>
      </aside>
    </transition>

    <!--  محتوى الصفحة -->
    <main
      class="flex-grow p-6 transition-all duration-300 rounded-l-3xl shadow-inner"
      :style="mainStyle"
    >
      <slot />
    </main>
    <!-- العودة للصفحة الرئيسية -->
    <router-link
      to="/home"
      class="fixed bottom-6 right-6 bg-[#054239] hover:bg-white hover:text-[#054239] text-white py-2 px-2 text-sm rounded-md shadow-lg flex items-center gap-2 z-50"
    >
      <i class="fa fa-arrow-right"></i>
      الصفحة الرئيسية
    </router-link>
    
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import ComboNav from "./ComboNav.vue";
// import ProfileCard from "./ProfileCard.vue";
import Combolinkmanagement from "./Combolinkmanagement.vue";
// import LogoutButton from "./LogoutButton.vue";
// import useToast from "../toast/toast";
// const { showToast } = useToast();


const isSidebarOpen = ref(true);
const toggleSidebar = () => (isSidebarOpen.value = !isSidebarOpen.value);

const mainStyle = computed(() =>
  isSidebarOpen.value
    ? "margin-right: 320px; margin-top: 64px"
    : "margin-right: 0; margin-top: 64px"
);
</script>

<style scoped>
.type-font {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}
.main-color {
  color: #054239;
}
.second-color {
  color: #428177;
}
.dialog {
  direction: rtl;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;
  padding: 10px;
  box-sizing: border-box;
}

.dialog-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 30%;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  animation: slideIn 0.3s ease-in-out;
}
.dialog-edite {
  direction: rtl;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  animation: fadeIn 0.3s ease-in-out;
  padding: 10px;
  box-sizing: border-box;
}
.dialog-content-edite {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 40%;
  max-width: 60vw;
  max-height: 50vh;
  overflow-y: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  animation: slideIn 0.3s ease-in-out;
}

main{
  overflow: auto;
  scrollbar-width: none;
  height: calc(100vh - 80px) !important;
}
</style>
