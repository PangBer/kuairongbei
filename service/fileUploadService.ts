import { UploadedFile } from "@/utils/fileUpload";

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
    fileSize: number;
    fileType: string;
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
      fileSize: number;
      fileType: string;
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

  constructor(
    baseUrl: string = process.env.EXPO_PUBLIC_BASE_URL ||
      "http://192.168.1.4:8081",
    timeout: number = 30000
  ) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * 创建FormData
   */
  private createFormData(
    file: UploadedFile,
    additionalData?: Record<string, any>
  ): FormData {
    const formData = new FormData();

    // 添加文件
    formData.append("file", {
      uri: file.uri,
      type: file.mimeType || file.type,
      name: file.name,
    } as any);

    // 添加文件信息
    formData.append("fileName", file.name);
    formData.append("fileSize", file.size.toString());
    formData.append("fileType", file.mimeType || file.type);

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
      const formData = this.createFormData(file, additionalData);

      const response = await fetch(`${this.baseUrl}/api/upload`, {
        method: "POST",
        body: formData,
        // 移除 Content-Type 头，让浏览器自动设置 multipart/form-data 边界
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return {
        success: true,
        message: "文件上传成功",
        data: {
          fileId: result.fileId || result.id,
          fileName: result.fileName || file.name,
          fileUrl: result.fileUrl || result.url,
          fileSize: result.fileSize || file.size,
          fileType: result.fileType || file.type,
          uploadTime: result.uploadTime || new Date().toISOString(),
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
          fileName: file.name,
          fileUrl: result.data?.fileUrl || "",
          fileSize: file.size,
          fileType: file.type,
          uploadTime: result.data?.uploadTime || new Date().toISOString(),
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
          fileSize: file.size,
          fileType: file.type,
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
      const response = await fetch(`${this.baseUrl}/api/upload/${fileId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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

  /**
   * 获取文件信息
   */
  async getFileInfo(fileId: string): Promise<UploadResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/upload/${fileId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return {
        success: true,
        message: "获取文件信息成功",
        data: result,
      };
    } catch (error) {
      console.error("获取文件信息失败:", error);
      return {
        success: false,
        message: "获取文件信息失败",
        error: error instanceof Error ? error.message : "未知错误",
      };
    }
  }
}

// 创建默认实例
export const fileUploadService = new FileUploadService();
