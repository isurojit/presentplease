import axios from "axios";
import { auth } from "../firebase/config";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
});

api.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
