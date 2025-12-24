<template>
  <div v-if="loading" class="text-center py-6">
    جاري تحميل الدفعات...
  </div>

  <div v-else-if="details">
    <div class="mb-4 space-y-1 text-sm">
      <p><strong>اسم المريض:</strong> {{ details.fullName }}</p>
      <p><strong>الهاتف:</strong> {{ details.phone }}</p>
      <p><strong>الإيميل:</strong> {{ details.email }}</p>
      <p class="text-indigo-700 font-bold">
        مجموع الدفعات: {{ details.totalPaid }}
      </p>
      <p class="text-green-700 font-bold">
        التكلفة الكلية: {{ details.totalCost }}
      </p>
      <p class="text-red-600 font-bold">
        المتبقي: {{ details.remainingCost }}
      </p>
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
