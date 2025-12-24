<template>
  <div class="add-expense-form">
   
    <div class="form-grid">
      <div class="form-row">
        <inputSelect
  label="نوع المصروف"
  v-model="newExpense.expenseTypeId"
>
  <option
    v-for="type in typesExpenses"
    :key="type.expenseTypeId"
    :value="type.expenseTypeId"
  >
    {{ type.typeName }}
  </option>
</inputSelect>

<inputSelect
  label="البريد الالكتروني "
  v-model="newExpense.userId"
>
  <option
    v-for="user in users"
    :key="user.id"
    :value="user.id"
  >
    {{ user.userName }}
  </option>
</inputSelect>

        <inputText label="وصف المصروف" v-model="newExpense.description" />
        <inputNumber label="المبلغ" v-model="newExpense.amount" />
      </div>
    </div>
    <!-- زر الحفظ -->
    <div class="form-actions">
      <button
        @click="addNewExpense"
        class="save-btn"
        :disabled="LoadingSave"
      >
        <svg v-if="LoadingSave" class="loading-icon" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
          <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ LoadingSave ? 'جاري الحفظ...' : 'حفظ الإجراء' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";  
import inputText from "./inputText.vue";
import inputNumber from "./inputNumber.vue";
import inputSelect from "./InputSelect.vue";
import { ref } from "vue";
import { _post, _get } from "../api/axois";

const emit = defineEmits(["saved"]);

const isLoading = ref(false);
const LoadingSave = ref(false);

const typesExpenses = ref([]);
const users = ref([]);

const newExpense = ref({
  description: "",
  amount: null,
  expenseTypeId: "",
  userId: "",
});

const fetchUsers = async () => {
  try {
    isLoading.value = true;
    const res = await _get("/api/Auth/getAllUsers");
    users.value = res.data;
  } catch (error) {
    console.error("حدث خطأ أثناء جلب المستخدمين:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchTypeExpense = async () => {
  try {
    isLoading.value = true;
    const res = await _get("/api/Expenses/getAllExpenseType");
    typesExpenses.value = res.data;
  } catch (error) {
    console.error("حدث خطأ أثناء جلب أنواع المصروفات:", error);
  } finally {
    isLoading.value = false;
  }
};
// ✅ دالة الإضافة
const addNewExpense = async () => {
  // التحقق من أن جميع الحقول ممتلئة
  if (
    !newExpense.value.description ||
    newExpense.value.amount <= 0 ||
    !newExpense.value.expenseTypeId ||
    !newExpense.value.userId
  ) {
    alert("الرجاء تعبئة جميع الحقول");
    return;
  }
  try {
    LoadingSave.value = true;
    const payload = {
      description: newExpense.value.description,
      amount: newExpense.value.amount,
      expenseTypeId: newExpense.value.expenseTypeId,
      userId: newExpense.value.userId
    };
    const res = await _post("/api/Expenses", payload);
    console.log("تمت الإضافة:", res.data);
    alert("✅ تمت إضافة المصروف بنجاح");
    
    // إعادة تعيين النموذج
    newExpense.value = {
      description: "",
      amount: 0,
      expenseTypeId: "",
      userId: "",
    };
    
    emit("saved"); // لإخبار الصفحة الأب بأن الإضافة تمت
  } catch (error) {
    console.error("حدث خطأ أثناء الإضافة:", error);
    alert("❌ حدث خطأ أثناء الإضافة");
  } finally {
    LoadingSave.value = false;
  }
};

onMounted(() => {
  fetchUsers();
  fetchTypeExpense();
});
</script>

<style scoped>
.add-expense-form {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
  background: #ffffff;
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
  margin-top: 28px;
  display: flex;
  justify-content: center;
}

.save-btn {
  background: var(--color-primary-700);
  color: #ffffff;
  border: none;
  border-radius: 14px;
  padding: 14px 36px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 190px;
  justify-content: center;
  box-shadow: 0 8px 22px rgba(59, 130, 246, 0.35);
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

.loading-icon {
  width: 18px;
  height: 18px;
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
  .add-expense-form {
    padding: 16px;
  }

  .form-row {
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
