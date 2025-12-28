<template>
  <div class="space-y-6">

    <div
      v-for="(item, i) in items"
      :key="item.visitItemId"
      class="border p-4 rounded-lg space-y-4"
    >
      <!-- الإجراء -->
      <InputSelect v-model="item.procedureId" label="الإجراء">
        <option v-for="p in procedures" :key="p.id" :value="p.id">
          {{ p.name }}
        </option>
      </InputSelect>

      <!-- التكلفة -->
      <inputNumber label="التكلفة" v-model="item.cost" />

      <!-- المواد -->
      <div
        v-for="m in item.materialConsumptions"
        :key="m.consumptionId"
        class="grid grid-cols-2 gap-3"
      >
        <InputSelect v-model="m.materialId" label="المادة">
          <option v-for="mat in materials" :key="mat.id" :value="mat.id">
            {{ mat.name }}
          </option>
        </InputSelect>

        <inputNumber label="الكمية" v-model="m.quantity" />
      </div>
    </div>

    <div class="flex justify-end">
      <button class="add-subvisit-btn" @click="save">حفظ التعديلات</button>
    </div>

  </div>
</template>




<script setup>
import { ref, watch, onMounted } from "vue";
import { _get, _put } from "../api/axois";
import InputSelect from "./InputSelect.vue";
import inputNumber from "./inputNumber.vue";

const props = defineProps({
  visitId: { type: String, required: true },
  visitItems: { type: Array, required: true }
});

const emit = defineEmits(["saved"]);

const procedures = ref([]);
const materials = ref([]);

/**
 * نسخة قابلة للتعديل فقط
 * بدون إضافة عناصر جديدة
 */
const items = ref([]);

/* جلب البيانات */
const fetchProcedures = async () => {
  const res = await _get("/api/Procedures", { params: { all: true } });
  procedures.value = res.data.data;
};

const fetchMaterials = async () => {
  const res = await _get("/api/Materials", { params: { all: true } });
  materials.value = res.data.data;
};

/* نسخ العناصر القادمة من الأب */
watch(
  () => props.visitItems,
  (val) => {
    items.value = val.map(item => ({
      visitItemId: item.visitItemId,       // ❗ موجود
      procedureId: item.procedureId,
      cost: item.cost,
      materialConsumptions: item.materialConsumptions.map(m => ({
        consumptionId: m.consumptionId,   // ❗ موجود
        materialId: m.materialId,
        quantity: m.quantity
      }))
    }));
  },
  { immediate: true }
);

/* حفظ التعديلات فقط */
const save = async () => {
  try {
    const payload = {
      visitId: props.visitId,
      visitItems: items.value // ❗ نفس العناصر مع نفس IDs
    };

    await _put(`/api/Visit/${props.visitId}`, payload);
    emit("saved");

  } catch (err) {
    console.error(err);
    alert("فشل تعديل عناصر الزيارة");
  }
};

onMounted(() => {
  fetchProcedures();
  fetchMaterials();
});
</script>






<style scoped>
.field-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--color-gray-600);
}

.input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--color-gray-200);
  font-size: 14px;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
}

.add-subvisit-btn {
  background: linear-gradient(
    135deg,
    var(--color-primary-700),
    var(--color-primary-500)
  );
  color: var(--color-white);
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
}

.cancel-btn {
  background: var(--color-gray-100);
  color: var(--color-primary-700);
  padding: 10px 20px;
  border-radius: 8px;
}
</style>
