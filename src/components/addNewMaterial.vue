<template>
  <div class="material-form">
    <!-- هيدر النموذج -->
    <div class="form-header">
      <div class="header-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      </div>
      <div>
        <h2 class="form-title">{{ editMode ? 'تعديل المادة' : 'إضافة مادة جديدة' }}</h2>
        <p class="form-subtitle">{{ editMode ? 'تحديث بيانات المادة' : 'إدخال بيانات المادة الجديدة' }}</p>
      </div>
    </div>

    <!-- نموذج البيانات -->
    <div class="form-content">
      <div class="input-grid">
        <inputText 
          lable="اسم المادة" 
          v-model="newMaterial.name" 
          :disabled="loading"
        />
        <inputText 
          lable="الوحدة" 
          v-model="newMaterial.unit" 
          :disabled="loading"
        />
        <inputNumber 
          label="السعر" 
          v-model="newMaterial.unitPrice" 
          :disabled="loading"
        />
        <inputNumber 
          label="الكلفة" 
          v-model="newMaterial.costBearer" 
          :disabled="loading"
        />
      </div>

      <!-- أزرار الإجراءات -->
      <div class="form-actions">
        <button
          @click="addNewMaterial"
          :disabled="loading"
          class="save-btn"
        >
          <div v-if="loading" class="loading-spinner"></div>
          <svg v-else class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          {{ loading ? 'جاري الحفظ...' : (editMode ? 'تحديث المادة' : 'إضافة المادة') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import inputText from "./inputText.vue";
import inputNumber from "./inputNumber.vue";
import { ref, watch } from "vue";
import { _post, _put } from "../api/axois";

const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  },
  editData: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["material-added"]);

const loading = ref(false);
const newMaterial = ref({
  name: "",
  unit: "",
  unitPrice: 0,
  costBearer: 0
});

// مراقبة بيانات التعديل
watch(() => props.editData, (newData) => {
  if (newData && props.editMode) {
    newMaterial.value = {
      id: newData.id,
      name: newData.name || "",
      unit: newData.unit || "",
      unitPrice: newData.unitPrice || 0,
      costBearer: newData.costBearer || 0
    };
  }
}, { immediate: true });

// دالة الحفظ (إضافة أو تعديل)
const addNewMaterial = async () => {
  // التحقق من صحة البيانات
  if (
    !newMaterial.value.name ||
    !newMaterial.value.unit ||
    newMaterial.value.unitPrice <= 0 ||
    newMaterial.value.costBearer <= 0
  ) {
    alert("الرجاء تعبئة جميع الحقول بشكل صحيح");
    return;
  }

  loading.value = true;

  try {
    const payload = {
      name: newMaterial.value.name,
      unit: newMaterial.value.unit,
      unitPrice: newMaterial.value.unitPrice,
      costBearer: newMaterial.value.costBearer,
    };

    let res;
    if (props.editMode && newMaterial.value.id) {
      // تعديل مادة موجودة
      res = await _put(`/api/Materials/${newMaterial.value.id}`, payload);
      alert("✅ تم تحديث المادة بنجاح");
    } else {
      // إضافة مادة جديدة
      res = await _post("/api/Materials", payload);
      alert("✅ تمت إضافة المادة بنجاح");
    }

    console.log("تمت العملية:", res.data);
    
    // إعادة تعيين النموذج
    newMaterial.value = {
      name: "",
      unit: "",
      unitPrice: 0,
      costBearer: 0
    };

    emit("material-added");
  } catch (error) {
    console.error("حدث خطأ:", error.response ? error.response.data : error);
    alert(`❌ حدث خطأ أثناء ${props.editMode ? 'التحديث' : 'الإضافة'}`);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* الحاوية الرئيسية */
.material-form {
  direction: rtl;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* هيدر النموذج */
.form-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #fef3c7;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.header-icon svg {
  width: 24px;
  height: 24px;
}

.form-title {
  font-size: 20px;
  font-weight: bold;
  color: #f59e0b;
  margin: 0 0 4px 0;
}

.form-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* محتوى النموذج */
.form-content {
  padding: 0;
}

.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

/* أزرار الإجراءات */
.form-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

.save-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 140px;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.save-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #d97706, #b45309);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

/* مؤشر التحميل */
.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #ffffff40;
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* أنيميشن التحميل */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* تحسينات للشاشات الصغيرة */
@media (max-width: 768px) {
  .input-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .form-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .form-title {
    font-size: 18px;
  }
  
  .save-btn {
    padding: 10px 20px;
    font-size: 13px;
    min-width: 120px;
  }
}
</style>
