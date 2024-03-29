import axios from 'axios';

// Use the environment variable or default to localhost for development
const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: baseURL,
});

async function refreshTokenAndRetry(failedRequest) {
  try {
    // Call your refresh token endpoint
    const { data } = await axiosInstance.post("/api/auth/token", {
      refreshToken: localStorage.getItem("refreshToken"), // Assuming refresh token is stored in local storage
    });

    // Update access token
    localStorage.setItem("accessToken", data.accessToken);
    // Update the Authorization header with the new access token
    failedRequest.config.headers["Authorization"] = "Bearer " + data.accessToken;

    // Update the accessToken in the request body
    failedRequest.config.data = JSON.stringify({ accessToken: data.accessToken });

    // Retry the original failed request with the new access token
    return axiosInstance(failedRequest.config);
  } catch (error) {
    console.error("Failed to refresh token", error);

    // Remove tokens from local storage.
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Redirect to login
    window.location.href = "/login";

    return Promise.reject(error);
  }
}

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log("error", error);
    const originalRequest = error.config;

    // Avoid infinite loops
    if (error.response.status === 403 && !originalRequest._retry) {
      // Check for a specific error indicating the token is expired
      if (error.response.data.message === "Invalid access token." || "Token is invalid or expired") {
        originalRequest._retry = true;
        return refreshTokenAndRetry(error);
      }

      // If the refresh token is also expired, handle the logout
      if (error.response.data.message === "Token is invalid or expired.") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Redirect to login
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
