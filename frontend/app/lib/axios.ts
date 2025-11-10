import axios from "axios";

// Function to get the correct base URL at runtime
function getBaseURL(): string {
  const isServer = typeof window === "undefined";
  
  if (isServer) {
    // Server-side: use internal Docker service name or fallback
    // Never use 'localhost' on server-side in Docker to avoid IPv6 issues
    return process.env.PROD_BACKEND_URL || 
           process.env.LOCAL_BACKEND_URL || 
           "http://backend:5000/api/v1/auth";
  } else {
    // Client-side: use public URL
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1/auth";
  }
}

// Create a custom axios instance with baseURL
const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  // @ts-ignore - Force IPv4 for axios to avoid IPv6 connection issues
  family: 4,
});

// Add a request interceptor to log requests
axiosInstance.interceptors.request.use(function (config) {
    // Log the URL being used for debugging
    const isServer = typeof window === "undefined";
    console.log(`[${isServer ? 'SERVER' : 'CLIENT'}] Request to:`, config.baseURL + (config.url || ''));

    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });

// Also configure the default axios instance for backward compatibility
axios.defaults.withCredentials = true;
axios.defaults.baseURL = getBaseURL();
// @ts-ignore
axios.defaults.family = 4;

export default axiosInstance;
