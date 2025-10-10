// utils/http.ts
import {
  encrypt,
  encryptBase64,
  encryptWithAes,
  generateAesKey,
} from "@/utils/crypto";
import { router } from "expo-router";
import { getToken } from "./token";
// 全局 Toast 管理器
let globalToastActions: any = null;
// 全局认证状态清除函数
let globalClearAuthState: (() => void) | null = null;

// 设置全局 Toast actions
export const setGlobalToastActions = (actions: any) => {
  globalToastActions = actions;
};

// 设置全局认证状态清除函数
export const setGlobalClearAuthState = (clearAuthState: () => void) => {
  globalClearAuthState = clearAuthState;
};

export const getGlobalClearAuthState = () => {
  return globalClearAuthState;
};

// 显示 Toast 的辅助函数
export const showToast = (
  type: "success" | "error" | "warning" | "info",
  title: string,
  message?: string
) => {
  if (globalToastActions) {
    switch (type) {
      case "success":
        globalToastActions.showSuccess(title, message);
        break;
      case "error":
        globalToastActions.showError(title, message);
        break;
      case "warning":
        globalToastActions.showWarning(title, message);
        break;
      case "info":
        globalToastActions.showInfo(title, message);
        break;
    }
  }
};
type Method = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions extends RequestInit {
  url: string;
  method?: Method;
  data?: any;
  headers?: Record<string, string>;
  cancelToken?: AbortController;
}

// 请求防抖 map
const debounceMap = new Map<string, any>();

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL; // ✅ 修改成你的后端地址

// 请求拦截器
const requestInterceptor = async (options: RequestOptions) => {
  const token = await getToken(); // 使用 token 管理工具
  options.headers = {
    "Content-Type": "application/json;charset=utf-8",
    "Content-Language": "zh_CN",
    clientid: process.env.EXPO_PUBLIC_CLIENT_ID || "",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  // 如果需要加密，并且是POST或PUT请求，则进行加密处理
  if (
    options.headers["isEncrypt"] &&
    (options.method === "POST" || options.method === "PUT")
  ) {
    // 动态引入加密相关方法，避免循环依赖

    const aesKey = generateAesKey();
    options.headers["encrypt-key"] = encrypt(encryptBase64(aesKey)) || "";
    options.data =
      typeof options.data === "object"
        ? encryptWithAes(JSON.stringify(options.data), aesKey)
        : encryptWithAes(options.data, aesKey);

    delete options.headers["isEncrypt"];
  }
  return options;
};

// 响应拦截器
const responseInterceptor = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    // 显示 HTTP 错误 Toast
    showToast(
      "error",
      "请求失败",
      `HTTP ${response.status}: ${data.msg || "服务器错误"}`
    );
    return Promise.reject(data);
  }

  if (data.code !== 200) {
    if (data.code === 401) {
      showToast("error", "未授权", "请先登录");

      // 清除所有认证状态
      if (globalClearAuthState) {
        globalClearAuthState();
      }

      // 使用 expo-router 导航到登录页面
      router.replace("/login");
    }
    // 显示业务错误 Toast
    showToast("error", "操作失败", data.msg || "请求处理失败");

    return Promise.reject(data);
  }

  return data;
};

// 核心请求函数
const request = async (
  options: RequestOptions,
  debounceKey?: string,
  debounceTime = 300
) => {
  // 防抖处理
  if (debounceKey) {
    if (debounceMap.has(debounceKey)) {
      clearTimeout(debounceMap.get(debounceKey));
    }
    return new Promise((resolve, reject) => {
      const timer = setTimeout(async () => {
        debounceMap.delete(debounceKey);
        try {
          const result = await sendRequest(options);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      }, debounceTime);
      debounceMap.set(debounceKey, timer);
    });
  } else {
    return sendRequest(options);
  }
};

// 真正发送请求
const sendRequest = async (options: RequestOptions) => {
  const opts = await requestInterceptor(options);

  let url = BASE_URL + opts.url;

  if (opts.method === "GET" && opts.data) {
    const queryString = new URLSearchParams(opts.data).toString();
    url += `?${queryString}`;
  }

  const fetchOptions: RequestInit = {
    method: opts.method || "GET",
    headers: opts.headers,
    body: opts.method !== "GET" ? opts.data : undefined,
    signal: opts.cancelToken?.signal,
  };

  try {
    const response = await fetch(url, fetchOptions);
    return await responseInterceptor(response);
  } catch (error) {
    if ((error as any).name === "AbortError") {
      return Promise.reject({ message: "请求已取消" });
    }
    return Promise.reject(error);
  }
};

// 封装 GET / POST / PUT / DELETE

export default {
  /**
   * GET 请求
   * @param url 请求地址
   * @param params 查询参数
   * @param options 请求配置
   * @param debounceKey 防抖键
   */
  get: (
    url: string,
    params?: Record<string, any>,
    options?: Partial<RequestOptions>,
    debounceKey?: string
  ) =>
    request(
      {
        url,
        method: "GET",
        data: params,
        ...options,
      },
      debounceKey
    ),

  /**
   * POST 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param options 请求配置
   * @param debounceKey 防抖键
   */
  post: (
    url: string,
    data?: any,
    options?: Partial<RequestOptions>,
    debounceKey?: string
  ) =>
    request(
      {
        url,
        method: "POST",
        data,
        ...options,
      },
      debounceKey
    ),

  /**
   * PUT 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param options 请求配置
   * @param debounceKey 防抖键
   */
  put: (
    url: string,
    data?: any,
    options?: Partial<RequestOptions>,
    debounceKey?: string
  ) =>
    request(
      {
        url,
        method: "PUT",
        data,
        ...options,
      },
      debounceKey
    ),

  /**
   * DELETE 请求
   * @param url 请求地址
   * @param options 请求配置
   * @param debounceKey 防抖键
   */
  delete: (
    url: string,
    options?: Partial<RequestOptions>,
    debounceKey?: string
  ) =>
    request(
      {
        url,
        method: "DELETE",
        ...options,
      },
      debounceKey
    ),
};
