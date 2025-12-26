<template>
  <Dashboard>
    <div class="users-container" dir="rtl">
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
              <h1 class="page-title">إدارة المستخدمين</h1>
              
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
            إضافة مستخدم جديد
          </button>
        </div>
      </header>

      <!-- المحتوى الرئيسي -->
      <main class="main-content">
        <!-- الجدول -->
        <div class="table-section">
          <CompoTable
            :columns="columns"
            :rows="filteredUsers"
            :loading="loading"
            show-actions
          >
            <template #actions="{ row }">
            
              <button class="action-btn delete-btn" @click="deleteUser(row)">
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

      <!-- نافذة الإضافة -->
      <compoDialog v-model="showDialogAdd" title="إضافة مستخدم جديد">
        <AddNewUser @saved="handleUserAdded" />
      </compoDialog>
    </div>
  </Dashboard>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import CompoTable from "../../components/compoTable.vue";
import AddNewUser from "../Users/addNewUser.vue";
import { _get, _delete } from "../../api/axois";
import compoDialog from "../../components/compoDialog.vue";
import Dashboard from "../../components/dashboard.vue";
import useToast from "../../toast/toast.js";

const { showToast } = useToast();
// بيانات الجدول
const users = ref([]);
const loading = ref(false);
const showDialogAdd = ref(false);

// الفلترة
const filters = ref({
  userName: [],
  email: [],
  firstName: [],
  lastName: [],
});
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    return Object.keys(filters).every(key => {
      if (!filters[key].length) return true; // إذا لا يوجد اختيار، لا نفلتر
      return filters[key].includes(user[key]);
    });
  });
});

// تعريف الأعمدة
const columns = [
  { key: "userName", label: "اسم المستخدم" },
  { key: "email", label: "البريد الإلكتروني" },
  { key: "firstName", label: "الاسم الأول" },
  { key: "lastName", label: "الكنية" },
];

// جلب البيانات من API
const fetchUsers = async () => {
  try {
    loading.value = true;
    const res = await _get("/api/Auth/getAllUsers");
    users.value = res.data;
  } catch (error) {
    console.error("حدث خطأ أثناء جلب المستخدمين:", error);
  } finally {
    loading.value = false;
  }
};

const deleteUser = async (user) => {
  const confirmed = confirm(`هل أنت متأكد من حذف ${user.userName}؟`);
  if (!confirmed) return;

  try {
    const res = await _delete(`/api/Auth/Id?Id=${user.id}`);

    if (res.status === 200 || res.status === 204) {
      showToast("تم حذف المستخدم بنجاح", "success");
      fetchUsers(); // تحديث الجدول بعد الحذف
    } else {
      showToast("فشل حذف المستخدم", "error");
    }
  } catch (error) {
    showToast("فشل حذف المستخدم", "error");
  }
};

function handleUserAdded() {
  showDialogAdd.value = false;
  fetchUsers(); // لتحديث الجدول بعد الإضافة
}
onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
/* الحاوية الرئيسية */
.users-container {
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

.page-subtitle {
  font-size: 14px;
  color: var(--color-gray-500);
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

}
</style>
