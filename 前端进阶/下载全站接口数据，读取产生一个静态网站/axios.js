import axios from "axios";
import qs from "qs";
import { Message } from "element-ui";
import baseUrl from "./baseUrl";

// import user from '@/api/user'
// import store from '@/store'

const axiosCustom = axios.create({
  // baseURL: process.env.VUE_APP_BASEURL
  baseURL: baseUrl,
  withCredentials: true,
  // timeout:3000
});
const mockAxiosCustom = axios.create({});
// axios.defaults.baseURL = baseURL
/*
 * 一、request：
 *    1. 说明：封装对后台的请求，可以选择自动处理一些异常。
 *    2. 参数：
 *        - url：          后台地址，必填，String，如："/user/add"
 *        - params：       请求参数，选填，Object，，默认值：{}
 *        - config：       axios参数，选填，Object，默认值：{}
 *        - autoErrorData：是否自动处理后台错误，选填，Boolean，默认值：true
 *    3. 返回：
 *        - 成功：Promise.resolve(请求成功后的结果：response.data)
 *        - 失败：
 *            - 请求异常：Promise.reject(http响应错误)
 *            - 请求失败：Promise.reject(请求失败后的结果：response.data)
 *    4. 约定后台返回数据格式：
 *        res.data = {
 *          "status": 0,                  // 成功/失败标识，0=成功，其他=失败
 *          "data": {},                   // 成功时可选参数，请求的响应数据
 *          "statusText": "状态信息"       // 失败时必需参数，错误提示
 *        }
 **/
/* 普通请求 */
export const request = (
  url,
  params = {},
  method = "post",
  config = {},
  isParams = undefined,
  convertJson = false
) => {
  if (params.username) {
    params.username = "";
  }
  if (params.password) {
    params.password = "";
  }

  if (params.start) {
    params.start = "";
  }
  if (params.end) {
    params.end = "";
  }
  if (params.startTime) {
    params.startTime = "";
  }
  if (params.endTime) {
    params.endTime = "";
  }
  if (params.time) {
    params.time = "";
  }
  const args = Object.assign(
    {
      method: method,
      url: url,
      data: !isParams
        ? convertJson
          ? params
          : qs.stringify(params)
        : undefined,
      params: isParams ? params : undefined,
    },
    config
  );
  let fileName = `${args.url}-${args.method}-${JSON.stringify(args.data)}.json`;
  fileName = fileName.replace(/\//g, "_");
  fileName = fileName.replace(/"/g, "_");
  console.log("111:", `./data/${fileName}`);
  return Promise.resolve(require(`./data/${fileName}`));
  // return axiosCustom(args).then(
  //   (res) => {
  //     // 自动处理返回格式错误
  //     if (res.data && res.data.status != 0 && res.data.status != 5212) {
  //       const errMsg =
  //         res.data && res.data.statusText
  //           ? res.data.statusText
  //           : "未知的服务器错误，请联系管理员！";
  //       {
  //         Message({
  //           message: errMsg,
  //           type: "error",
  //           duration: 1 * 1000,
  //         });
  //         return Promise.reject(new Error(errMsg));
  //       }
  //     }
  //     const blob = new Blob([JSON.stringify(res.data)], {
  //       type: "text/plain;charset=utf-8",
  //     });
  //     saveAs(
  //       blob,
  //       `${args.url}-${args.method}-${JSON.stringify(args.data)}.json`
  //     ); //saveAs(blob,filename)

  //     return Promise.resolve(res.data);
  //   },
  //   (error) => {
  //     // 自动处理网络请求错误
  //     error.response = error.response || {};
  //     const errStatus = error.response.status || -100;
  //     if (error.message && errStatus && errStatus != -100) {
  //       Message({
  //         message: "网络请求异常" + errStatus,
  //         type: "error",
  //         duration: 1 * 1000,
  //       });
  //     }
  //     return Promise.reject(error);
  //   }
  // );
};
/* 本机mock请求 */
export const mockRequest = (url) => {
  const args = {
    method: "get",
    url: url,
  };
  return mockAxiosCustom(args).then((res) => {
    // 自动处理返回格式错误
    return Promise.resolve(res.data);
  });
};
