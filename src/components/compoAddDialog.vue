<template>
  <Transition name="fade">
    <div v-if="modelValue" class="dialog">
      <div class="dialog-content animate-slideIn" 
           style="font-family: var(--font-primary);">
        
        <!-- زر الإغلاق -->
        <button
          @click="close"
          class="absolute top-3 left-3 text-white bg-red-500 hover:bg-red-600 rounded-md w-7 h-7 flex items-center justify-center transition duration-200 shadow"
        >
          <i class="fas fa-xmark"></i>
        </button>

        <!-- العنوان -->
        <h2 v-if="title" class="text-2xl font-bold mb-6 text-center text-[var(--color-primary-700)]">
          {{ title }}
        </h2>

        <!-- المحتوى -->
        <div class="text-gray-700">
          <slot />
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);

const close = () => {
  emit("update:modelValue", false);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes slideIn {
  from { transform: translateY(-20px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1;   }
}

.animate-slideIn {
  animation: slideIn 0.3s ease;
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
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 30%;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-in-out;
  text-align: center;
}
</style>
