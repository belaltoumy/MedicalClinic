<template>
  <ul class="main-nav">
    <!-- v-if="canAccess('users')" -->
    <li>
      <router-link to="/users" class="nav-link">
        <i class="fas fa-users-cog icon"></i>
        إدارة حسابات المستخدمين
      </router-link>
    </li>

    <li>
      <router-link to="/doctors" class="nav-link">
        <i class="fas fa-user-shield icon"></i>
        إدارة حسابات الاطباء
      </router-link>
    </li>
    <li>
      <router-link to="/doctor-withdrawals" class="nav-link">
        <i class="fas fa-user-shield icon"></i>
        إدارة سحوبات الأطباء 
      </router-link>
    </li>

    <li>
      <router-link to="/materials" class="nav-link">
        <i class="fas fa-file-circle-plus icon"></i>
        ادارة المواد
      </router-link>
    </li>

    <li>
      <router-link to="/patients" class="nav-link">
        <i class="fas fa-chalkboard-teacher icon"></i>
        ادارة المرضى
      </router-link>
    </li>
    <li>
      <router-link to="/payments" class="nav-link">
        <i class="fas fa-chalkboard-teacher icon"></i>
        ادارة الدفعات
      </router-link>
    </li>

    <li>
      <router-link to="/visites" class="nav-link">
        <i class="fas fa-clipboard-check icon"></i>
        ادارة الزيارات
      </router-link>
    </li>

    <li>
      <router-link to="/procedures" class="nav-link">
        <i class="fas fa-clipboard-check icon"></i>
        ادارة الاجراءات
      </router-link>
    </li>
    <li>
      <router-link to="/expenses" class="nav-link">
        <i class="fas fa-clipboard-check icon"></i>
        ادارة المصاريف
      </router-link>
    </li>
    <li>
      <router-link to="/accessibility" class="nav-link">
        <i class="fas fa-clipboard-check icon"></i>
        ادارة الصلاحيات
      </router-link>
    </li>
  </ul>
</template>

<script setup>
import { dataUserStore } from "../store/dataUser";

const userStore = dataUserStore();
// const id = localStorage.getItem("type_n");

// const rolePermissions = {
//   "1": ["manageuseraccounts", "auditoraccountsmanagement", "showcourses", "dayscourses",  "managementlist","showaxes","mangementtree","allquestionforadmin"], // maneger
//   "4": ["addquestion", "showmyquestion"], // واضع الأسئلة
//   "5": ["auditquestion"], // مدقق الأسئلة
//   "7": ["showcourses", "dayscourses","showaxes","createform","createexamform"], // منشىء الدورات
// };

// const canAccess = (routeName) => {
//   console.log(rolePermissions[userStore.getIdTypeUser]?.includes(routeName));

//   return rolePermissions[userStore.getIdTypeUser]?.includes(routeName);
// };
</script>

<style scoped>
.main-nav {
  background-color: wh;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  font-size: 20px;
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: 10px;
  display: flex;
  flex-direction: column; /* عمودي */
  gap: 12px;
}

/* الرابط كامل */
.main-nav li .nav-link,
.main-nav li a {
  font-size: 17px;
  color: white;
  font-weight: bold;
  padding: 10px 15px;
  border-radius: 6px;
  display: flex; /* لتمكين المحاذاة الأفقية */
  align-items: center;
  gap: 12px; /* مسافة بين الأيقونة والنص */
  position: relative;
  text-decoration: none;
  transition: color 0.3s, background-color 0.3s;
}

/* عند المرور */
.main-nav li .nav-link:hover,
.main-nav li a:hover {
  color: white;
  background-color: #b8a57a;
}

/* الأيقونة */
.icon {
  min-width: 24px;
  font-size: 18px;
  color: white;
}

/* تظليل تحت النص (اختياري) */
.main-nav li a::after {
  content: "";
  position: absolute;
  width: 0;
  height: 3px;
  background-color: white;
  bottom: 0;
  left: 0;
  transition: width 0.3s ease, left 0.3s ease;
}

.main-nav li a.router-link-exact-active::after {
  width: 100%;
  left: 0;
}

/* لو حابب تعدل ألوان أو حجم الأيقونات فقط عدل في .icon */
</style>
