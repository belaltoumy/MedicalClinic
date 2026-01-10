<template>
  <div class="details-container" dir="rtl">
    <!-- Loading -->
    <div v-if="loading" class="loading text-center py-8">
      <p>جاري تحميل التفاصيل...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error text-red-600 text-center py-8">
      <p>{{ error }}</p>
    </div>

    <!-- Visit Details -->
    <div v-else-if="visit" class="space-y-6">
      <!-- معلومات الزيارة -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- اسم الطبيب -->
        <div class="info-box">
          <span class="label">اسم الطبيب</span>
          <span class="value">{{ visit.doctorName || "غير محدد" }}</span>
        </div>

        <!-- اسم المريض -->
        <div class="info-box">
          <span class="label">اسم المريض</span>
          <span class="value">{{ visit.patientFullName || "غير محدد" }}</span>
        </div>

        <!-- تاريخ الزيارة -->
        <div class="info-box">
          <span class="label">تاريخ الزيارة</span>
          <span class="value">{{ formatDate(visit.visitDate) }}</span>
        </div>

        <!-- التكلفة -->
        <div class="info-box">
          <span class="label">التكلفة الإجمالية</span>
          <span class="value">
            {{ visit.totalCost }}
          </span>
        </div>

        <!-- نوع الزيارة -->
        <div class="info-box">
          <span class="label">نوع الزيارة</span>
          <span class="value">{{ getTypeName(visit.type) }}</span>
        </div>

        <!-- الحالة -->
        <div class="info-box">
          <span class="label">حالة الزيارة</span>
          <span class="value" :class="visit.status === 0 ? 'pending' : 'done'">
            {{ getStatusName(visit.status) }}
          </span>
        </div>
      </div>

      <div class="mt-8 flex justify-center gap-4">
        <button @click="addSubVisit" class="add-subvisit-btn">
          <svg class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
          إضافة زيارة مراجعة
        </button>

        <button class="add-subvisit-btn" @click="showPaymentsDialog = true">
          تفاصيل الدفعات
        </button>
        <!-- <button class="add-subvisit-btn" @click="openUpdateProcedureDialog">
  اضافة اجراء للزيارة  
</button> -->
      </div>

      <compoDialog v-model="showPaymentsDialog" title="تفاصيل الدفعات">
        <PaymentDetails :patientId="visit.patientId" />
      </compoDialog>

      <compoDialog v-model="showAddProVisitDialog" title="تعديل الاجراء">
        <addProcedureVisit
          :visitId="visit.visitId"
          :visitItems="visit.visitItems"
          @saved="onProcedureAdded"
        />
      </compoDialog>

      <!-- عناصر الزيارة -->
      <div class="mt-12">
        <h3
          class="text-2xl font-bold mb-2 text-[var(--color-primary-700)] text-center"
        >
          عناصر الزيارة
        </h3>
        <div
          v-if="visit.visitItems?.length"
          class="overflow-x-auto rounded-lg shadow-lg border border-gray-200"
        >
          <table class="min-w-full bg-white">
            <thead class="bg-[var(--color-primary-700)] text-white">
              <tr>
                <th class="px-4 py-2 text-center">#</th>
                <th class="px-4 py-2 text-center">الإجراء الطبي</th>
                <th class="px-4 py-2 text-center">التكلفة</th>
                <th class="px-4 py-2 text-center">المواد المستهلكة</th>
                <th class="px-4 py-2 text-center">الكمية</th>
                <th class="px-4 py-2 text-center">الإجراءات</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="(item, index) in visit.visitItems"
                :key="item.visitItemId"
                class="hover:bg-gray-50"
              >
                <td class="px-4 py-2 text-center">{{ index + 1 }}</td>
                <td class="px-4 py-2">{{ item.procedureName }}</td>
                <td class="px-4 py-2">{{ item.cost }}</td>

                <!-- المواد المستهلكة -->
                <td class="px-4 py-2">
                  <div
                    v-for="mat in item.materialConsumptions"
                    :key="mat.consumptionId"
                  >
                    {{ mat.materialName }}
                  </div>
                </td>

                <!-- الكميات -->
                <td class="px-4 py-2 text-center">
                  <div
                    v-for="mat in item.materialConsumptions"
                    :key="mat.consumptionId"
                  >
                    {{ mat.quantity }}
                  </div>
                </td>
                <td class="px-4 py-2 text-center">
                  <button
                    class="action-btn edit-btn"
                    @click="openUpdateProcedureDialog"
                  >
                    تعديل عناصر الزيارة
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-else
          class="text-center py-12 text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg"
        >
          <p class="text-lg">لا توجد عناصر للعرض</p>
        </div>
      </div>

      <!-- الزيارات الفرعية -->
      <div class="mt-12">
        <h3
          class="text-2xl font-bold text-[var(--color-primary-700)] mb-4 text-center"
        >
          الزيارات الفرعية
        </h3>

        <div
          v-if="visit.subVisits?.length"
          class="overflow-x-auto rounded-lg shadow-lg border border-gray-200"
        >
          <table class="min-w-full bg-white visit-table">
            <thead class="visit-table-head">
              <tr>
                <th class="px-4 py-2 text-center">رقم الزيارة</th>
                <th class="px-4 py-2 text-center">اسم المريض</th>
                <th class="px-4 py-2 text-center">اسم الطبيب</th>
                <th class="px-4 py-2 text-center">تاريخ الزيارة</th>
                <th class="px-4 py-2 text-center">التكلفة</th>
                <th class="px-4 py-2 text-center">نوع الزيارة</th>
                <th class="px-4 py-2 text-center">الحالة</th>
                <th class="px-4 py-2 text-center">إجراءات</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 visit-table-body">
              <tr
                v-for="(sub, index) in visit.subVisits"
                :key="sub.visitId"
                class="hover:bg-gray-50 transition"
              >
                <td class="px-4 py-2 text-center">{{ index + 1 }}</td>
                <td class="px-4 py-2">{{ visit.patientFullName }}</td>
                <td class="px-4 py-2">{{ visit.doctorName }}</td>
                <td class="px-4 py-2">{{ formatDate(sub.visitDate) }}</td>
                <td class="px-4 py-2">{{ sub.totalCost }}</td>
                <td class="px-4 py-2">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-medium"
                    :class="
                      sub.type === 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    "
                  >
                    {{ getTypeName(sub.type) }}
                  </span>
                </td>

                <td class="px-4 py-2">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-medium"
                    :class="
                      sub.status === 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    "
                  >
                    {{ getStatusName(sub.status) }}
                  </span>
                </td>

                <td class="px-4 py-2 text-center">
                  <!-- <button
                    @click="openUpdateProcedureDialog"
                    class="text-blue-600 hover:text-blue-900 font-medium text-sm"
                  >
                    تعديل
                  </button> -->

                  <button
                    @click="deleteSubVisit(sub.visitId)"
                    class="text-red-600 hover:text-red-900 font-medium text-sm"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-else
          class="text-center py-12 text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg"
        >
          <p class="text-lg">لا توجد زيارات مراجعة بعد</p>
          <p class="text-sm mt-2">
            يمكنك إضافة زيارة مراجعة بالضغط على الزر أعلاه
          </p>
        </div>
      </div>
    </div>

    <!-- حالة عدم وجود زيارة -->
    <div v-else class="text-center py-8 text-gray-500">
      لا توجد بيانات لعرضها
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { _get, _post, _delete } from "../../api/axois";
import compoDialog from "../../components/compoDialog.vue";
import compoAddDialog from "../../components/compoAddDialog.vue";
import InputSelect from "../../components/InputSelect.vue";
import PaymentDetails from "../../components/DetailsPayment.vue";
import addProcedureVisit from "../../components/addProcedureVisit.vue";
import useToast from "../../toast/toast";
const { showToast } = useToast();

const showAddProVisitDialog = ref(false);
const showPaymentsDialog = ref(false);

const props = defineProps({
  visitId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["subVisitAdded"]); // لتحديث الجدول الخارجي

const visit = ref(null);
const loading = ref(false);
const error = ref(null);

const subVisitForm = ref({
  parentVisitId: "",
});
// جلب تفاصيل الزيارة
const fetchVisitDetails = async () => {
  if (!props.visitId) return;

  loading.value = true;
  try {
    const res = await _get(`/api/Visit/FullDetails/${props.visitId}`);
    visit.value = res.data;
    subVisitForm.value.parentVisitId = visit.value.visitId;
    console.log(subVisitForm.value);
  } catch (err) {
    error.value = "فشل تحميل تفاصيل الزيارة";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const onProcedureAdded = () => {
  showAddProVisitDialog.value = false;
  fetchVisitDetails(); // يرجّع العناصر الجديدة
};

const openUpdateProcedureDialog = () => {
  showAddProVisitDialog.value = true;
};

// إضافة زيارة فرعية
const addSubVisit = async () => {
  if (!visit.value?.visitId) return;

  try {
    await _post("/api/Visit/FollowUp", {
      parentVisitId: visit.value.visitId
    });

    showToast("تم إضافة زيارة المراجعة بنجاح", "success");
    emit("subVisitAdded");
    fetchVisitDetails();

  } catch (err) {
    console.error(err);
    showToast("حدث خطأ أثناء إضافة زيارة المراجعة", "error");
  }
};

// حذف زيارة فرعية
const deleteSubVisit = async (id) => {
  if (!confirm("هل أنت متأكد من حذف زيارة المراجعة؟")) return;

  try {
    await _delete(`/api/Visit/${id}`);
    showToast("تم حذف الزيارة الفرعية بنجاح", "success");
    fetchVisitDetails();
  } catch (err) {
    showToast("حدث خطأ أثناء عملية الحذف", "error");
  }
};

// تحديث عند تغيير visitId
watch(() => props.visitId, fetchVisitDetails, { immediate: true });
onMounted(() => {
  if (props.visitId) fetchVisitDetails();
});

const getTypeName = (type) =>
  ({ 0: "زيارة أولية", 1: "مراجعة" }[type] || "غير معروف");
const getStatusName = (status) =>
  ({ 0: "قيد الانتظار" }[status] || "غير معروف");

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};
</script>

<style scoped>
.details-container {
  padding: 15px;
  font-family: var(--font-primary);
}
.info-box {
  background: var(--color-white);
  border-radius: 14px;
  padding: 18px;
  border: 1px solid var(--color-gray-100);
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Label */
.label {
  font-size: 13px;
  font-weight: bold;
  color: var(--color-gray-500);
  font-family: var(--font-secondary);
}

/* Value */
.value {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary-700);
}
.status-pill {
  width: fit-content;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-secondary);
}

/* أزرار الإجراءات */
.action-btn {
  border: none;
  border-radius: 8px;
  padding: 6px 6px;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 70px;
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
/* Pending */
.status-pill.pending {
  background: rgba(56, 189, 248, 0.18);
  color: var(--color-secondary-500);
}

/* Done */
.status-pill.done {
  background: rgba(184, 165, 122, 0.25);
  color: var(--color-accent-500);
}

.add-subvisit-btn {
  background: linear-gradient(
    135deg,
    var(--color-primary-700),
    var(--color-primary-500)
  );
  color: var(--color-white);
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 6px 20px rgba(30, 41, 59, 0.35);
  transition: all 0.25s ease;
}

.add-subvisit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(30, 41, 59, 0.45);
}

/* Icons */
.btn-icon {
  width: 20px;
  height: 20px;
}

/* Cancel */
.cancel-btn {
  background: var(--color-gray-100);
  color: var(--color-primary-700);
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}
.visit-table-head {
  background: linear-gradient(
    135deg,
    var(--color-primary-700),
    var(--color-primary-500)
  );
  color: var(--color-white);
}

.visit-table-head th {
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.3px;
}

/* Table Body */
.visit-table-body tr {
  transition: background 0.25s ease;
}

.visit-table-body tr:hover {
  background: rgba(184, 165, 122, 0.08); /* accent خفيف */
}

.visit-table-body td {
  color: var(--color-primary-700);
  font-size: 14px;
}

/* Borders */
.visit-table {
  border-color: var(--color-gray-100);
}

/* Cost highlight */
.visit-cost {
  font-weight: 600;
  color: var(--color-accent-500);
}
</style>
