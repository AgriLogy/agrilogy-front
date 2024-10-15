import axios from 'axios';
import { useRouter } from 'next/router';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    const publicRoutes = ['/login', '/signup'];

    const router = useRouter(); 

    if (!publicRoutes.includes(router.pathname) && accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const router = useRouter();
    console.log(error);

    if (error.response && error.response.status === 401) {
      if (router.pathname !== '/login') {
        router.push('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
