<template>
  <div class="doctors-container" dir="rtl">
    <!-- الهيدر -->
    <header class="page-header">
      <div class="header-content">
        <div class="title-section">
          <div class="title-icon">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="title-text">
            <h1 class="page-title">إدارة الإجراءات</h1>
            <p class="page-subtitle">إضافة وتعديل وحذف الإجراءات </p>
          </div>
        </div>
        
        <button
          @click="showDialogAdd = true"
          class="add-btn"
        >
          <svg class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
          </svg>
          إضافة إجراء جديد
        </button>
      </div>
    </header>

    <!-- المحتوى الرئيسي -->
    <main class="main-content">
   

      <!-- الجدول -->
      <div class="table-section">
        <compoTable
          :columns="columns"
          :rows="Procedures"
          :loading="loading"
          :showActions="true"
        >
          <template #actions="{ row }">
          
            <button
              class="action-btn edit-btn"
              @click="editPatient(row)"
            >
              <svg class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
              </svg>
              تعديل
            </button>
            <button
              class="action-btn delete-btn"
              @click="deleteProcedure(row)"
            >
              <svg class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clip-rule="evenodd"></path>
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
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
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
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
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </main>

    <!-- نافذة الإضافة -->
    <compoDialog v-model="showDialogAdd" title="إضافة اجراء جديد">
        <AddNewProcedure @saved="handleProcedureAdded" />
    </compoDialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import compoTable from '../components/compoTable.vue';
import compoDialog from '../components/compoDialog.vue';
import AddNewProcedure from '../components/addNewProcedure.vue';
import { _get ,_delete } from '../api/axois';

const Procedures = ref([]);
const loading = ref(false);

const pageNumber = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);
const showDialogAdd = ref(false);

const columns = [
  { key: 'name', label: 'اسم الاجراء' },
  { key: 'defaultCost', label: 'التكلفة الافتراضية' },
 
];

// دالة جلب الاجراءات
const fetchProcedures = async () => {
  loading.value = true;
  try {
    const res = await _get('/api/Procedures', {
      params: {
        pageNumber: pageNumber.value,
        pageSize: pageSize.value
      }
    });

    Procedures.value = res.data.data;   // صح
    totalPages.value = res.data.totalPages;
  } 
  catch (error) {
    console.error(error);
  } 
  finally {
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

// const editPatient = (patient) => {
//   console.log('تعديل:', patient);
//   // هنا تفتح Dialog أو صفحة تعديل
// };


const deleteProcedure = async (procedure) => {
  const confirmed = confirm(`هل أنت متأكد من حذف ${procedure.procedureName}؟`);
  if (!confirmed) return;

  try {
        const res = await _delete(`/api/Procedures/${procedure.procedureId}`);
    if (res.status === 200 || res.status === 204) {
      alert("تم حذف الاجراء بنجاح ✅");
      fetchProcedures();
    } else {
      console.error("خطأ من السيرفر:", res.data);
      alert(`فشل حذف الاجراء ❌\n${res.data?.message || 'حدث خطأ غير معروف'}`);
    }
  } catch (error) {
    console.error("حدث خطأ أثناء الحذف:", error);
    alert("فشل حذف الاجراء ❌");
  }
};

function handleProcedureAdded() {
  showDialogAdd.value = false;
  fetchProcedures(); // لتحديث الجدول بعد الإضافة
}

onMounted(() => {
  fetchProcedures();
});
</script>

<style scoped>
/* الحاوية الرئيسية */
.doctors-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* هيدر الصفحة */
.page-header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-bottom: 3px solid #8b5cf6;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
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
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.title-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #8b5cf6;
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* زر الإضافة */
.add-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
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
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.add-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

/* المحتوى الرئيسي */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

/* صف الإحصائيات */
.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 300px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.doctors-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.stat-icon svg {
  width: 28px;
  height: 28px;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
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
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.view-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.edit-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.edit-btn:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e3a8a);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
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
