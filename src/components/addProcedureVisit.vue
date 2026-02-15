<template>
  <div class="space-y-6">
    <!-- عناصر الزيارة -->
    <div
      v-for="(item, i) in items"
      :key="item.visitItemId ?? i"
      class="border p-4 rounded-lg space-y-4 relative"
    >
      <!-- الإجراء -->
      <InputSelect v-model="item.procedureId" label="الإجراء">
        <option
          v-for="p in procedures"
          :key="p.procedureId"
          :value="p.procedureId"
        >
          {{ p.name }}
        </option>
      </InputSelect>

      <!-- التكلفة -->
      <inputNumber label="التكلفة" v-model="item.cost" />

      <!-- المواد -->
      <div
        v-for="(m, mi) in item.materialConsumptions"
        :key="m.consumptionId ?? mi"
        class="grid grid-cols-2 gap-3 items-end"
      >
        <InputSelect v-model="m.materialId" label="المادة">
          <option
            v-for="mat in materials"
            :key="mat.materialId"
            :value="mat.materialId"
          >
            {{ mat.name }}
          </option>
        </InputSelect>

        <div class="flex gap-2">
          <inputNumber label="الكمية" v-model="m.quantity" />

          <button
            type="button"
            class="text-red-500 text-sm"
            @click="removeMaterial(item, mi)"
          >
            حذف
          </button>
        </div>
      </div>

      <button
        type="button"
        class="text-sm text-primary-600 hover:underline"
        @click="addMaterial(item)"
      >
        + إضافة مادة أخرى
      </button>
    </div>

    <!-- حفظ -->
    <div class="flex justify-end">
      <button class="add-subvisit-btn" @click="save">حفظ التعديلات</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { _get, _put, _delete } from "../api/axois";
import InputSelect from "./InputSelect.vue";
import inputNumber from "./inputNumber.vue";
import useToast from "../toast/toast";

const { showToast } = useToast();

const props = defineProps({
  visitId: { type: String, required: true },
  visitItems: { type: Array, required: true },
  mode: { type: String, default: "edit" },
});

const emit = defineEmits(["saved"]);

const procedures = ref([]);
const materials = ref([]);
const items = ref([]);

const fetchProcedures = async () => {
  const res = await _get("/api/Procedures", { params: { all: true } });
  procedures.value = res.data.data;
};

const fetchMaterials = async () => {
  const res = await _get("/api/Materials", { params: { all: true } });
  materials.value = res.data.data;
};

const addMaterial = (item) => {
  item.materialConsumptions.push({
    consumptionId: null,
    materialId: null,
    quantity: 1,
  });
};

const removeMaterial = async (item, index) => {
  const material = item.materialConsumptions[index];

  // مادة جديدة
  if (!material.consumptionId) {
    item.materialConsumptions.splice(index, 1);
    return;
  }

  // مادة محفوظة بالسيرفر
  try {
    await _delete(`/api/Visit/Material/${material.consumptionId}`);
    item.materialConsumptions.splice(index, 1);
    showToast("تم حذف المادة بنجاح", "success");
  } catch (err) {
    console.error(err);
    showToast("فشل حذف المادة", "error");
  }
};

watch(
  () => [props.visitItems, props.mode],
  ([val, mode]) => {
    if (mode === "add") {
      // 👇 افتح فاضي
      items.value = [
        {
          visitItemId: null,
          procedureId: null,
          cost: 0,
          materialConsumptions: [],
        },
      ];
      return;
    }

    // 👇 وضع التعديل
    if (!val) return;

    items.value = val.map((item) => ({
      visitItemId: item.visitItemId,
      procedureId: item.procedureId,
      cost: item.cost,
      materialConsumptions:
        item.materialConsumptions?.map((m) => ({
          consumptionId: m.consumptionId,
          materialId: m.materialId,
          quantity: m.quantity,
        })) || [],
    }));
  },
  { immediate: true },
);

const save = async () => {
  try {
    const payload = {
      visitId: props.visitId,
      visitItems: items.value,
    };

    await _put(`/api/Visit/${props.visitId}`, payload);

    emit("saved");
    showToast("تم حفظ عناصر الزيارة بنجاح", "success");
  } catch (err) {
    console.error(err);
    showToast("فشل حفظ عناصر الزيارة", "error");
  }
};

onMounted(() => {
  fetchProcedures();
  fetchMaterials();
});
</script>

<style scoped>
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
</style>
