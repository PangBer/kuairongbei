import React, { useState } from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";

import {
  BatchUploadResponse,
  fileUploadService,
  UploadResponse,
} from "@/service/fileUploadService";

import { showInfo } from "@/store/slices/toastSlice";
import {
  FileUploadConfig,
  getFileSizeText,
  getFileTypeIcon,
  pickDocument,
  pickImageFromCamera,
  pickImageFromGallery,
  UploadedFile,
} from "@/utils/fileUpload";

interface FileUploadProps {
  config?: FileUploadConfig;
  onFileSelect?: (files: UploadResponse[]) => void;
  onUploadSuccess?: (response: UploadResponse | BatchUploadResponse) => void;
  onUploadError?: (error: string) => void;
  multiple?: boolean;
  showPreview?: boolean;
  maxFiles?: number;
  disabled?: boolean;
  autoUpload?: boolean; // 是否自动上传
  additionalData?: Record<string, any>; // 额外数据
}

export default function FileUpload({
  config,
  onFileSelect,
  onUploadSuccess,
  onUploadError,
  multiple = false,
  showPreview = true,
  maxFiles = 5,
  disabled = false,
  autoUpload = true,
  additionalData,
}: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<UploadResponse[]>([]);

  // 处理文件选择
  const handleFileSelect = async (
    source: "camera" | "gallery" | "document"
  ) => {
    if (disabled) return;

    try {
      let result: UploadedFile | UploadedFile[] | null = null;
      const isMultipleSelection = multiple && maxFiles > 1;

      switch (source) {
        case "camera":
          result = await pickImageFromCamera(config);
          break;
        case "gallery":
          result = await pickImageFromGallery(config, isMultipleSelection);
          break;
        case "document":
          result = await pickDocument(config, isMultipleSelection);
          break;
      }

      if (result) {
        if (multiple) {
          // 多文件模式
          const newFiles = Array.isArray(result)
            ? [...selectedFiles, ...result]
            : [...selectedFiles, result];

          if (newFiles.length > maxFiles) {
            // Alert.alert("文件数量超限", `最多只能选择 ${maxFiles} 个文件`);
            showInfo({
              title: "文件数量超限",
              message: `最多只能选择 ${maxFiles} 个文件`,
            });
            // return;
            newFiles.splice(maxFiles, newFiles.length - maxFiles);
          }

          setSelectedFiles(newFiles);

          // 自动上传
          if (autoUpload) {
            await uploadFiles(newFiles);
          }
        } else {
          // 单文件模式
          const file = Array.isArray(result) ? result[0] : result;
          setSelectedFiles([file]);

          // 自动上传
          if (autoUpload) {
            await uploadFiles([file]);
          }
        }
      }
    } catch (error) {
      console.error("文件选择失败:", error);
      Alert.alert("选择失败", "文件选择过程中出现错误");
    }
  };

  // 移除文件
  const removeFile = async (index: number) => {
    const uploadResult = uploadResults[index];
    // 如果文件已上传成功，调用删除接口
    if (uploadResult?.success && uploadResult.data?.fileId) {
      try {
        await fileUploadService.deleteFile(uploadResult.data.fileId);
        console.log("文件删除成功:", uploadResult.data.fileId);
      } catch (error) {
        console.error("文件删除失败:", error);
        Alert.alert("删除失败", "服务器端文件删除失败，但已从列表中移除");
      }
    }

    // 从本地状态中移除文件
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUploadResults = uploadResults.filter((_, i) => i !== index);

    setSelectedFiles(newFiles);
    setUploadResults(newUploadResults);

    onFileSelect?.(newUploadResults);
  };

  // 清空所有文件
  const clearAllFiles = async () => {
    // 批量删除已上传成功的文件
    const deletePromises = uploadResults
      .filter((result) => result.success && result.data?.fileId)
      .map((result) =>
        fileUploadService.deleteFile(result.data!.fileId).catch((error) => {
          console.error("文件删除失败:", result.data!.fileId, error);
          return { success: false, error };
        })
      );

    if (deletePromises.length > 0) {
      try {
        await Promise.all(deletePromises);
        console.log("批量删除文件完成");
      } catch (error) {
        console.error("批量删除文件失败:", error);
      }
    }

    // 清空本地状态
    setSelectedFiles([]);
    setUploadResults([]);

    onFileSelect?.([]);
  };

  // 上传文件
  const uploadFiles = async (files: UploadedFile[]) => {
    if (files.length === 0) {
      return;
    }

    setIsUploading(true);

    try {
      if (multiple) {
        // 过滤掉已经上传成功的文件
        const filesToUpload: UploadedFile[] = [];
        const alreadyUploadedFiles: UploadedFile[] = [];

        files.forEach((file, index) => {
          const uploadResult = uploadResults[index];
          if (uploadResult?.success) {
            // 文件已经上传成功，不需要重复上传
            alreadyUploadedFiles.push(file);
          } else {
            // 文件未上传或上传失败，需要上传
            filesToUpload.push(file);
          }
        });

        // 如果没有需要上传的文件，直接返回
        if (filesToUpload.length === 0) {
          setIsUploading(false);
          return;
        }

        // 批量上传
        const response = await fileUploadService.uploadFiles(
          filesToUpload,
          additionalData
        );

        // 处理上传结果，合并已上传和新增上传成功的文件
        const newSuccessfulFiles: UploadedFile[] = [];
        const newSuccessfulResults: UploadResponse[] = [];
        const failedFiles: UploadedFile[] = [];

        // 先添加已经上传成功的文件
        alreadyUploadedFiles.forEach((file, index) => {
          const originalIndex = files.indexOf(file);
          const existingResult = uploadResults[originalIndex];
          if (existingResult) {
            newSuccessfulFiles.push(file);
            newSuccessfulResults.push(existingResult);
          }
        });

        // 处理新上传的文件结果
        response.data?.files.forEach((f, uploadIndex) => {
          const file = filesToUpload[uploadIndex];
          if (f.success) {
            newSuccessfulFiles.push(file);
            newSuccessfulResults.push({
              success: true,
              message: "上传成功",
              data: {
                fileId: f.fileId,
                fileName: f.fileName,
                fileUrl: f.fileUrl,
                uploadTime: f.uploadTime,
              },
            });
          } else {
            failedFiles.push(file);
            console.error(`文件上传失败: ${file.name}`, f.error);
          }
        });

        // 更新文件列表，只保留成功的文件
        setSelectedFiles(newSuccessfulFiles);
        setUploadResults(newSuccessfulResults);

        // 更新回调
        onFileSelect?.(newSuccessfulResults);

        // 如果有失败的文件，显示提示
        if (failedFiles.length > 0) {
          Alert.alert(
            "部分文件上传失败",
            `有 ${failedFiles.length} 个文件上传失败，已自动移除`
          );
        }

        onUploadSuccess?.(response);
      } else {
        // 单文件上传
        const file = files[0];
        const response = await fileUploadService.uploadFile(
          file,
          additionalData
        );

        if (response.success) {
          setUploadResults([response]);
          onUploadSuccess?.(response);
        } else {
          // 上传失败，清空文件
          setSelectedFiles([]);
          setUploadResults([]);
          onFileSelect?.([]);

          const errorMessage = response.error || "上传失败";
          Alert.alert("上传失败", errorMessage);
          onUploadError?.(errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "上传失败";

      // 上传异常，清空所有文件
      setSelectedFiles([]);
      setUploadResults([]);
      onFileSelect?.([]);

      Alert.alert("上传失败", errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View>
      {/* 单独的操作按钮 */}
      <View style={styles.actionButtons}>
        <Button
          mode="outlined"
          onPress={() => handleFileSelect("document")}
          disabled={disabled || isUploading}
          style={styles.actionButton}
          icon="file-document"
          compact
        >
          文件
        </Button>
        <Button
          mode="outlined"
          onPress={() => handleFileSelect("gallery")}
          disabled={disabled || isUploading}
          style={styles.actionButton}
          icon="image"
          compact
        >
          相册
        </Button>
        {Platform.OS !== "web" && (
          <Button
            mode="outlined"
            onPress={() => handleFileSelect("camera")}
            disabled={disabled || isUploading}
            style={styles.actionButton}
            icon="camera"
            compact
          >
            拍照
          </Button>
        )}
      </View>

      {/* 上传状态 */}
      {isUploading && (
        <View style={styles.uploadingContainer}>
          <Text style={styles.uploadingText}>上传中...</Text>
        </View>
      )}

      {/* 已选择的文件列表 */}
      {selectedFiles.length > 0 && (
        <View style={styles.filesContainer}>
          <View style={styles.filesHeader}>
            <Text style={styles.filesTitle}>
              已选择文件 ({selectedFiles.length}
              {multiple ? `/${maxFiles}` : ""})
            </Text>
            {selectedFiles.length > 0 && !isUploading && (
              <Button
                mode="text"
                onPress={clearAllFiles}
                textColor="#FF6B6B"
                compact
              >
                清空
              </Button>
            )}
          </View>

          {selectedFiles.map((file, index) => {
            const uploadResult = uploadResults[index];
            return (
              <View key={index} style={styles.fileItem}>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileIcon}>
                    {getFileTypeIcon(file.mimeType || file.type)}
                  </Text>
                  <View style={styles.fileDetails}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {file.name}
                    </Text>
                    <Text style={styles.fileSize}>
                      {getFileSizeText(file.size)}
                    </Text>
                    {uploadResult && (
                      <Text
                        style={[
                          styles.uploadStatus,
                          {
                            color: uploadResult.success ? "#4CAF50" : "#F44336",
                          },
                        ]}
                      >
                        {uploadResult.success
                          ? "✅ 上传成功"
                          : `❌ 上传失败: ${uploadResult.error}`}
                      </Text>
                    )}
                  </View>
                </View>
                {!isUploading && (
                  <IconButton
                    icon="close"
                    size={20}
                    onPress={() => removeFile(index)}
                    iconColor="#FF6B6B"
                  />
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  actionButton: {
    flex: 1,
    minWidth: 80,
  },
  filesContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  filesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  filesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    marginBottom: 8,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  fileIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: "#666",
  },
  // 上传相关样式
  uploadingContainer: {
    marginVertical: 16,
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  uploadingText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  uploadStatus: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
});
