<template>
  <div
    class="login-container"
    dir="rtl"
  >
    <div
      class="login-card"
    >
      <div class="header-section">
        <!-- أيقونة الأسنان -->
        <div class="icon-container">
          <svg class="tooth-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C9.79 2 8 3.79 8 6v4c0 1.1.9 2 2 2s2-.9 2-2V6c0-.55.45-1 1-1s1 .45 1 1v4c0 1.1.9 2 2 2s2-.9 2-2V6c0-2.21-1.79-4-4-4zm0 18c2.21 0 4-1.79 4-4v-4c0-1.1-.9-2-2-2s-2 .9-2 2v4c0 .55-.45 1-1 1s-1-.45-1-1v-4c0-1.1-.9-2-2-2s-2 .9-2 2v4c0 2.21 1.79 4 4 4z"/>
          </svg>
        </div>
        <h1 class="main-title">مركز الأسنان</h1>
        <p class="subtitle">نظام إدارة العيادة</p>
      </div>

      <div class="form-section">
        <!-- البريد الإلكتروني -->
        <div class="input-group">
          <div class="input-icon-left">
            <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
            </svg>
          </div>
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            v-model="user.email"
            class="input-field-with-left-icon"
          />
        </div>

        <!-- كلمة المرور -->
        <div class="input-group">
          <div class="input-icon-left">
            <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <input
            :type="typePassword"
            placeholder="كلمة المرور"
            v-model="user.password"
            class="input-field-with-left-icon"
          />

          <!-- خيار عرض كلمة المرور -->
          <div class="checkbox-container">
            <input
              type="checkbox"
              id="showPassword"
              v-model="isShow"
              @change="toggleShow"
              class="checkbox-input"
            />
            <label
              for="showPassword"
              class="checkbox-label"
            >
              عرض كلمة المرور
            </label>
          </div>
        </div>

        <!-- زر تسجيل الدخول -->
        <button @click="loginApi(user)" :disabled="loading" class="btn-primary">
          <span v-if="!loading" class="btn-content">
            <svg class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            تسجيل الدخول
          </span>
          <div v-else class="loading-content">
            <svg class="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            جاري التحميل...
          </div>
        </button>
      </div>

      <div class="footer-section">
        <p class="forgot-password-text">هل نسيت كلمة المرور؟</p>
        <a href="#" class="forgot-password-link">
          استعادة كلمة المرور
        </a>
      </div>

      <!-- معلومات إضافية -->
      <div class="copyright-section">
        <p class="copyright-text">
          © 2024 مركز الأسنان - جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  </div>
   
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { dataUserStore } from "../store/dataUser";
import useToast from "../toast/toast";
import { _post } from "../api/axois";

const loading = ref(false);
const { showToast } = useToast();
const store = dataUserStore();
const { setUserInfo } = store;
const router = useRouter();

const isShow = ref(false);
const typePassword = ref("password");

const user = ref({
  email: "",
  password: "",
});

const toggleShow = () => {
  typePassword.value = isShow.value ? "text" : "password";
};

const loginApi = async (obj) => {
  if (obj.email && obj.password) {
    loading.value = true;
    try {
      const response = await _post("/api/Auth/Login", obj, false);
      const userInfo = response.data;

      if (!userInfo || !userInfo.token) {
        showToast("خطأ في تسجيل الدخول", "error");
        return;
      }

      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      setUserInfo(userInfo);

      router.push({ name: "home" });
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      loading.value = false;
    }
  } else {
    showToast("الرجاء إدخال البريد وكلمة المرور", "error");
  }
};
</script>

<style scoped>
/* الحاوية الرئيسية */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom right, #1e40af, #3b82f6);
}

/* بطاقة تسجيل الدخول */
.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 32px;
  width: 100%;
  max-width: 384px;
  border-top: 4px solid #0ea5e9;
  animation: fadeIn 0.6s ease-in-out;
}

/* قسم الهيدر */
.header-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

/* حاوية الأيقونة */
.icon-container {
  background: linear-gradient(to right, #0ea5e9, #3b82f6);
  border-radius: 50%;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* أيقونة الأسنان */
.tooth-icon {
  width: 48px;
  height: 48px;
  color: white;
}

/* العنوان الرئيسي */
.main-title {
  font-size: 30px;
  font-weight: bold;
  color: #1e40af;
  margin-bottom: 8px;
  margin: 0;
}

/* العنوان الفرعي */
.subtitle {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

/* قسم النموذج */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* مجموعة الإدخال */
.input-group {
  position: relative;
}

/* أيقونة الإدخال */
.input-icon {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 12px;
  display: flex;
  align-items: center;
  pointer-events: none;
  z-index: 1;
}

/* أيقونة الإدخال - يسار */
.input-icon-left {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 10px;
  padding-left: 12px;
  display: flex;
  align-items: center;
  pointer-events: none;
  z-index: 1;
}

/* الأيقونة */
.icon {
  width: 20px;
  height: 20px;
  color: #1e40af;
}

/* حقل الإدخال */
.input-field {
  width: 100%;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px 12px 44px;
  font-size: 15px;
  outline: none;
  transition: all 0.3s ease;
  color: #374151;
  background-color: #f9fafb;
  box-sizing: border-box;
}

/* حقل الإدخال مع أيقونة يسار */
.input-field-with-left-icon {
  width: 100%;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 44px 12px 16px;
  font-size: 15px;
  outline: none;
  transition: all 0.3s ease;
  color: #374151;
  background-color: #f9fafb;
  box-sizing: border-box;
}

.input-field:focus {
  border-color: #1e40af;
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
  background-color: white;
}

.input-field-with-left-icon:focus {
  border-color: #1e40af;
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
  background-color: white;
}

/* حاوية خانة الاختيار */
.checkbox-container {
  display: flex;
  align-items: center;
  margin-top: 12px;
  gap: 8px;
}

/* خانة الاختيار */
.checkbox-input {
  cursor: pointer;
  accent-color: #1e40af;
  width: 16px;
  height: 16px;
}

/* تسمية خانة الاختيار */
.checkbox-label {
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  user-select: none;
}

/* الزر الرئيسي */
.btn-primary {
  width: 100%;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  padding: 14px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px 0 rgba(30, 64, 175, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px 0 rgba(30, 64, 175, 0.4);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* محتوى الزر */
.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* أيقونة الزر */
.btn-icon {
  width: 20px;
  height: 20px;
}

/* محتوى التحميل */
.loading-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

/* سبينر التحميل */
.loading-spinner {
  animation: spin 1s linear infinite;
  width: 20px;
  height: 20px;
  color: white;
}

/* قسم التذييل */
.footer-section {
  text-align: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

/* نص نسيان كلمة المرور */
.forgot-password-text {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
  margin: 0 0 8px 0;
}

/* رابط نسيان كلمة المرور */
.forgot-password-link {
  color: #1e40af;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s ease;
}

.forgot-password-link:hover {
  color: #3b82f6;
}

/* قسم حقوق الطبع */
.copyright-section {
  margin-top: 24px;
  text-align: center;
}

/* نص حقوق الطبع */
.copyright-text {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

/* الأنيميشن */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
