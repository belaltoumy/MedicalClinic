<template>
  <Dashboard>
    <div class="home-container">

      <div class="welcome-section">
        <div class="welcome-icon">
          <svg class="tooth-icon" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 2C9.79 2 8 3.79 8 6v4c0 1.1.9 2 2 2s2-.9 2-2V6c0-.55.45-1 1-1s1 .45 1 1v4c0 1.1.9 2 2 2s2-.9 2-2V6c0-2.21-1.79-4-4-4zm0 18c2.21 0 4-1.79 4-4v-4c0-1.1-.9-2-2-2s-2 .9-2 2v4c0 .55-.45 1-1 1s-1-.45-1-1v-4c0-1.1-.9-2-2-2s-2 .9-2 2v4c0 2.21 1.79 4 4 4z"
            />
          </svg>
        </div>

        <h1 class="welcome-title">مرحباً بك في العيادة السنية</h1>
        <p class="welcome-subtitle">
          نحن سعداء لخدمتك وتقديم أفضل رعاية طبية لأسنانك
        </p>
      </div>

    </div>
  </Dashboard>
</template>


<script setup>
import Dashboard from "../components/dashboard.vue";
</script>

<style scoped>
/* الحاوية الرئيسية */
.home-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* قسم الترحيب */
.welcome-section {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 60px 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  max-width: 500px;
  animation: fadeInUp 1s ease-out;
}

/* أيقونة الترحيب */
.welcome-icon {
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
  box-shadow: 0 10px 30px rgba(30, 64, 175, 0.3);
}

.tooth-icon {
  width: 40px;
  height: 40px;
  color: white;
}

/* عنوان الترحيب */
.welcome-title {
  font-size: 32px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

/* نص الترحيب */
.welcome-subtitle {
  font-size: 18px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

/* أنيميشن الظهور */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* تحسينات للشاشات الصغيرة */
@media (max-width: 768px) {
  .welcome-section {
    margin: 20px;
    padding: 40px 30px;
  }

  .welcome-title {
    font-size: 28px;
  }

  .welcome-subtitle {
    font-size: 16px;
  }

  .welcome-icon {
    width: 70px;
    height: 70px;
  }

  .tooth-icon {
    width: 35px;
    height: 35px;
  }
}
</style>
