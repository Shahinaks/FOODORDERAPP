import axios from 'axios';
import { getAuth } from 'firebase/auth';

const axiosInstance = axios.create({
  baseURL: 'https://foodorderapp-server.onrender.com/api',

  withCredentials: false,
});

axiosInstance.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default axiosInstance;
