<template>
  <div class="form-doctor">
    <div class="form-grid">
      <inputText label="اسم الطبيب" v-model="newDoctor.fullName" />
      <InputNumber label="النسبة المئوية %" v-model="newDoctor.percentage" />
      <inputText label="نبذة عن الطبيب" v-model="newDoctor.description" />
    </div>

    <!-- زر الحفظ -->
    <div class="form-actions">
      <button @click="submitDoctor " class="save-btn" :disabled="isLoading">
        <svg v-if="isLoading" class="loading-icon" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
            class="opacity-25"
          ></circle>
          <path
            fill="currentColor"
            class="opacity-75"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
{{ 
  isLoading 
    ? "جاري الحفظ..." 
    : mode === "add" 
      ? "إضافة الطبيب" 
      : "حفظ التعديلات" 
}}
      </button>
    </div>
  </div>
</template>

<script setup>
import inputText from "../../components/inputText.vue";
import { ref } from "vue";
import { _post, _put } from "../../api/axois.js";
import InputNumber from "../../components/InputNumber.vue";
import useToast from "../../toast/toast.js";

const { showToast } = useToast();

const props = defineProps({
  mode: {
    type: String,
    default: "add",
  },
  doctor: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["saved"]);

const isLoading = ref(false);

const newDoctor = ref({
  fullName: "",
  percentage: null,
  description: "",
});

import { watch } from "vue";

watch(
  () => props.doctor,
  (val) => {
    if (props.mode === "edit" && val) {
      newDoctor.value = {
        fullName: val.fullName,
        percentage: val.percentage,
        description: val.description,
      };
    }
  },
  { immediate: true }
);

const submitDoctor = async () => {
  if (
    !newDoctor.value.fullName ||
    !newDoctor.value.percentage ||
    !newDoctor.value.description
  ) {
    showToast("يرجى تعبئة جميع الحقول", "error");
    return;
  }

  try {
    isLoading.value = true;

    if (props.mode === "add") {
      await _post("/api/Doctors", newDoctor.value);
      showToast("تمت إضافة الطبيب بنجاح", "success");
    } else {
      await _put(
        `/api/Doctors/${props.doctor.doctorId}`,
        newDoctor.value
      );
      showToast("تم تعديل بيانات الطبيب بنجاح", "success");
    }

    emit("saved");

    newDoctor.value = {
      fullName: "",
      percentage: 0,
      description: "",
    };
  } catch (error) {
    console.error(error);
    showToast("حدث خطأ أثناء الحفظ", "error");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* حاوية النموذج */
.form-doctor {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
  background: var(--color-white);
  border-radius: 16px;
  border-top: 4px solid var(--color-primary-700);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  font-family: var(--font-primary);
}

/* شبكة النموذج */
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* العناوين (Labels) */
.form-grid label {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary-700);
}

/* الإجراءات */
.form-actions {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

.save-btn {
  color: white;
  background: var(--color-primary-700);
  border: none;
  border-radius: 14px;
  padding: 14px 34px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 190px;
  justify-content: center;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.25);
}

/* Hover */
.save-btn:hover:not(:disabled) {
  background: var(--color-primary-900);
  transform: translateY(-2px);
}

/* Disabled */
.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading-icon {
  width: 18px;
  height: 18px;
  color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ===============================
   RESPONSIVE
   =============================== */

@media (max-width: 768px) {
  .form-doctor {
    padding: 16px;
  }

  .save-btn {
    padding: 12px 24px;
    font-size: 14px;
    min-width: 160px;
  }

  .form-actions {
    margin-top: 24px;
  }
}

/* Active click */
.save-btn:active {
  transform: translateY(0);
}
</style>
