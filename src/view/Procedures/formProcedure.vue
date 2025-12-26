<template>
  <div class="form-procedure">
    <div class="form-grid">
      <div class="form-row">
        <inputText label="اسم الإجراء" v-model="newProcedure.name" />
        <inputNumber label="التكلفة الافتراضية" v-model="newProcedure.defaultCost" />
      </div>
    </div>

    <!-- زر الحفظ -->
    <div class="form-actions">
     <button
  @click="saveProcedure"
  class="save-btn"
  :disabled="isLoading"
>
  {{ isLoading ? 'جاري الحفظ...' : (editMode ? 'تحديث الإجراء' : 'حفظ الإجراء') }}
</button>

    </div>
  </div>
</template>

<script setup>
import inputText from "../../components/inputText.vue";
import inputNumber from "../../components/inputNumber.vue";
import { ref ,watch} from "vue";
import { _post ,_put} from "../../api/axois.js";
import useToast from "../../toast/toast.js";

const { showToast } = useToast();
const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  },
  editData: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(["saved"]);

const isLoading = ref(false);

const newProcedure = ref({
  name: "",
  defaultCost: null,

});

watch(
  () => props.editData,
  (data) => {
    if (data && props.editMode) {
      newProcedure.value = {
        procedureId: data.procedureId,
        name: data.name,
        defaultCost: data.defaultCost
      };
    }
  },
  { immediate: true }
);
const saveProcedure = async () => {
  if (
    !newProcedure.value.name ||
    newProcedure.value.defaultCost <= 0
  ) {
    showToast("الرجاء تعبئة جميع الحقول", "error");
    return;
  }

  isLoading.value = true;

  try {
    const payload = {
      name: newProcedure.value.name.trim(),
      defaultCost: newProcedure.value.defaultCost
    };

    if (props.editMode) {
      await _put(
        `/api/Procedures/${newProcedure.value.procedureId}`,
        payload
      );
      showToast("تم تحديث الإجراء بنجاح ✅", "success");
    } else {
      await _post("/api/Procedures", payload);
      showToast("تمت إضافة الإجراء بنجاح ✅", "success");
    }

    emit("saved");
  } catch (error) {
    showToast(
      error.response?.data?.title ||
      "حدث خطأ أثناء الحفظ",
      "error"
    );
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.form-procedure {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
  background: var(--color-white);
  border-radius: 16px;
  border-top: 4px solid var(--color-primary-700);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  font-family: var(--font-primary);
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-actions {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

.form-actions {
  margin-top: 20px;
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
  box-shadow: 0 8px 22px rgba(184, 165, 122, 0.35);
}

.save-btn:hover:not(:disabled) {
  background: var(--color-primary-900);
  transform: translateY(-2px);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.save-icon,
.loading-icon {
  width: 18px;
  height: 18px;
}

.loading-icon {
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

@media (max-width: 768px) {
  .form-procedure {
    padding: 16px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
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

.save-btn:active {
  transform: translateY(0);
}

.save-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

</style>
