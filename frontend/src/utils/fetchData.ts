import axios, { AxiosResponse } from 'axios';
import { BACKEND_URL } from '@/constants';
import { Redirect } from 'next';
const axiosInstance = axios.create({
    baseURL: `${BACKEND_URL}/api`,
    withCredentials: true,
});
// Add an error interceptor to handle common errors
axiosInstance.interceptors.response.use(
    (response : AxiosResponse) => {
      // Handle successful responses here
      return response;
    },
    (error) => {
      // Handle errors here
      if (error.response.status === 401) {
        // Server responded with a non-2xx status code
        console.error('Session Expired or no User Logged in', error.response.status);
        // You can handle specific error cases here
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', error.message);
      }
      return Promise.reject(error);
    }
  );
export default axiosInstance;