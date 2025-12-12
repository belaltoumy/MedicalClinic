import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const dataUserStore = defineStore('user', () => {
  const userId = ref("");
  const message = ref(null);
  const isAuthenticated = ref(false);
  const username = ref("");
  const email = ref("");
  const roles = ref([]);
  const token = ref("");
  const expiresOn = ref("");
  const refreshTokenExpiration = ref("");

  const getUserId = computed(() => userId.value);
  const getMessage = computed(() => message.value);
  const getIsAuthenticated = computed(() => isAuthenticated.value);
  const getUsername = computed(() => username.value);
  const getEmail = computed(() => email.value);
  const getRoles = computed(() => roles.value);
  const getToken = computed(() => token.value);
  const getExpiresOn = computed(() => expiresOn.value);
  const getRefreshTokenExpiration = computed(() => refreshTokenExpiration.value);

  const setUserId = (val) => userId.value = val;
  const setMessage = (val) => message.value = val;
  const setIsAuthenticated = (val) => isAuthenticated.value = val;
  const setUsername = (val) => username.value = val;
  const setEmail = (val) => email.value = val;
  const setRoles = (val) => roles.value = val;
  const setToken = (val) => token.value = val;
  const setExpiresOn = (val) => expiresOn.value = val;
  const setRefreshTokenExpiration = (val) => refreshTokenExpiration.value = val;

  const setUserInfo = (userInfo) => {
    userId.value = userInfo.userId || "";
    message.value = userInfo.message;
    isAuthenticated.value = userInfo.isAuthenticated || false;
    username.value = userInfo.username || "";
    email.value = userInfo.email || "";
    roles.value = userInfo.roles || [];
    token.value = userInfo.token || "";
    expiresOn.value = userInfo.expiresOn || "";
    refreshTokenExpiration.value = userInfo.refreshTokenExpiration || "";
  };

  const initializeFromStorage = () => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      setUserInfo(userInfo);
    }
  };

  return {
    userId,
    message,
    isAuthenticated,
    username,
    email,
    roles,
    token,
    expiresOn,
    refreshTokenExpiration,
    getUserId,
    getMessage,
    getIsAuthenticated,
    getUsername,
    getEmail,
    getRoles,
    getToken,
    getExpiresOn,
    getRefreshTokenExpiration,
    setUserId,
    setMessage,
    setIsAuthenticated,
    setUsername,
    setEmail,
    setRoles,
    setToken,
    setExpiresOn,
    setRefreshTokenExpiration,
    setUserInfo,
    initializeFromStorage
  };
});
