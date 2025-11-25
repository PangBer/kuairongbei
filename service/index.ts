import req from "@/utils/fetch";

/**
 *
 * @returns {Promise<any>}
 * @description 获取图像验证码
 */
export const imageCodeApi = () => req.get("/auth/code");

/**
 *
 * @param data
 * @returns {Promise<any>}
 * @description 获取短信验证码
 */
export const smsCodeApi = (data: any) =>
  req.post("/system/sms/sendAliyun", data, { headers: { isEncrypt: "true" } });

/**
 *
 * @param data
 * @returns {Promise<any>}
 * @description 登录
 */
export const sendLoginAPi = (data: any) =>
  req.post("/auth/login", data, { headers: { isEncrypt: "true" } });

/**
 *
 * @returns {Promise<any>}
 * @description 获取用户信息
 */
export const userInfoApi = () =>
  req.get("/mobile/collectorUser/mobileUserDetail");

/**
 *
 * @param data
 * @returns {Promise<any>}
 * @description 获取城市列表
 */
export const citysApi = (data: any) =>
  req.get("/mobile/area/appletTreeList", data);

/**
 *
 * @param dictType
 * @returns {Promise<any>}
 * @description 获取字典列表
 */
export const dictsApi = (dictType: string) =>
  req.get("/mobile/dict/type/" + dictType);
