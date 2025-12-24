<template>
  <Dashboard>
    <div class="doctors-container" dir="rtl">
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
              <h1 class="page-title">إدارة المرضى</h1>
            </div>
          </div>

          <button @click="showDialogAdd = true" class="add-btn">
            <svg class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
            إضافة مريض جديد
          </button>
        </div>
      </header>
      <!-- المحتوى الرئيسي -->
      <main class="main-content">
        <!-- الجدول -->
        <div class="table-section">
          <compoTable
            :columns="columns"
            :rows="patients"
            :loading="loading"
            :showActions="true"
          >
            <template #actions="{ row }">
              <button class="action-btn view-btn" @click="viewVisits(row)">
                <svg class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  <path
                    fill-rule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                الزيارات
              </button>
              <button class="action-btn edit-btn" @click="editPatient(row)">
                <svg class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                  ></path>
                </svg>
                تعديل
              </button>
              <button class="action-btn delete-btn" @click="deletePatient(row)">
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
            <svg
              class="pagination-icon"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
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
            <svg
              class="pagination-icon"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </main>
      <!-- نافذة الإضافة -->
      <compoAddDialog v-model="showDialogAdd" title="إضافة مريض جديد">
        <AddNewPatient @saved="handleUserAdded" />
      </compoAddDialog>
    </div>

    <!-- كومبو الزيارات -->
    <compoDialog
      v-model="showVisitsDialog"
      :title="`الزيارات الخاصة بـ ${selectedPatientName}`"
    >
      <div v-if="selectedPatientVisits.length">
        <div
          class="overflow-x-auto rounded-lg shadow-lg border border-gray-200"
        >
          <table class="min-w-full bg-white">
            <thead
              class="bg-linear-to-r from-indigo-600 to-purple-600 text-white"
            >
              <tr>
                <th class="px-6 py-4 text-center">تاريخ الزيارة</th>
                <th class="px-6 py-4 text-center">الطبيب</th>
                <th class="px-6 py-4 text-center">التكلفة</th>
                <th class="px-6 py-4 text-center">الاجراء</th>

                <th class="px-6 py-4 text-center">تفاصيل</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="v in selectedPatientVisits"
                :key="v.visitId"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 text-center">
                  {{ new Date(v.visitDate).toLocaleDateString("ar-EG") }}
                </td>
                <td class="px-6 py-4 text-center">{{ v.doctorName }}</td>
                <td class="px-6 py-4 text-center">{{ v.totalCost }}</td>
                <td class="px-6 py-4 text-center">
                  {{ v.visitItems?.[0]?.procedureName || "—" }}
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="flex justify-center gap-2">
                    <button class="action-btn view-btn" @click="openItems(v)">
                      المواد المستخدمة
                    </button>
                    <button
                      class="action-btn view-btn"
                      @click="openPayments(v)"
                    >
                      الدفعات
                    </button>
                    <button
                      class="action-btn delete-btn"
                      @click="deleteVisit(v)"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="text-center text-gray-500 py-4">
        لا توجد زيارات لهذا المريض
      </div>
    </compoDialog>
    <!-- كومبو المواد -->
    <compoDialog v-model="showItemsDialog" title="المواد المستخدمة">
      <div v-if="selectedItems.length">
        <table
          class="min-w-full text-right border border-gray-300 rounded-lg overflow-hidden"
        >
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 border">اسم المادة</th>
              <th class="px-4 py-2 border">الكمية</th>
              <th class="px-4 py-2 border">السعر</th>
              <th class="px-4 py-2 border">الإجمالي</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="it in selectedItems"
              :key="it.itemId"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-2 border">{{ it.materialName }}</td>
              <td class="px-4 py-2 border">{{ it.quantity }}</td>
              <td class="px-4 py-2 border">{{ it.unitPrice }}</td>
              <td class="px-4 py-2 border">{{ it.totalCost }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center text-gray-500 py-4">
        لا توجد مواد مسجلة
      </div>
    </compoDialog>
    <!-- كومبو الدفعات -->
    <compoDialog v-model="showPaymentsDialog" title="الدفعات">
      <div v-if="selectedPayments.length" class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 border text-center">#</th>
              <th class="px-4 py-3 border text-center">تاريخ الدفعة</th>
              <th class="px-4 py-3 border text-center">المبلغ</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(p, index) in selectedPayments"
              :key="p.paymentId"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-2 border text-center">
                {{ index + 1 }}
              </td>

              <td class="px-4 py-2 border text-center">
                {{ new Date(p.paymentDate).toLocaleDateString("en-US") }}
              </td>

              <td
                class="px-4 py-2 border text-center font-semibold text-green-600"
              >
                {{ p.amount }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="text-center text-gray-500 py-4">لا توجد دفعات</div>
    </compoDialog>
  </Dashboard>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import compoTable from "../components/compoTable.vue";
import compoDialog from "../components/compoDialog.vue";
import compoAddDialog from "../components/compoAddDialog.vue";
import AddNewPatient from "../components/addNewPatient.vue";
import { _get, _delete } from "../api/axois";
import Dashboard from "../components/dashboard.vue";

const patients = ref([]);
const loading = ref(false);

const pageNumber = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);
const showDialogAdd = ref(false);
const showVisitsDialog = ref(false);
const selectedPatientVisits = ref([]);
const selectedPatientName = ref("");

const showItemsDialog = ref(false);
const showPaymentsDialog = ref(false);

const selectedItems = ref([]);
const selectedPayments = ref([]);

const columns = [
  { key: "fullName", label: "الاسم الكامل" },
  { key: "birthDate", label: "تاريخ الميلاد" },
  { key: "genderText", label: "الجنس" },
  { key: "phone", label: "الهاتف" },
  { key: "email", label: "البريد الإلكتروني" },
  { key: "totalCost", label: "إجمالي التكلفة" },
  { key: "totalPaid", label: "المبلغ المدفوع" },
  { key: "remainingCost", label: "المبلغ المتبقي" },
];

// دالة جلب المرضى
const fetchPatients = async () => {
  loading.value = true;
  try {
    const res = await _get("/api/Patients", {
      params: {
        pageNumber: pageNumber.value,
        pageSize: pageSize.value,
      },
    });

    patients.value = res.data.data.map((patient) => ({
      ...patient,
      fullName: `${patient.firstName} ${patient.lastName}`,
      genderText: patient.gender === 0 ? "ذكر" : "أنثى",
      birthDate: new Date(patient.birthDate).toLocaleDateString("en-US"),
    }));
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
    fetchPatients();
  }
};

const nextPage = () => {
  if (pageNumber.value < totalPages.value) {
    pageNumber.value++;
    fetchPatients();
  }
};

const editPatient = (patient) => {
  console.log("تعديل:", patient);
  // هنا تفتح Dialog أو صفحة تعديل
};

const viewVisits = async (patient) => {
  try {
    loading.value = true;

    const res = await _get(
      `/api/Patients/${patient.patientId}/medical-history`
    );

    selectedPatientName.value = res.data.fullName;
    selectedPatientVisits.value = res.data.visits;

    showVisitsDialog.value = true;
  } catch (error) {
    console.error("خطأ أثناء جلب الزيارات:", error);
    alert("تعذر جلب الزيارات ❌");
  } finally {
    loading.value = false;
  }
};

const openItems = (visit) => {
  selectedItems.value =
    visit.visitItems?.flatMap((item) => item.materials) || [];
  showItemsDialog.value = true;
};

const openPayments = (visit) => {
  selectedPayments.value = visit.payments || [];
  showPaymentsDialog.value = true;
};

const deletePatient = async (patient) => {
  const confirmed = confirm(`هل أنت متأكد من حذف ${patient.fullName}؟`);
  if (!confirmed) return;

  try {
    const res = await _delete(`/api/Patients/${patient.patientId}`);

    if (res.status === 200 || res.status === 204) {
      alert("تم حذف المريض بنجاح ✅");
      fetchPatients();
    } else {
      console.error("خطأ من السيرفر:", res.data);
      alert(`فشل حذف المريض ❌\n${res.data?.message || "حدث خطأ غير معروف"}`);
    }
  } catch (error) {
    console.error("حدث خطأ أثناء الحذف:", error);
    alert("فشل حذف المريض ❌");
  }
};

function handleUserAdded() {
  showDialogAdd.value = false;
  fetchPatients(); // لتحديث الجدول بعد الإضافة
}

const deleteVisit = async (visit) => {
  if (!visit?.visitId) return;

  const confirmed = confirm(
    "هل أنت متأكد من حذف هذه الزيارة؟ سيتم حذف كل تفاصيلها."
  );
  if (!confirmed) return;

  try {
    loading.value = true;

    const res = await _delete(`/api/Visit/${visit.visitId}`);

    if (res.status === 200 || res.status === 204) {
      alert("تم حذف الزيارة بنجاح ✅");

      // حذف الزيارة من الجدول مباشرة (بدون إعادة جلب)
      selectedPatientVisits.value = selectedPatientVisits.value.filter(
        (v) => v.visitId !== visit.visitId
      );
    } else {
      alert("فشل حذف الزيارة ❌");
    }
  } catch (error) {
    console.error("خطأ أثناء حذف الزيارة:", error);
    alert("حدث خطأ أثناء الحذف ❌");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPatients();
});
</script>

<style scoped>
/* الحاوية الرئيسية */
.doctors-container {
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

.view-btn {
  background: var(--color-primary-700);
  color: white;
  box-shadow: var(--color-primary-900);
}

.view-btn:hover {
  background: var(--color-primary-900);
  transform: translateY(-1px);
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
