<template>
  <div class="add-patient-form">
   

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
      <button
        @click="addNewPatient"
        class="save-btn"
        :disabled="isLoading"
      >
        <svg v-if="isLoading" class="loading-icon" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
          <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isLoading ? 'جاري الحفظ...' : 'حفظ المريض' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import inputText from "./inputText.vue";
import inputDate from "./inputDate.vue";
import inputSelect from "./InputSelect.vue";
import { ref } from "vue";
import { _post } from "../api/axois";

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

// ✅ دالة الإضافة
const addNewPatient = async () => {
  // التحقق من أن جميع الحقول ممتلئة
  if (
    !newPatient.value.firstName ||
    !newPatient.value.lastName ||
    !newPatient.value.birthDate ||
    newPatient.value.gender === null ||
    !newPatient.value.phone ||
    !newPatient.value.email
  ) {
    alert("الرجاء تعبئة جميع الحقول");
    return;
  }

  try {
    isLoading.value = true;
    const payload = {
      firstName: newPatient.value.firstName,
      lastName: newPatient.value.lastName,
      birthDate: newPatient.value.birthDate,
      gender: parseInt(newPatient.value.gender),
      phone: newPatient.value.phone,
      email: newPatient.value.email,
    };

    const res = await _post("/api/Patients", payload);
    console.log("تمت الإضافة:", res.data);

    alert("✅ تمت إضافة المريض بنجاح");
    
    // إعادة تعيين النموذج
    newPatient.value = {
      firstName: "",
      lastName: "",
      birthDate: "",
      gender: null,
      phone: "",
      email: "",
    };
    
    emit("saved"); // لإخبار الصفحة الأب بأن الإضافة تمت
  } catch (error) {
    console.error("حدث خطأ أثناء الإضافة:", error);
    alert("❌ حدث خطأ أثناء الإضافة");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>/* حاوية النموذج */
.add-patient-form {
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
  .add-patient-form {
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
