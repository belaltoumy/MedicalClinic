<template>
  <div class="input-wrapper">
    <select
      id="selectInput"
      v-model="inputValue"
      @focus="isFocused = true"
      @blur="isFocused = inputValue ? true : false"
      @change="emit('update:modelValue', inputValue)"
    >
      <option value="" disabled selected hidden></option>
      <slot></slot>
    </select>

    <label
      :class="{ 'label-float': isFocused || inputValue }"
      for="selectInput"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";

const props = defineProps({
  label: String,
  modelValue: [String, Number],
});

const emit = defineEmits(["update:modelValue"]);

const isFocused = ref(false);
const inputValue = ref(props.modelValue);

// مزامنة modelValue عند التغيير من الأب
watch(
  () => props.modelValue,
  (v) => (inputValue.value = v)
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

select {
  font-size: 17px;
  color: #555;
  outline: none;
  border: 1px solid #bbb;
  padding: 12px 10px;
  border-radius: 7px;
  width: 100%;
  transition: border-color 0.2s ease;
  background-color: white;
  appearance: none; /* لإخفاء السهم الافتراضي */
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='gray'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: left 10px center;
}

select:focus {
  border-color: #5e7324;
}

.label-float {
  top: 0px;
  background-color: white;
  font-size: 12px;
  color: #5e7324;
}
</style>
