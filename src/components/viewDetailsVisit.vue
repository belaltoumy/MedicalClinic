<!-- src/components/viewDetailsVisit.vue -->
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
      <div
        class="mt-2 overflow-x-auto rounded-lg shadow-lg border border-gray-200"
      >
        <table class="min-w-full bg-white">
          <tbody class="divide-y divide-gray-200 bg-gray-200">
            <tr>
              <td class="px-6 py-4 font-semibold text-center">اسم الطبيب</td>
              <td class="px-6 py-4 text-center">
                {{ visit.doctorName || "غير محدد" }}
              </td>
            </tr>

            <tr>
              <td class="px-6 py-4 font-semibold text-center">اسم المريض</td>
              <td class="px-6 py-4 text-center">
                {{ visit.patientFullName || "غير محدد" }}
              </td>
            </tr>

            <tr>
              <td class="px-6 py-4 font-semibold text-center">تاريخ الزيارة</td>
              <td class="px-6 py-4 text-center">
                {{ formatDate(visit.visitDate) }}
              </td>
            </tr>

            <tr>
              <td class="px-6 py-4 font-semibold text-center">
                التكلفة الإجمالية
              </td>
              <td class="px-6 py-4 text-center font-bold text-indigo-700">
                {{ visit.totalCost }}
              </td>
            </tr>

            <tr>
              <td class="px-6 py-4 font-semibold text-center">نوع الزيارة</td>
              <td class="px-6 py-4 text-center">
                {{ getTypeName(visit.type) }}
              </td>
            </tr>

            <tr>
              <td class="px-6 py-4 font-semibold text-center">حالة الزيارة</td>
              <td class="px-6 py-4 text-center">
                {{ getStatusName(visit.status) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-8 flex justify-center gap-4">
        <button @click="openAddSubVisitDialog" class="add-subvisit-btn">
          <svg class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
          إضافة زيارة مراجعة (فرعية)
        </button>

        <button class="add-subvisit-btn" @click="showPaymentsDialog = true">
          تفاصيل الدفعات
        </button>
      </div>

      <!-- Dialog إضافة زيارة فرعية -->
      <compoDialog v-model="showSubVisitDialog" title="إضافة زيارة مراجعة">
        <div class="space-y-5">
          <div class="text-sm text-gray-600">
            <strong>الزيارة الأصلية:</strong> #{{ visit?.visitId }}
          </div>

          <label>اختر الطبيب</label>
          <InputSelect
            v-model="subVisitForm.doctorId"
            label="اختر الطبيب"
            required
          >
            <option
              v-for="doc in doctors"
              :key="doc.doctorId"
              :value="doc.doctorId"
            >
              {{ doc.fullName }}
            </option>
          </InputSelect>

          <div class="flex gap-3 justify-end mt-6">
            <button
              @click="addSubVisit"
              class="add-btn"
              :disabled="!subVisitForm.doctorId"
            >
              حفظ زيارة المراجعة
            </button>

            <button @click="showSubVisitDialog = false" class="cancel-btn">
              إلغاء
            </button>
          </div>
        </div>
      </compoDialog>
      <compoDialog v-model="showPaymentsDialog" title="تفاصيل الدفعات">
        <PaymentDetails :patientId="visit.patientId" />

      </compoDialog>

      <!-- عناصر الزيارة -->
      <div class="mt-12">
        <h3 class="text-2xl font-bold mb-6 text-indigo-700 text-right">
          عناصر الزيارة
        </h3>

        <div
          v-if="visit.visitItems?.length"
          class="overflow-x-auto rounded-lg shadow-lg border border-gray-200"
        >
          <table class="min-w-full bg-white">
            <thead
              class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            >
              <tr>
                <th class="px-6 py-4 text-center">#</th>
                <th class="px-6 py-4 text-center">الإجراء الطبي</th>
                <th class="px-6 py-4 text-center">التكلفة</th>
                <th class="px-6 py-4 text-center">المواد المستهلكة</th>
                <th class="px-6 py-4 text-center">الكمية</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="(item, index) in visit.visitItems"
                :key="item.visitItemId"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 text-center">{{ index + 1 }}</td>
                <td class="px-6 py-4">{{ item.procedureName }}</td>
                <td class="px-6 py-4">{{ item.cost }}</td>

                <!-- المواد المستهلكة -->
                <td class="px-6 py-4">
                  <div
                    v-for="mat in item.materialConsumptions"
                    :key="mat.consumptionId"
                  >
                    {{ mat.materialName }}
                  </div>
                </td>

                <!-- الكميات -->
                <td class="px-6 py-4 text-center">
                  <div
                    v-for="mat in item.materialConsumptions"
                    :key="mat.consumptionId"
                  >
                    {{ mat.quantity }}
                  </div>
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
        <h3 class="text-2xl font-bold text-right mb-6 text-indigo-700">
          الزيارات الفرعية
        </h3>

        <div
          v-if="visit.subVisits?.length"
          class="overflow-x-auto rounded-lg shadow-lg border border-gray-200"
        >
          <table class="min-w-full bg-white">
            <thead
              class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            >
              <tr>
                <th class="px-6 py-4 text-center">رقم الزيارة</th>
                <th class="px-6 py-4 text-center">اسم المريض</th>
                <th class="px-6 py-4 text-center">اسم الطبيب</th>
                <th class="px-6 py-4 text-center">تاريخ الزيارة</th>
                <th class="px-6 py-4 text-center">التكلفة</th>
                <th class="px-6 py-4 text-center">نوع الزيارة</th>
                <th class="px-6 py-4 text-center">الحالة</th>
                <th class="px-6 py-4 text-center">إجراءات</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="(sub, index) in visit.subVisits"
                :key="sub.visitId"
                class="hover:bg-gray-50 transition"
              >
                <td class="px-6 py-4 text-center">{{ index + 1 }}</td>
                <td class="px-6 py-4">{{ sub.patientFullName }}</td>
                <td class="px-6 py-4">{{ sub.doctorName }}</td>
                <td class="px-6 py-4">{{ formatDate(sub.visitDate) }}</td>
                <td class="px-6 py-4">{{ sub.totalCost }}</td>

                <td class="px-6 py-4">
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

                <td class="px-6 py-4">
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

                <td class="px-6 py-4 text-center">
                  <button
                    @click="openSubVisitDetails(sub.visitId)"
                    class="text-blue-600 hover:text-blue-900 font-medium text-sm"
                  >
                    تعديل
                  </button>

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
import { _get, _post, _delete } from "../api/axois";
import compoDialog from "./compoDialog.vue";
import InputSelect from "./InputSelect.vue";
import PaymentDetails from "./viewDetailsPayment.vue";


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
const showSubVisitDialog = ref(false);

const doctors = ref([]);
const subVisitForm = ref({
  parentVisitId: "",
  doctorId: "",
});

// جلب تفاصيل الزيارة
const fetchVisitDetails = async () => {
  if (!props.visitId) return;

  loading.value = true;
  try {
    const res = await _get(`/api/Visit/FullDetails/${props.visitId}`);
    visit.value = res.data;
    subVisitForm.value.parentVisitId = visit.value.visitId; // مهم جدًا
  } catch (err) {
    error.value = "فشل تحميل تفاصيل الزيارة";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// جلب قائمة الأطباء
const fetchDoctors = async () => {
  try {
    const res = await _get("/api/Doctors", { params: { all: true } });
    doctors.value = res.data.data;
  } catch (err) {
    console.error("فشل جلب الأطباء", err);
  }
};

// فتح الديالوغ
const openAddSubVisitDialog = () => {
  subVisitForm.value.parentVisitId = visit.value.visitId;
  subVisitForm.value.doctorId = "";
  showSubVisitDialog.value = true;
};

// إضافة زيارة فرعية
const addSubVisit = async () => {
  if (!subVisitForm.value.doctorId) {
    alert("يرجى اختيار الطبيب");
    return;
  }
  try {
    await _post("/api/Visit/FollowUp", {
      parentVisitId: subVisitForm.value.parentVisitId,
      doctorId: subVisitForm.value.doctorId,
    });

    showSubVisitDialog.value = false;
    alert("تم إضافة زيارة المراجعة بنجاح");
    // إرسال إشارة للكومبوننت الأب لتحديث الجدول
    emit("subVisitAdded");
    fetchVisitDetails();
  } catch (err) {
    console.error(err);
    alert("حدث خطأ أثناء إضافة زيارة المراجعة");
  }
};

// حذف زيارة فرعية
const deleteSubVisit = async (id) => {
  if (!confirm("هل أنت متأكد من حذف زيارة المراجعة؟")) return;

  try {
    await _delete(`/api/Visit/${id}`);
    alert("تم حذف الزيارة الفرعية بنجاح");
    fetchVisitDetails();
  } catch (err) {
    console.error(err);
    alert("حدث خطأ أثناء عملية الحذف");
  }
};


// تحديث عند تغيير visitId
watch(() => props.visitId, fetchVisitDetails, { immediate: true });
onMounted(() => {
  fetchDoctors();
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
  padding: 24px;
  font-family: "Segoe UI", Tahoma, sans-serif;
}

.info-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.label {
  display: block;
  font-size: 14px;
  color: #64748b;
  margin-bottom: 6px;
}
.value {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.add-subvisit-btn {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
  transition: all 0.3s;
}

.add-subvisit-btn:hover {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.5);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.cancel-btn {
  background: #e2e8f0;
  color: #475569;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}
</style>
