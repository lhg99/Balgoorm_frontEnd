import axiosInstance from "../axiosInstance";

const postLogin = (userData) => axiosInstance.post("/login", userData);

export default postLogin;
