import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://k618de24a93cca.user-app.krampoline.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
