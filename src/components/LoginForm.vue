<template>
  <div class="login-container" dir="rtl">
    <div class="login-card">
      <div class="header-section">
        <!-- أيقونة الأسنان -->
        <div class="icon-container">
          <i class="fa-solid fa-tooth tooth-icon"></i>
        </div>
        <h1 class="main-title bg-">مركز الأسنان</h1>
      </div>
      <div class="form-section">
        <!-- اسم المستخدم -->
        <div class="input-group">
          <label class="input-label">البريد الالكتروني</label>
          <div class="input-wrapper">
            <i class="fa-solid fa-envelope icon"></i>

            <input
              type="email"
              v-model="user.email"
              placeholder="example@email.com"
              class="input-field"
              autocomplete="new-password"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
            />
          </div>
        </div>

        <!-- كلمة المرور -->
        <div class="input-group">
          <label class="input-label">كلمة المرور</label>
          <div class="input-wrapper">
            <i class="fa-solid fa-lock icon"></i>

            <input
              :type="typePassword"
              v-model="user.password"
              placeholder="••••••••"
              class="input-field"
            />
          </div>

          <div class="checkbox-container">
            <input type="checkbox" v-model="isShow" @change="toggleShow" />
            <span>إظهار كلمة المرور</span>
          </div>
        </div>

        <!-- زر الدخول -->
        <button @click="loginApi(user)" :disabled="loading" class="btn-primary">
          {{ loading ? "جاري الدخول..." : "تسجيل الدخول" }}
        </button>
      </div>

      <div class="footer-section">
        <p class="forgot-password-text">هل نسيت كلمة المرور؟</p>
        <a href="#" class="forgot-password-link"> استعادة كلمة المرور </a>
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
  /* ===============================
   الحاوية الرئيسية
================================ */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-gray-100), #e6f6fe);
  font-family: var(--font-primary);
}

/* ===============================
   بطاقة تسجيل الدخول
================================ */
.login-card {
  background: var(--color-white);
  border-radius: 20px;
  padding: 40px 36px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 15px 40px rgba(15, 23, 42, 0.1);
  animation: cardEnter 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
}

/* ===============================
   الهيدر
================================ */
.header-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.icon-container {
  background: linear-gradient(
    135deg,
    var(--color-primary-700),
    var(--color-secondary-500)
  );
  border-radius: 50%;
  padding: 18px;
  margin-bottom: 16px;
  box-shadow: 0 10px 20px rgba(56, 189, 248, 0.35);
}

/* أيقونة الأسنان */
.tooth-icon {
  font-size: 46px;
  color: white;
  animation: toothPop 0.9s ease-out forwards;
}

.main-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--color-primary-900);
  margin: 0;
}

/* ===============================
   الفورم
================================ */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* مجموعة الإدخال */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  opacity: 0;
  animation: inputFade 0.6s ease forwards;
}

.input-group:nth-child(1) { animation-delay: 0.2s; }
.input-group:nth-child(2) { animation-delay: 0.35s; }

/* Label */
.input-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-gray-500);
}

/* Wrapper */
.input-wrapper {
  position: relative;
}

/* الأيقونة داخل الحقل */
.input-wrapper .icon {
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  font-size: 16px;
  color: var(--color-primary-500);
  pointer-events: none;
}

/* حقل الإدخال */
.input-field {
  width: 100%;
  padding: 13px 14px 13px 44px;
  border-radius: 12px;
  border: 1px solid var(--color-gray-100);
  background: var(--color-gray-100);
  font-size: 15px;
  color: var(--color-primary-900);
  transition: all 0.25s ease;
  box-sizing: border-box;
}

.input-field::placeholder {
  color: #94a3b8;
  font-size: 14px;
}

.input-field:focus {
  outline: none;
  background: var(--color-white);
  border-color: var(--color-secondary-500);
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25);
}

/* ===============================
   checkbox
================================ */
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  font-size: 14px;
  color: var(--color-gray-500);
}

.checkbox-container input {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--color-secondary-500);
}

/* ===============================
   زر الدخول
================================ */
.btn-primary {
  margin-top: 10px;
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  color: white;
  background: linear-gradient(
    135deg,
    var(--color-primary-700),
    var(--color-secondary-500)
  );
  box-shadow: 0 8px 20px rgba(30, 41, 59, 0.25);
  transition: all 0.3s ease;
  opacity: 0;
  animation: inputFade 0.6s ease forwards;
  animation-delay: 0.5s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(30, 41, 59, 0.35);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* ===============================
   الفوتر
================================ */
.footer-section {
  margin-top: 26px;
  padding-top: 18px;
  text-align: center;
  border-top: 1px solid var(--color-gray-100);
}

.forgot-password-text {
  font-size: 14px;
  color: var(--color-gray-500);
  margin-bottom: 6px;
}

.forgot-password-link {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-secondary-500);
  text-decoration: none;
}

.forgot-password-link:hover {
  text-decoration: underline;
}

/* ===============================
   Animations
================================ */
@keyframes cardEnter {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toothPop {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  60% {
    transform: scale(1.1) rotate(10deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0);
  }
}

@keyframes inputFade {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
