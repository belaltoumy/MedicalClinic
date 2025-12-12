<template>
  <div class="input-wrapper">
    <input
      type="number"
      id="user"
      v-model="inputValue"
      @focus="isFocused = true"
      @blur="isFocused = inputValue.toString().length > 0"
      @input="emit('update:modelValue', inputValue)"
      inputmode="numeric"
    />
    <label :class="{ 'label-float': isFocused || inputValue.toString().length > 0 }" for="user">
      {{ label }}
    </label>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const isFocused = ref(false);
const inputValue = ref(props.modelValue);

// ✅ مزامنة modelValue مع inputValue عند التغيير من الخارج
watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue;
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

.label-float {
  top: 0px;
  background-color: white;
  font-size: 12px;
  color: #5e7324;
}
</style>
