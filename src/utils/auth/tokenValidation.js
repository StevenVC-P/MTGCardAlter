import axiosInstance from "../axiosConfig";

export const tryLocalTokenValidation = () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (accessToken && refreshToken) {
    return axiosInstance
      .post("/api/auth/validate-access-token", { accessToken, refreshToken })
      .then((response) => {
        if (response.data.success) {
          return { success: true, user: response.data.user };
        }
        return { success: false };
      })
      .catch((error) => {
        console.error("Token validation error:", error);
        return { success: false };
      });
  } else {
    return Promise.resolve({ success: false });
  }
};

export const tryPatreonTokenValidation = (location) => {
  const queryParams = new URLSearchParams(location.search);
  const patreonConnected = queryParams.get("patreonConnected");
  const patreonToken = queryParams.get("token");

  if (patreonConnected === "true" && patreonToken) {
    return axiosInstance
      .post("/patreon/validate-patreon-token", { token: patreonToken })
      .then((response) => {
        if (response.data.valid) {
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          return { success: true };
        }
        return { success: false };
      })
      .catch((error) => {
        console.error("Error validating Patreon token:", error.response ? error.response.data : error.message);
        return { success: false };
      });
  } else {
    return Promise.resolve({ success: false });
  }
};
