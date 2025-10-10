import req, { getGlobalClearAuthState, showToast } from "@/utils/fetch";
import { UploadedFile } from "@/utils/fileUpload";
import { getToken, removeToken } from "@/utils/token";
import { router } from "expo-router";
import { Platform } from "react-native";
/**
 * 文件上传响应
 */
export interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    fileId: string;
    fileName: string;
    fileUrl: string;
    uploadTime: string;
  };
  error?: string;
}

/**
 * 批量上传响应
 */
export interface BatchUploadResponse {
  success: boolean;
  message: string;
  data?: {
    successCount: number;
    failCount: number;
    files: Array<{
      fileId: string;
      fileName: string;
      fileUrl: string;
      uploadTime: string;
      success: boolean;
      error?: string;
    }>;
  };
  error?: string;
}

/**
 * 文件上传服务
 */
export class FileUploadService {
  private baseUrl: string;
  private timeout: number;
  private pathId: string;

  constructor(
    baseUrl: string = process.env.EXPO_PUBLIC_BASE_URL ||
      "http://192.168.1.4:8081",
    timeout: number = 30000,
    pathId: string = "1939583832702820353"
  ) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.pathId = pathId;
  }

  /**
   * 创建FormData - 统一使用二进制文件上传
   */
  private async createFormData(
    file: UploadedFile,
    additionalData?: Record<string, any>
  ): Promise<FormData> {
    const formData = new FormData();

    try {
      if (Platform.OS === "web") {
        // Web端：处理blob URL或文件URL
        let fileBlob: Blob;

        if (file.uri.startsWith("blob:")) {
          const response = await fetch(file.uri);
          fileBlob = await response.blob();
        } else if (file.uri.startsWith("data:")) {
          // 处理data URL
          const response = await fetch(file.uri);
          fileBlob = await response.blob();
        } else {
          // 处理文件URL
          const response = await fetch(file.uri);
          fileBlob = await response.blob();
        }

        // 创建File对象
        const fileObj = new File([fileBlob], file.name, {
          type: file.mimeType || file.type,
        });

        // 添加二进制文件
        formData.append("file", fileObj);
      } else {
        // App端：直接使用React Native格式，服务器端会处理二进制转换
        formData.append("file", {
          uri: file.uri,
          type: file.mimeType || file.type,
          name: file.name,
        } as any);
      }
    } catch (error) {
      console.error("文件处理失败:", error);
      // 降级处理：使用原始格式
      formData.append("file", {
        uri: file.uri,
        type: file.mimeType || file.type,
        name: file.name,
      } as any);
    }

    // 添加文件信息
    // formData.append("fileName", file.name);
    // formData.append("fileSize", file.size.toString());
    // formData.append("fileType", file.mimeType || file.type);

    // 添加额外数据
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    return formData;
  }

  /**
   * 上传单个文件
   */
  async uploadFile(
    file: UploadedFile,
    additionalData?: Record<string, any>
  ): Promise<UploadResponse> {
    try {
      const formData = await this.createFormData(file, additionalData);
      const token = await getToken();
      const response = await fetch(
        `${this.baseUrl}/resource/oss/uploadNotCheck?pathId=${this.pathId}`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            clientid: process.env.EXPO_PUBLIC_CLIENT_ID || "",
          },
          body: formData,
          // 移除 Content-Type 头，让浏览器自动设置 multipart/form-data 边界
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.code !== 200) {
        if (result.code === 401) {
          showToast("error", "未授权", "请先登录");

          // 清除所有认证状态
          try {
            const clearAuthState = getGlobalClearAuthState();

            await removeToken();
            clearAuthState?.();
          } catch (error) {
            console.error("清除token失败:", error);
          }

          // 使用 expo-router 导航到登录页面
          router.replace("/login");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      return {
        success: true,
        message: "文件上传成功",
        data: {
          fileId: result.data?.ossId,
          fileName: result.data?.fileName,
          fileUrl: result.data?.url,
          uploadTime: result.data?.uploadTime || new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("文件上传失败:", error);
      return {
        success: false,
        message: "文件上传失败",
        error: error instanceof Error ? error.message : "未知错误",
      };
    }
  }

  /**
   * 批量上传文件
   */
  async uploadFiles(
    files: UploadedFile[],
    additionalData?: Record<string, any>
  ): Promise<BatchUploadResponse> {
    const results = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        const result = await this.uploadFile(file, additionalData);

        results.push({
          fileId: result.data?.fileId || "",
          fileName: result.data?.fileName || "",
          fileUrl: result.data?.fileUrl || "",
          uploadTime: result.data?.uploadTime || "",
          success: result.success,
          error: result.error,
        });

        if (result.success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        results.push({
          fileId: "",
          fileName: file.name,
          fileUrl: "",
          uploadTime: new Date().toISOString(),
          success: false,
          error: error instanceof Error ? error.message : "上传失败",
        });
        failCount++;
      }
    }

    return {
      success: failCount === 0,
      message: `上传完成：成功 ${successCount} 个，失败 ${failCount} 个`,
      data: {
        successCount,
        failCount,
        files: results,
      },
    };
  }

  /**
   * 删除已上传的文件
   */
  async deleteFile(
    fileId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await req.delete("/h5/app/oss/" + fileId);
      if (response.code !== 200) {
        throw new Error(`HTTP error! status: ${response.code}`);
      }

      return {
        success: true,
        message: "文件删除成功",
      };
    } catch (error) {
      console.error("文件删除失败:", error);
      return {
        success: false,
        message: "文件删除失败",
      };
    }
  }
}

// 创建默认实例
export const fileUploadService = new FileUploadService();
