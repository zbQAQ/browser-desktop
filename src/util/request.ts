import axios from "axios"

const service = axios.create({
  timeout: 1000,
});

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    console.debug("before request config: ", config)
    return config;
  }, 
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    console.debug("before response data: ", response)
    return response.data;
  }, 
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);


export default service