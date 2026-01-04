import { dataUserStore } from "../store/dataUser";

export const isAuth = (to, from, next) => {
  const userStore = dataUserStore();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  // ❌ غير مسجل دخول
  if (!token) {
    if (to.name !== "login") {
      return next({ name: "login" });
    }
    return next();
  }

  // ✅ مسجل دخول وحاول يفتح login
  if (to.name === "login") {
    return next({ name: "home" });
  }

  // ✅ مسجل دخول
  return next();
};
