import axios from "axios";

axios.defaults.baseURL = process.env.NODE_ENV === "production" ? 
    process.env.PROD_BACKEND_URL : 
    process.env.LOCAL_BACKEND_URL;

axios.defaults.withCredentials = true;

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    console.log("Request sent with config:", 
        config.baseURL! + config.url, 
        "Request data:", JSON.stringify(config.data));

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

    console.log("Response received:", 
        response.config.baseURL! + response.config.url!, 
        "Response data:", JSON.stringify(response.data));

    return response;
  }, function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
