import { Platform } from "react-native";

// 二维码配置选项
export interface QRCodeOptions {
  size?: number;
  color?: string;
  backgroundColor?: string;
  logo?: {
    uri: string;
    width?: number;
    height?: number;
  };
  logoSize?: number;
  logoBackgroundColor?: string;
  logoMargin?: number;
  logoBorderRadius?: number;
  quietZone?: number;
  enableLinearGradient?: boolean;
  linearGradient?: {
    start: { x: number; y: number };
    end: { x: number; y: number };
    colors: string[];
  };
  gradientDirection?: string[];
}

// 默认配置
export const defaultQRCodeOptions: QRCodeOptions = {
  size: 200,
  color: "#000000",
  backgroundColor: "#FFFFFF",
  quietZone: 0,
};

/**
 * 生成Web链接
 * @param path 页面路径
 * @param params 查询参数
 * @returns string Web链接
 */
export const generateWebLink = (
  path: string,
  params?: Record<string, any>
): string => {
  const protocol = Platform.OS === "web" ? window.location.protocol : "https:";
  const hostname = "192.168.1.4";
  const port = Platform.OS === "web" ? window.location.port : "8081";

  const baseUrl = `${protocol}//${hostname}${port ? `:${port}` : ""}`;
  const url = new URL(path, baseUrl);

  if (params && Object.keys(params).length > 0) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
};

/**
 * 生成通用链接
 * @param path 页面路径
 * @param params 查询参数
 * @returns string 通用链接
 */
export const generateUniversalLink = (
  path: string,
  params?: Record<string, any>
): string => {
  const url = new URL(path, "https://kuairongbei.com");

  if (params && Object.keys(params).length > 0) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
};

/**
 * 生成当前页面的二维码链接
 * @param path 页面路径
 * @param params 查询参数
 * @returns string 二维码链接
 */
export const generatePageQRCodeLink = (
  path: string,
  params?: Record<string, any>
): string => {
  return generateWebLink(path, params);
};

/**
 * 解析二维码内容，提取路径和参数
 * @param qrCodeData 二维码内容
 * @returns object 解析结果
 */
export const parseQRCodeData = (
  qrCodeData: string
): {
  type: "web" | "universal" | "unknown";
  path: string;
  params: Record<string, any>;
  originalUrl: string;
} => {
  try {
    // 检查是否是Web链接
    if (qrCodeData.startsWith("http://") || qrCodeData.startsWith("https://")) {
      const url = new URL(qrCodeData);
      const params = Object.fromEntries(url.searchParams);

      return {
        type: "web",
        path: url.pathname,
        params,
        originalUrl: qrCodeData,
      };
    }

    // 检查是否是相对路径
    if (qrCodeData.startsWith("/")) {
      const [path, queryString] = qrCodeData.split("?");
      const params = queryString
        ? Object.fromEntries(new URLSearchParams(queryString))
        : {};

      return {
        type: "universal",
        path,
        params,
        originalUrl: qrCodeData,
      };
    }

    // 未知格式
    return {
      type: "unknown",
      path: "",
      params: {},
      originalUrl: qrCodeData,
    };
  } catch (error) {
    console.error("解析二维码数据失败:", error);
    return {
      type: "unknown",
      path: "",
      params: {},
      originalUrl: qrCodeData,
    };
  }
};

/**
 * 处理二维码扫描结果
 * @param qrCodeData 二维码内容
 * @param onNavigate 导航回调函数
 * @param onError 错误回调函数
 */
export const handleQRCodeScan = (
  qrCodeData: string,
  onNavigate: (path: string, params?: Record<string, any>) => void,
  onError?: (error: string) => void
): void => {
  const parsed = parseQRCodeData(qrCodeData);

  if (parsed.type === "unknown") {
    onError?.("无法识别的二维码格式");
    return;
  }

  // 统一处理：根据类型和平台决定跳转方式
  if (parsed.type === "web" && Platform.OS === "web") {
    // Web端处理Web链接：解析URL并跳转
    const url = new URL(parsed.originalUrl);
    const path = url.pathname;
    const params = Object.fromEntries(url.searchParams);
    onNavigate(path, Object.keys(params).length > 0 ? params : undefined);
  } else {
    // 其他情况：直接使用解析结果
    onNavigate(
      parsed.path,
      Object.keys(parsed.params).length > 0 ? parsed.params : undefined
    );
  }
};
