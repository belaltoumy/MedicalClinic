<template>
  <div v-if="loading" class="loader-overlay">
    <div class="spinner-wrapper">
      <i class="fas fa-spinner fa-spin fa-3x text-[#142a28]"></i>
      <p v-if="message" class="loader-text">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  loading: { type: Boolean, default: true },
  message: { type: String, default: "" }
});
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(128, 128, 128, 0.5); /* خلفية رمادية شفافة */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.spinner-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loader-text {
  margin-top: 12px;
  font-size: 1.1rem;
  color: #142a28;
  text-align: center;
  font-weight: bold;
}
</style>
