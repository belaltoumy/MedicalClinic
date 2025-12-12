<template>
  <div class="add-doctor-form">
    <div class="form-header">
      <div class="form-icon">
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
        </svg>
      </div>
      <p class="form-description">املأ المعلومات أدناه لإضافة طبيب جديد للعيادة</p>
    </div>

    <div class="form-grid">
      <inputText lable="الاسم الثلاثي" v-model="newDoctor.fullName" />
      <InputNumber lable="النسبة المئوية %" v-model="newDoctor.percentage" />
      <inputText lable="نبذة عن الطبيب" v-model="newDoctor.description" />
    </div>

    <!-- زر الحفظ -->
    <div class="form-actions">
      <button
        @click="addNewDoctor"
        class="save-btn"
        :disabled="isLoading"
      >
        <svg v-if="isLoading" class="loading-icon" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
          <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else class="save-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
        </svg>
        {{ isLoading ? 'جاري الحفظ...' : 'حفظ الطبيب' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import inputText from "./inputText.vue";
import { ref } from "vue";
import { _post } from "../api/axois";
import InputNumber from "./inputNumber.vue";

const emit = defineEmits(["saved"]);

const isLoading = ref(false);

const newDoctor = ref({
  fullName: "",
  percentage: 0,
  description: "",
});

// ✅ دالة الإضافة
const addNewDoctor = async () => {
  // التحقق من أن جميع الحقول ممتلئة
  if (
    !newDoctor.value.fullName ||
    !newDoctor.value.percentage ||
    !newDoctor.value.description
  ) {
    alert("الرجاء تعبئة جميع الحقول");
    return;
  }

  try {
    isLoading.value = true;
    const payload = {
      fullName: newDoctor.value.fullName,
      percentage: newDoctor.value.percentage,
      description: newDoctor.value.description,
    };

    const res = await _post("/api/Doctors", payload);
    console.log("تمت الإضافة:", res.data);

    alert("✅ تمت إضافة الطبيب بنجاح");
    
    // إعادة تعيين النموذج
    newDoctor.value = {
      fullName: "",
      percentage: 0,
      description: "",
    };
    
    emit("saved"); // لإخبار الصفحة الأب بأن الإضافة تمت
  } catch (error) {
    console.error("حدث خطأ أثناء الإضافة:", error.response ? error.response.data : error);
    alert("❌ حدث خطأ أثناء الإضافة");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* حاوية النموذج */
.add-doctor-form {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

/* رأس النموذج */
.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: white;
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

.form-icon svg {
  width: 32px;
  height: 32px;
}

.form-description {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
}

/* شبكة النموذج */
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* الإجراءات */
.form-actions {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

/* زر الحفظ */
.save-btn {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 32px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  min-width: 180px;
  justify-content: center;
}

.save-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* أيقونات الزر */
.save-icon, .loading-icon {
  width: 18px;
  height: 18px;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

/* أنيميشن الدوران */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* تحسينات للشاشات الصغيرة */
@media (max-width: 768px) {
  .add-doctor-form {
    padding: 16px;
  }
  
  .form-header {
    margin-bottom: 24px;
  }
  
  .form-icon {
    width: 56px;
    height: 56px;
    margin-bottom: 12px;
  }
  
  .form-icon svg {
    width: 28px;
    height: 28px;
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

/* تحسين التفاعل */
.save-btn:active {
  transform: translateY(0);
}

/* تأثير التركيز */
.save-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
}
</style>
