<template>
  <div class="add-user-form">
    <div class="form-grid">
      <div class="form-row">
        <inputText label="الاسم الأول" v-model="newUser.firstName" />
        <inputText label="الكنية" v-model="newUser.lastName" />
      </div>      
      <inputText label="البريد الإلكتروني" v-model="newUser.email" />
      <inputText label="اسم المستخدم" v-model="newUser.userName" />
      <inputText label="كلمة المرور" v-model="newUser.password" type="password" />
    </div>

    <!-- زر الحفظ -->
    <div class="form-actions">
      <button
        @click="addNewUser"
        class="save-btn"
        :disabled="isLoading"
      >
        <svg v-if="isLoading" class="loading-icon" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
          <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isLoading ? 'جاري الحفظ...' : 'حفظ المستخدم' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import inputText from "../../components/inputText.vue";
import { ref } from "vue";
import { _post } from "../../api/axois";
import useToast from "../../toast/toast.js";

const { showToast } = useToast();
const emit = defineEmits(["saved"]);

const isLoading = ref(false);

const newUser = ref({
  email: "",
  firstName: "",
  lastName: "",
  userName: "",
  password: "",
});

// ✅ دالة الإضافة
const addNewUser = async () => {
  // التحقق من أن جميع الحقول ممتلئة
  if (
    !newUser.value.email ||
    !newUser.value.firstName ||
    !newUser.value.lastName ||
    !newUser.value.userName ||
    !newUser.value.password
  ) {
    showToast("الرجاء تعبئة جميع الحقول", "error");
    return;
  }

  try {
    isLoading.value = true;
    const payload = {
      username: newUser.value.userName,
      email: newUser.value.email,
      firstName: newUser.value.firstName,
      lastName: newUser.value.lastName,
      password: newUser.value.password,
    };

    const res = await _post("/api/Auth/register", payload);
    console.log("تمت الإضافة:", res.data);

    showToast("تمت إضافة المستخدم بنجاح", "success");
    
    // إعادة تعيين النموذج
    newUser.value = {
      email: "",
      firstName: "",
      lastName: "",
      userName: "",
      password: "",
    };
    
    emit("saved"); // لإخبار الصفحة الأب بأن الإضافة تمت
  } catch (error) {
    showToast("حدث خطأ أثناء إضافة المستخدم", "error");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* حاوية النموذج */
.add-user-form {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
  background: var(--color-white);
  border-radius: 16px;
  border-top: 4px solid var(--color-primary-700);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  font-family: var(--font-primary);
}

/* شبكة النموذج */
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* صف مزدوج */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* الإجراءات */
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
/* Disabled */
.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
.save-icon,
.loading-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary-900);
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .add-user-form {
    padding: 16px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
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

/* Active click */
.save-btn:active {
  transform: translateY(0);
}

</style>
