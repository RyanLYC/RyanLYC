import axios, { AxiosInstance } from "axios";
import { ElMessage } from "element-plus";
import { utils as signUtils } from "zg-vue3-components";
import BASE_URL from "./baseUrl";
import { useStore } from "@/store/AuthStore";
// const BASE_URL = import.meta.env.VITE_BASE_URL as string

// create an axios instance
const service: AxiosInstance = axios.create({
  baseURL: BASE_URL, // api的base_url
  timeout: 40000, // 请求超时 20s
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    if (config.params?.stationId === "") {
      delete config.params.stationId;
    }
    const store = useStore();
    config.headers["x-zg-system"] = "zgeeop";
    if (store.state.authInfo.access_token) {
      config.headers.Authorization = `Bearer ${store.state.authInfo.access_token}`;
    }
    // get请求统一加sign, time
    if (config.method === "get" || config.method === "GET") {
      // 东八区时间戳
      const t = Date.now();
      config.headers["x-zg-time"] = t;
      // sign
      config.headers["x-zg-sign"] = signUtils.encryptionSign(
        config.params || {},
        `${signUtils.getUri(config.url)}${
          store.state.authInfo.access_token
        }${t}`
      );
    }
    // Do something before request is sent
    return config;
  },
  (error) => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// respone interceptor
service.interceptors.response.use(
  (response) => {
    /** 拦截 是 下载数据 还是 读取 固定数据 */
    const params = window.location.search.substring(1).split("&");
    // console.log('params:', params)

    if (params.length > 0 && params[0].indexOf("write") > -1) {
      // 下载
      const blob = new Blob([JSON.stringify(response.data)], {
        type: "application/json;charset=utf-8",
      });
      // @ts-ignore
      // eslint-disable-next-line no-undef
      saveAs(
        blob,
        `${response.config.url}-${response.config.method}-${JSON.stringify(
          response.config.data
        )}.json`
      );
    }
    if (params.length > 0 && params[0].indexOf("read") > -1) {
      // 读取
      const { url } = response.config;
      // console.log('response', response.config.url)
      let fileName = `${url}-${response.config.method}-${JSON.stringify(
        response.config.data
      )}.json`;
      fileName = fileName.replace(/\//g, "_");
      fileName = fileName.replace(/"/g, "_");
      const folder = params[1].replace("folder=", "");

      return (
        fetch(`https://oss.zyun.link/front/cs8760/${folder}/${fileName}`, {
          mode: "cors",
        })
          // 第一个 then 接受到的是请求头的相关信息
          .then((res) => {
            // console.log(res) // 拿到的是一个状态码
            // 用json格式读出来，也可以改为text，得到的就是一个text字符串，但是要做一个json解析，所以极少用text格式
            return res.json();
          })
          // 第二个.then拿到的是从后端请求回来的真正的数据
          // 想要获取响应数据，需在第一个then中将响应数据转为json再返回给第二个then，在第二个then中去获取值
          .then((res) => {
            // console.log('result:', res)
            return Promise.resolve(res);
          })
          // 请求错误时执行
          .catch((err) => {
            ElMessage.error(`${err}`);
          })
      );
    }
    if (
      response.config.responseType === "arraybuffer" ||
      response.config.responseType === "blob"
    ) {
      // 对于二进制流直接返回
      return response;
    }
    if (response.data.status === 0) {
      return response.data;
    }
    ElMessage.error(response.data.statusText);
    // 登录返回 status，因为验证码错误需要重新获取
    if (response.config.url === "/auth/v1/uaa/loginByPasswordWithCode") {
      return response.data;
    }
    return Promise.reject();
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const code = error.response.status;
      const msg = error.response.data.message;
      const store = useStore();
      ElMessage.error(`Code: ${code}, Message: ${msg}`);
      // store.action.logout()
    } else if (error.response && error.response.data) {
      const code = error.response.status;
      const msg = error.response.data.message;
      ElMessage.error(`Code: ${code}, Message: ${msg}`);
      // console.error(`[Axios Error]`, error.response)
    } else {
      ElMessage.error(`${error}`);
    }

    return Promise.reject(error);
  }
);

export default service;
