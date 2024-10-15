// useAxiosInstance.js
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';

const useAxiosInstance = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/',
  });

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem('accessToken');
        const publicRoutes = ['/login', '/signup'];

        if (!publicRoutes.includes(pathname) && accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          if (pathname !== '/login') {
            router.push('/login');
          }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [pathname, router]);

  return axiosInstance;
};

export default useAxiosInstance;
