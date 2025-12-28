<template>
  <Dashboard>
    <div class="visits-container" dir="rtl">
      <!-- الهيدر -->
      <header class="page-header">
        <div class="header-content">
          <div class="title-section">
            <div class="title-icon">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
                ></path>
              </svg>
            </div>
            <div class="title-text">
              <h1 class="page-title">إدارة الزيارات</h1>
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
            إضافة زيارة جديدة
          </button>
        </div>
      </header>
<!-- فلاتر البحث -->
<div class="search-filters">
  <!-- حسب النوع -->
  <div class="filter-item">
    <InputSelect label="نوع الزيارة" v-model="filters.type" class="input">
      <option value="0">أولية</option>
      <option value="1">مراجعة</option>
    </InputSelect>
  </div>

  <!-- حسب الحالة -->
  <div class="filter-item">
    <InputSelect label="الحالة" v-model="filters.status" class="input">
      <option value="0">مدخلة</option>
      <option value="1">قيد الانتظار</option>
    </InputSelect>
  </div>

  <!-- من تاريخ -->
  <div class="filter-item">
    <inputDate label="من تاريخ" v-model="filters.fromDate" class="input" />
  </div>

  <!-- إلى تاريخ -->
  <div class="filter-item">
    <inputDate label="إلى تاريخ" v-model="filters.toDate" class="input" />
  </div>

  <!-- أزرار -->
  <div class="filter-actions">
    <button class="search-btn" @click="searchVisits">
      بحث
    </button>
  </div>
</div>

      <!-- المحتوى الرئيسي -->
      <main class="main-content">
        <!-- الجدول -->
        <div class="table-section">
          <CompoTable
            :columns="columns"
            :rows="visites"
            :loading="loading"
            show-actions
          >
            <template #actions="{ row }">
              <button
                class="action-btn edit-btn"
                @click="viewDetailsVisit(row)"
              >
                <svg class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                  ></path>
                </svg>
                تفاصيل الزيارة
              </button>
              <button class="action-btn edit-btn" @click="openAddPayment(row)">
                <svg class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                  ></path>
                </svg>
                اضافة دفعة
              </button>
              
              <button
                class="action-btn delete-btn"
                @click="deleteVisit(row.visitId)"
              >
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
          </CompoTable>
        </div>
      </main>

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
      <!-- نافذة الإضافة -->
      <compoAddDialog v-model="showDialogAdd" title="إضافة  زيارة أولية جديدة">
        <addNewVisit @saved="handleVisitAdded" />
      </compoAddDialog>
      <!-- نافذة التفاصيل -->
      <compoDialog v-model="showDialogDetails" title="تفاصيل الزيارة">
        <ViewDetailsVisitDialog
          :visit-id="selectedVisitId"
          @subVisitAdded="fetchVisits"
        />
      </compoDialog>
      
      <compoAddDialog v-model="showDialogPayment" title="إضافة دفعة">
        <addNewPayment
          :visit-id="selectedVisitId"
          :patient-id="selectedPatientId"
          @paymentAdded="fetchVisits"
        />
      </compoAddDialog>
    </div>
  </Dashboard>
</template>

<script setup>
import { ref, onMounted } from "vue";
import CompoTable from "../components/compoTable.vue";
import ViewDetailsVisitDialog from "../components/viewDetailsVisit.vue";
import { _get, _delete } from "../api/axois";
import compoDialog from "../components/compoDialog.vue";
import compoAddDialog from "../components/compoAddDialog.vue";
import addNewVisit from "../components/addNewVisit.vue";
import addNewPayment from "../components/addNewPayment.vue";
import Dashboard from "../components/dashboard.vue";
import InputSelect from "../components/InputSelect.vue";
import inputText from "../components/inputText.vue";
import inputDate from "../components/inputDate.vue";
// بيانات الجدول
const visites = ref([]);
const loading = ref(false);
const showDialogAdd = ref(false);
const showDialogDetails = ref(false);
const selectedVisitId = ref(null);

const showDialogPayment = ref(false);
const selectedPatientId = ref(null);

const isSearching = ref(false);
const filters = ref({
  type: "",
  status: "",
  fromDate: "",
  toDate: "",
});
const openAddPayment = (row) => {
  selectedVisitId.value = row.visitId;
  selectedPatientId.value = row.patientId;
  showDialogPayment.value = true;
};

// بيانات الصفحات
const pageNumber = ref(1);
const totalPages = ref(1);
const pageSize = ref(10);

// تعريف الأعمدة
const columns = [
  { key: "doctorName", label: "اسم الطبيب" },
  { key: "patientFullName", label: "اسم المريض" },
  { key: "visitDate", label: "تاريخ الزيارة" },
  { key: "totalCost", label: "التكلفة الإجمالية" },
  { key: "typeName", label: "نوع الزيارة" },
  { key: "statusName", label: "الحالة" },
];
// جلب البيانات من API
const fetchVisits = async () => {
  try {
    loading.value = true;
    const res = await _get(
      `/api/Visit?pageNumber=${pageNumber.value}&pageSize=${pageSize.value}`
    );

    // هنا ننسّق التاريخ قبل تخزينه في visites
    visites.value = res.data.data.map((v) => ({
      ...v,
      visitDate: formatDate(v.visitDate),
    }));

    pageNumber.value = res.data.pageNumber;
    totalPages.value = res.data.totalPages;
    pageSize.value = res.data.pageSize;
  } catch (error) {
    console.error("حدث خطأ أثناء جلب المستخدمين:", error);
  } finally {
    loading.value = false;
  }
};

const searchVisits = async () => {
  try {
    loading.value = true;
    pageNumber.value = 1;
    isSearching.value = true;

    const params = new URLSearchParams({
      pageNumber: pageNumber.value,
      pageSize: pageSize.value,
    });

    if (filters.value.type !== "") params.append("type", filters.value.type);
    if (filters.value.status !== "") params.append("status", filters.value.status);
    if (filters.value.fromDate) params.append("fromDate", filters.value.fromDate);
    if (filters.value.toDate) params.append("toDate", filters.value.toDate);

    const res = await _get(`/api/Visit/search?${params.toString()}`);

    visites.value = res.data.data.map((v) => ({
      ...v,
      visitDate: formatDate(v.visitDate),
    }));

    pageNumber.value = res.data.pageNumber;
    totalPages.value = res.data.totalPages;
    pageSize.value = res.data.pageSize;
  } catch (err) {
    console.error("خطأ البحث:", err);
  } finally {
    loading.value = false;
  }
};

// وظائف التنقل بين الصفحات
const prevPage = () => {
  if (pageNumber.value > 1) {
    pageNumber.value--;
    isSearching.value ? searchVisits() : fetchVisits();
  }
};

const nextPage = () => {
  if (pageNumber.value < totalPages.value) {
    pageNumber.value++;
    isSearching.value ? searchVisits() : fetchVisits();
  }
};


// تعديل الدالة اللي بتفتح التفاصيل
const viewDetailsVisit = (row) => {
  selectedVisitId.value = row.visitId; // افترض إن الـ id موجود في الـ row باسم visitId
  showDialogDetails.value = true;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1; // لأن الأشهر تبدأ من 0
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

// حذف زيارة فرعية
const deleteVisit = async (id) => {
  if (!confirm("هل أنت متأكد من حذف الزيارة ")) return;

  try {
    await _delete(`/api/Visit/${id}`);
    alert("تم حذف الزيارة  بنجاح");
    fetchVisits();
  } catch (err) {
    console.error(err);
    alert("حدث خطأ أثناء عملية الحذف");
  }
};
const handleVisitAdded = () => {
  showDialogAdd.value = false; // إغلاق الديالوج
  fetchVisits(); // إعادة تحميل الجدول
};

onMounted(() => {
  fetchVisits();
});
</script>

<style scoped>
/* الحاوية الرئيسية */
.visits-container {
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

.search-filters {
  background: white;
  padding: 16px;
  border-radius: 14px;
  margin: 16px auto;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  align-items: end;
}

.filter-item {
  display: flex;
  flex-direction: column;
}

.filter-actions {
  display: flex;
  align-items: flex-end;
}

.search-btn {
  background: var(--color-primary-700);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
}

/* موبايل */
@media (max-width: 900px) {
  .search-filters {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .search-filters {
    grid-template-columns: 1fr;
  }
}

/* المحتوى الرئيسي */
.main-content {
  margin: 0 auto;
  padding: 15px;
}
/* قسم الجدول */
.table-section {
  animation: fadeInUp 0.6s ease-out;
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

.action-btn .btn-icon {
  width: 14px;
  height: 14px;
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
  .action-btn {
    padding: 6px 10px;
    font-size: 12px;
    min-width: 70px;
  }
}

@media (max-width: 480px) {
  .title-section {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  .pagination-section {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
