import axios from "axios";

// Function to get the correct base URL at runtime
function getBaseURL(): string {
  const isServer = typeof window === "undefined";
  
  if (isServer) {
    // Server-side: use internal Docker service name or fallback
    return process.env.PROD_BACKEND_URL || 
           process.env.LOCAL_BACKEND_URL || 
           "http://backend:5000/api/v1/auth";
  } else {
    // Client-side: use public URL
    return process.env.NEXT_PUBLIC_API_URL || 
           "http://localhost:5000/api/v1/auth";
  }
}

axios.defaults.withCredentials = true;

// Add a request interceptor to set baseURL dynamically
axios.interceptors.request.use(function (config) {
    // Set baseURL dynamically on each request
    if (!config.baseURL) {
      config.baseURL = getBaseURL();
    }

    // Do something before request is sent
    // console.log("Request sent with config:", 
    //     config.baseURL! + config.url, 
    //     "Request data:", JSON.stringify(config.data));

    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
//   { synchronous: true, runWhen: () => /* This function returns true */}
);

// Add a response interceptor
axios.interceptors.response.use(function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    // console.log("Response received:", 
    //     response.config.baseURL! + response.config.url!, 
    //     "Response data:", JSON.stringify(response.data));

    return response;
  }, function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
