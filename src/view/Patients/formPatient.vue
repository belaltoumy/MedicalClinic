<template>
  <div class="form-patient">
    <div class="form-grid">
      <div class="form-row">
        <inputText label="الاسم الأول" v-model="newPatient.firstName" />
        <inputText label="الكنية" v-model="newPatient.lastName" />
      </div> 
      <inputText label="البريد الإلكتروني" v-model="newPatient.email" />
      <inputText label="رقم الهاتف" v-model="newPatient.phone" />
      <inputDate label="تاريخ الميلاد" v-model="newPatient.birthDate" />
      <inputSelect label="الجنس" v-model="newPatient.gender">
        <option value="0">ذكر</option>
        <option value="1">أنثى</option>
      </inputSelect>

    </div>

    <!-- زر الحفظ -->
    <div class="form-actions">
      <button @click="savePatient" :disabled="isLoading" class="save-btn">
  {{ isLoading ? 'جاري الحفظ...' : (editMode ? 'تحديث المريض' : 'حفظ المريض') }}
</button>

    </div>
  </div>
</template>

<script setup>
import inputText from "../../components/inputText.vue";
import inputDate from "../../components/inputDate.vue";
import inputSelect from "../../components/InputSelect.vue";
import { ref, watch } from "vue";
import { _post , _put } from "../../api/axois.js";
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

const newPatient = ref({
  firstName: "",
  lastName: "",
  birthDate: "",
  gender: null,
  phone: "",
  email: "",
});

watch(
  () => props.editData,
  (data) => {
    if (data && props.editMode) {
      newPatient.value = {
        patientId: data.patientId,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: data.birthDate,
        gender: data.gender,
        phone: data.phone,
        email: data.email
      };
    }
  },
  { immediate: true }
);
const savePatient = async () => {
  if (
    !newPatient.value.firstName ||
    !newPatient.value.lastName ||
    !newPatient.value.birthDate ||
    newPatient.value.gender === null ||
    !newPatient.value.phone ||
    !newPatient.value.email
  ) {
    showToast("الرجاء تعبئة جميع الحقول", "error");
    return;
  }

  isLoading.value = true;

  try {
    const payload = {
  firstName: newPatient.value.firstName.trim(),
  lastName: newPatient.value.lastName.trim(),
  birthDate: new Date(newPatient.value.birthDate).toISOString(),
  gender: Number(newPatient.value.gender),
  phone: newPatient.value.phone.trim(),
  email: newPatient.value.email.trim()
};


    if (props.editMode) {
      await _put(`/api/Patients/${newPatient.value.patientId}`, payload);
      showToast("تم تحديث المريض بنجاح ✅", "success");
    } else {
      await _post("/api/Patients", payload);
      showToast("تمت إضافة المريض بنجاح ✅", "success");
    }

    emit("saved");
  } catch (e) {
    showToast(e.response?.data?.message || "حدث خطأ أثناء الحفظ", "error");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>/* حاوية النموذج */
.form-patient {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
  background: var(--color-white);
  border-radius: 16px;
  border-top: 4px solid var(--color-primary-700);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  font-family: var(--font-primary);
  direction: rtl;
}

/* شبكة النموذج */
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* صف مزدوج (الاسم + الكنية) */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* الإجراءات */
.form-actions {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

/* زر الحفظ */
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

/* أيقونات */
.save-icon,
.loading-icon {
  width: 18px;
  height: 18px;
  color: white;
}

/* دوران التحميل */
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

/* Responsive */
@media (max-width: 768px) {
  .form-patient {
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

/* Active */
.save-btn:active {
  transform: translateY(0);
}

/* Focus */
.save-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(184, 165, 122, 0.35);
}

</style>
