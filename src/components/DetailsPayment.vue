<template>
  <div v-if="loading" class="text-center py-6">
    جاري تحميل الدفعات...
  </div>

  <div v-else-if="details">
    <!-- معلومات المريض -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  <div class="bg-gray-50 border rounded-lg p-4">
    <p class="text-xs text-gray-500 mb-1">اسم المريض</p>
    <p class="font-semibold text-gray-800">{{ details.fullName }}</p>
  </div>

  <div class="bg-gray-50 border rounded-lg p-4">
    <p class="text-xs text-gray-500 mb-1">رقم الهاتف</p>
    <p class="font-semibold text-gray-800">{{ details.phone || "—" }}</p>
  </div>

  <div class="bg-gray-50 border rounded-lg p-4 md:col-span-2">
    <p class="text-xs text-gray-500 mb-1">البريد الإلكتروني</p>
    <p class="font-semibold text-gray-800">
      {{ details.email || "—" }}
    </p>
  </div>
</div>

<!-- الملخص المالي -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
    <p class="text-sm text-indigo-600">مجموع الدفعات</p>
    <p class="text-xl font-bold text-indigo-700">
      {{ details.totalPaid }}
    </p>
  </div>

  <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
    <p class="text-sm text-green-600">التكلفة الكلية</p>
    <p class="text-xl font-bold text-green-700">
      {{ details.totalCost }}
    </p>
  </div>

  <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
    <p class="text-sm text-red-600">المتبقي</p>
    <p class="text-xl font-bold text-red-700">
      {{ details.remainingCost }}
    </p>
  </div>
</div>

    <table class="min-w-full border mt-4">
      <thead class="bg-gray-200">
        <tr>
          <th class="p-2">#</th>
          <th class="p-2">المبلغ</th>
          <th class="p-2">التاريخ</th>
          <th class="p-2">النوع</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(p, i) in details.payments"
          :key="p.paymentId"
          class="border-t"
        >
          <td class="p-2 text-center">{{ i + 1 }}</td>
          <td class="p-2 text-center">{{ p.amount }}</td>
          <td class="p-2 text-center">
            {{ formatDate(p.paymentDate) }}
          </td>
          <td class="p-2 text-center">{{ p.type }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { _get } from "../api/axois";

const props = defineProps({
  patientId: {
    type: String,
    required: true,
  },
});

const loading = ref(false);
const details = ref(null);

const fetchDetails = async () => {
  loading.value = true;
  try {
    const res = await _get(
      `/api/Payments/Patient/Details/${props.patientId}`
    );
    details.value = res.data;
  } catch (err) {
    console.error("فشل جلب تفاصيل الدفعات", err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDetails);

const formatDate = (d) => {
  const date = new Date(d);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};
</script>
