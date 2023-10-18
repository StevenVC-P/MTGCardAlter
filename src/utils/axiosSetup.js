import axios from "axios";

async function refreshTokenAndRetry(failedRequest) {
  try {
    // Call your refresh token endpoint
    const { data } = await axios.post("http://localhost:5000/api/auth/token", {
      token: localStorage.getItem("refreshToken"), // Assuming refresh token is stored in local storage
    });

    // Update access token
    localStorage.setItem("accessToken", data.accessToken);

    // Retry the original failed request with the new access token
    failedRequest.response.config.headers["Authorization"] = "Bearer " + data.accessToken;
    return axios(failedRequest.response.config);
  } catch (error) {
    // Handle error appropriately, perhaps redirect to login
    console.error("Failed to refresh token", error);
  }
}

axios.interceptors.response.use(
  (response) => {
    console.log("response", response);
    return response;
  },
  async (error) => {
    console.log("Intercepted an error", error);
    if (error && error.response && error.response.status === 403) {
      return refreshTokenAndRetry(error);
    }
    return Promise.reject(error);
  }
);

export default axios;
