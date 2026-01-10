<template>
  <div class="add-visit-form">
    <div class="form-grid">
      <InputSelect v-model="formVisit.doctorId" label="اسم الطبيب">
        <option
          v-for="doc in doctors"
          :key="doc.doctorId"
          :value="doc.doctorId"
        >
          {{ doc.fullName }}
        </option>
      </InputSelect>

      <InputSelect v-model="formVisit.patientId" label="اسم المريض">
        <option
          v-for="p in patients"
          :key="p.patientId"
          :value="p.patientId"
        >
          {{ p.firstName }} {{ p.lastName }}
        </option>
      </InputSelect>

      <InputSelect v-model="formVisit.status" label="الحالة">
        <option value="0">زيارة أولية</option>
        <option value="1">مراجعة</option>
      </InputSelect>
    </div>

    <!-- زر الحفظ -->
    <div class="form-actions">
      <button class="save-btn" @click="addVisit">
        حفظ الزيارة
      </button>
    </div>
  </div>
</template>



<script setup>
import { ref, onMounted } from "vue";
import { _get, _post } from "../api/axois";
import InputSelect from "./InputSelect.vue";
import useToast from "../toast/toast";
const { showToast } = useToast();
const emit = defineEmits(["saved"]);

const doctors = ref([]);
const patients = ref([]);

const formVisit = ref({
  patientId: "",
  doctorId: "",
  status: "",
  visitParentId: null,
});

// جلب المرضى
const fetchPatients = async () => {
  const res = await _get("/api/Patients");
  patients.value = res.data.data;
};

// جلب الأطباء
const fetchDoctors = async () => {
  const res = await _get("/api/Doctors", {
    params: { all: true },
  });
  doctors.value = res.data.data;
};

// إضافة زيارة
const addVisit = async () => {
  if (
    !formVisit.value.patientId ||
    !formVisit.value.doctorId ||
    formVisit.value.status === ""
  ) {
    showToast("الرجاء تعبئة جميع الحقول", "error");
    return;
  }

  await _post("/api/Visit", {
    patientId: formVisit.value.patientId,
    doctorId: formVisit.value.doctorId,
    status: Number(formVisit.value.status),
    visitParentId: null,
  });

emit("saved");

formVisit.value = {
  patientId: "",
  doctorId: "",
  status: "",
  visitParentId: null,
};
  showToast("تمت إضافة الزيارة بنجاح", "success");
};

onMounted(() => {
  fetchDoctors();
  fetchPatients();
});

</script>

<style scoped>
.add-visit-form {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
  background: var(--color-white);
  border-radius: 16px;
  border-top: 4px solid var(--color-primary-700);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  font-family: var(--font-primary);
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-actions {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

.save-btn {
  color: white;
  background: var(--color-primary-700);
  border: none;
  border-radius: 14px;
  padding: 14px 34px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 190px;
  justify-content: center;
  box-shadow: 0 8px 22px rgba(184, 165, 122, 0.35);
}

.save-btn:hover {
  background: var(--color-primary-900);
  transform: translateY(-2px);
}

.save-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .add-visit-form {
    padding: 16px;
  }

  .save-btn {
    padding: 12px 24px;
    font-size: 14px;
    min-width: 160px;
  }

  .form-actions {
    margin-top: 24px;
  }
}


</style>