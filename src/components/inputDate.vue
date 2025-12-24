<template>
  <div class="input-wrapper">
    <input
      type="date"
      id="dateInput"
      v-model="inputValue"
      @focus="isFocused = true"
      @blur="isFocused = inputValue ? true : false"
      @input="emit('update:modelValue', inputValue)"
    />

    <label
      :class="{ 'label-float': isFocused || inputValue }"
      for="dateInput"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";

const props = defineProps({
  label: String,
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);

const isFocused = ref(false);
const inputValue = ref(props.modelValue);

// المزامنة إذا تغيّر الـ modelValue من الأب
watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal;
  }
);
</script>

<style scoped>
.input-wrapper {
  position: relative;
  line-height: 14px;
  margin: 0 0 15px 0;
}

label {
  color: #777;
  font-size: 16px;
  position: absolute;
  z-index: 2;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  transition: all 0.2s ease;
  pointer-events: none;
  background: white;
  padding: 0 5px;
}

input {
  font-size: 17px;
  color: #555;
  outline: none;
  border: 1px solid #bbb;
  padding: 12px 10px;
  border-radius: 7px;
  width: 100%;
  transition: border-color 0.2s ease;
  background-color: white;
}

input:focus {
  border-color: #5e7324;
}

/* وضعية الـ label العائم */
.label-float {
  top: 0px;
  background-color: white;
  font-size: 12px;
  color: #5e7324;
}
</style>
