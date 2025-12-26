<template>
  <Dashboard>
  <div class="payment-container" dir="rtl">
    <!-- الهيدر -->
    <header class="page-header">
      <div class="header-content">
        <div class="title-section">
          <div class="title-icon">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <div class="title-text">
            <h1 class="page-title">إدارة الدفعات</h1>
          </div>
        </div>
      </div>
    </header>

    <!-- المحتوى الرئيسي -->
    <main class="main-content">
      <!-- الجدول -->
      <div class="table-section">
        <compoTable
          :columns="columns"
          :rows="formattedPayments"
          :loading="loading"
          :showActions="true"
        >
          <template #actions="{ row }">
            <button class="action-btn edit-btn" @click="openEditPayment(row)">
              <svg class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                ></path>
              </svg>
              تعديل
            </button>
            <button class="action-btn delete-btn" @click="deletePayment(row)">
              <svg class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                  clip-rule="evenodd"
                ></path>
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              حذف
            </button>
          </template>
        </compoTable>
      </div>

      <!-- التنقل بين الصفحات -->
      <div class="pagination-section">
        <button
          class="pagination-btn"
          :disabled="pageNumber === 1"
          @click="prevPage"
        >
          <svg class="pagination-icon" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
          السابق
        </button>

        <div class="pagination-info">
          صفحة {{ pageNumber }} من {{ totalPages }}
        </div>

        <button
          class="pagination-btn"
          :disabled="pageNumber === totalPages"
          @click="nextPage"
        >
          التالي
          <svg class="pagination-icon" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </main>
    <compoDialog v-model="showEditDialog" title="تعديل الدفعة">
      <input-number label="المبلغ" v-model="editPaymentData.amount" />

      <input-select label="طريقة الدفع" v-model="editPaymentData.type">
        <option :value="0">نقدي</option>
        <option :value="1">بطاقة</option>
        <option :value="2">شيك</option>
      </input-select>

      <button class="add-btn" @click="updatePayment">حفظ التعديلات</button>
    </compoDialog>
  </div>
  </Dashboard>
</template>

<script setup>
import Dashboard from "../components/dashboard.vue";
import { ref, onMounted, computed } from "vue";
import compoTable from "../components/compoTable.vue";
import compoDialog from "../components/compoDialog.vue";
import inputNumber from "../components/inputNumber.vue";
import inputSelect from "../components/InputSelect.vue";
import { _get, _delete, _put } from "../api/axois";
import useToast from "../toast/toast.js";

const { showToast } = useToast();

const Payments = ref([]);
const loading = ref(false);
const pageNumber = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);

const showEditDialog = ref(false);

const editPaymentData = ref({
  paymentId: null,
  amount: null,
  type: 0,
});

const columns = [
  { key: "patienName", label: "اسم المريض" },
  { key: "amount", label: "المبلغ المدفوع" },
  { key: "paymentDate", label: "تاريخ الدفع" },
  { key: "type", label: "طريقة الدفع" },
];

// دالة جلب الدفعات
const fetchPayments = async () => {
  loading.value = true;
  try {
    const res = await _get("/api/Payments", {
      params: {
        pageNumber: pageNumber.value,
        pageSize: pageSize.value,
      },
    });

    Payments.value = res.data.data; // صح
    totalPages.value = res.data.totalPages;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const prevPage = () => {
  if (pageNumber.value > 1) {
    pageNumber.value--;
    fetchProcedures();
  }
};

const nextPage = () => {
  if (pageNumber.value < totalPages.value) {
    pageNumber.value++;
    fetchProcedures();
  }
};

const openEditPayment = (payment) => {
  editPaymentData.value = {
    paymentId: payment.paymentId,
    amount: payment.amount,
    type: payment.type,
  };
  showEditDialog.value = true;
};

const updatePayment = async () => {
  try {
    await _put(`/api/Payments/${editPaymentData.value.paymentId}`, {
      amount: editPaymentData.value.amount,
      type: editPaymentData.value.type,
    });

    showToast("تم تعديل الدفعة بنجاح ", "success");
    showEditDialog.value = false;
    fetchPayments();
  } catch (error) {
    showToast("فشل تعديل الدفعة", "error");
  }
};
const deletePayment = async (payment) => {
  const confirmed = confirm(
    `هل أنت متأكد من حذف دفعة بقيمة ${payment.amount}؟`
  );
  if (!confirmed) return;

  try {
    const res = await _delete(`/api/Payments/${payment.paymentId}`);

    if (res.status === 200 || res.status === 204) {
      showToast("تم حذف الدفعة بنجاح ", "success");
      fetchPayments();
    } else {
      showToast("فشل حذف الدفعة ", "error");
    }
  } catch (error) {
    showToast("فشل حذف الدفعة", "error");
  }
};

// function handleProcedureAdded() {
//   showDialogAdd.value = false;
//   fetchProcedures(); // لتحديث الجدول بعد الإضافة
// }
const formattedPayments = computed(() =>
  Payments.value.map((p) => ({
    ...p,
    paymentDate: new Date(p.paymentDate).toLocaleDateString("en-GB"),
  }))
);

onMounted(() => {
  fetchPayments();
});
</script>

<style scoped>
/* الحاوية الرئيسية */
.payment-container {
 background-color: var(--color-gray-100);
  font-family: var(--font-primary);
}

/* هيدر الصفحة */
.page-header {
 background-color: var(--color-white);
  border-bottom: 3px solid var(--color-accent-500);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

/* قسم العنوان */
.title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-icon {
 background-color: var(--color-primary-700);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
}

.title-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.page-title {
   font-size: 28px;
  font-weight: bold;
  color: var(--color-primary-900);
}

/* زر الإضافة */
.add-btn {
 background-color: var(--color-primary-700);
  color: var(--color-white);
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-btn:hover {
  background-color: var(--color-primary-900);
  transform: translateY(-2px);
  box-shadow: var(--color-primary-700);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

/* المحتوى الرئيسي */
.main-content {
  /* max-width: 1200px; */
  margin: 0 auto;
  padding: 15px;
}

/* قسم الجدول */
.table-section {
  animation: fadeInUp 0.6s ease-out;
  margin-bottom: 24px;
}

/* أزرار الإجراءات */
.action-btn {
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 80px;
  justify-content: center;
}

.edit-btn {
  background: var(--color-primary-700);
  color: white;
  box-shadow: var(--color-primary-900);
}

.edit-btn:hover {
  background: var(--color-primary-900);
  transform: translateY(-1px);
}

.delete-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.delete-btn:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

/* التنقل بين الصفحات */
.pagination-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.pagination-btn {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #8b5cf6;
  background: linear-gradient(135deg, #faf5ff, #f3e8ff);
  color: #8b5cf6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  background: white;
  border: 2px solid #8b5cf6;
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 600;
  color: #8b5cf6;
  min-width: 140px;
  text-align: center;
}

.pagination-icon {
  width: 16px;
  height: 16px;
}

/* أنيميشن */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* تحسينات للشاشات الصغيرة */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .main-content {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .add-btn {
    padding: 10px 16px;
    font-size: 13px;
  }

  .stat-card {
    max-width: 100%;
  }

  .action-btn {
    padding: 6px 10px;
    font-size: 12px;
    min-width: 70px;
  }

  .pagination-section {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
