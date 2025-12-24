<template>
  <div class="material-form">
 
    <!-- نموذج البيانات -->
    <div class="form-content">
      <div class="input-grid">
        <inputText 
          label="اسم المادة" 
          v-model="newMaterial.name" 
          :disabled="loading"
        />
        <inputText 
          label="الوحدة" 
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
  unitPrice: null,
  costBearer: null
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

/* محتوى النموذج */
.form-content {
  padding: 0;
}

/* شبكة الحقول */
.input-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* أزرار الإجراءات */
.form-actions {
  margin-top: 20px;
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

/* أيقونة الزر */
.btn-icon {
  width: 18px;
  height: 18px;
}

/* Spinner */
.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #ffffff40;
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .material-form {
    padding: 16px;
  }

  .input-grid {
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

</style>
