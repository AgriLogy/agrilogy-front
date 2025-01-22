import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';

const useAxiosInstance = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Access localStorage only on the client side
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      setToken(accessToken); // Set the token state
    }
  }, []); // Run only once when the component mounts

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
      Authorization: token ? `Bearer ${token}` : '', // Include token in Authorization header
    },
  });

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const accessToken = localStorage.getItem('accessToken');
          const publicRoutes = ['/login', '/signup'];

          if (!publicRoutes.includes(pathname) && accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
          }
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
          router.push('/login');
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [pathname, router, token]); // Added token to the dependency array

  return axiosInstance;
};

export default useAxiosInstance;
