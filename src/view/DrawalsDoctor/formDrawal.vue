<template>
  <div class="form-drawal">
    <div class="form-grid">
     <InputSelect 
  v-model="newDrawal.doctorId"
            label="اختر الطبيب"
            required
          >
            <option
              v-for="doc in doctors"
              :key="doc.doctorId"
              :value="doc.doctorId"
            >
              {{ doc.fullName }}
            </option>
          </InputSelect>

      <InputNumber label="المبلغ" v-model="newDrawal.amount" />
      <inputText label="ملاحظة" v-model="newDrawal.notes" />
    </div>

    <div class="form-actions">
      <button
        @click="submitDoctor"
        class="save-btn"
        :disabled="isLoading"
      >
        {{ isLoading ? "جاري الحفظ..." : mode === "add" ? "إضافة السحب" : "حفظ التعديلات" }}
      </button>
    </div>
  </div>
</template>



<script setup>
import inputText from "../../components/inputText.vue";
import InputSelect from "../../components/InputSelect.vue";
import InputNumber from "../../components/InputNumber.vue";
import { onMounted, ref, watch } from "vue";
import { _post, _put, _get } from "../../api/axois.js";
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

const doctors = ref([]);

const newDrawal = ref({
  doctorId: "",
  amount: null,
  notes: "",
});

const fetchDoctors = async () => {
  const res = await _get("/api/Doctors", {
    params: { all: true },
  });

   doctors.value = res.data.data;
};

// ✅ تعبئة البيانات عند التعديل
watch(
  () => props.doctor,
  (val) => {
    if (props.mode === "edit" && val) {
      newDrawal.value = {
        doctorId: val.doctorId,
        amount: val.amount,
        notes: val.notes,
      };
    }
  },
  { immediate: true }
);

// ✅ إرسال البيانات
const submitDoctor = async () => {
  if (!newDrawal.value.doctorId || !newDrawal.value.amount) {
    showToast("يرجى تعبئة جميع الحقول", "error");
    return;
  }

  try {
    isLoading.value = true;

    if (props.mode === "add") {
      await _post("/api/DoctorWithdrawals", newDrawal.value);
      showToast("تمت الإضافة بنجاح", "success");
    } else {
      await _put(
        `/api/DoctorWithdrawals/${props.doctor.withdrawalId}`,
        newDrawal.value
      );
      showToast("تم التعديل بنجاح", "success");
    }

    emit("saved");
  } catch (error) {
    console.error(error);
    showToast("حدث خطأ أثناء الحفظ", "error");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDoctors();
});
</script>


<style scoped>
/* حاوية النموذج */
.form-drawal {
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
  .form-drawal {
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
