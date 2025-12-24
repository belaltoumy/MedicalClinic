<template>
  <div class="add-payment-form">
    <div class="form-grid">
      <div class="form-row">
   
        <inputNumber label=" المبلغ المدفوع" v-model="newPayment.amount" />
        
        <!-- النوع -->
        <InputSelect v-model="newPayment.type" label="نوع الدفعة">
            <option :value="0">نقدي</option>
            <option :value="1">بطاقة ائتمان</option>
            <option :value="2">شيك</option>
      </InputSelect>
      </div>
    </div>

    <!-- زر الحفظ -->
    <div class="form-actions">
      <button
        @click="addNewPayment"
        class="save-btn"
        :disabled="isLoading"
      >
        <svg v-if="isLoading" class="loading-icon" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
          <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        
        {{ isLoading ? 'جاري الحفظ...' : 'حفظ الدفعة' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import inputNumber from "./inputNumber.vue";
import InputSelect from "./InputSelect.vue";
import { ref } from "vue";
import { _post } from "../api/axois";

const emit = defineEmits(["paymentAdded"]);

const props = defineProps({
  visitId: {
    type: String,
    required: true,
  },
  patientId: {
    type: String,
    required: true,
  },
});

const isLoading = ref(false);
const newPayment = ref({
  patientId: props.patientId,
  visitId: props.visitId,
  amount: null,
  type: null,
});


// ✅ دالة الإضافة
const addNewPayment = async () => {
  if (!newPayment.value.amount || newPayment.value.amount <= 0) {
    alert("الرجاء إدخال مبلغ صحيح");
    return;
  }

  try {
    isLoading.value = true;

    await _post("/api/Payments", newPayment.value);

    alert("✅ تمت إضافة الدفعة بنجاح");

    emit("paymentAdded"); // نحدث الجدول
  } catch (error) {
    console.error(error);
    alert("❌ حدث خطأ أثناء الإضافة");
  } finally {
    isLoading.value = false;
  }
};

</script>

<style scoped>
.add-payment-form {
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

.form-actions {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}
/* الإجراءات */
.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* زر الحفظ — نفس المستخدم */
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

/* الأيقونات */
.save-icon,
.loading-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary-900);
}

.loading-icon {
  animation: spin 1s linear infinite;
}

/* أنيميشن */
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
  .add-payment-form {
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

</style>
