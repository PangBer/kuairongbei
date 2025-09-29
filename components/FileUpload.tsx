import React, { useState } from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";
import { Button, Card, IconButton, Text } from "react-native-paper";

import {
  BatchUploadResponse,
  fileUploadService,
  UploadResponse,
} from "@/service/fileUploadService";
import {
  FileUploadConfig,
  getFileSizeText,
  getFileTypeIcon,
  pickDocument,
  pickImageFromCamera,
  pickImageFromGallery,
  showUploadOptions,
  UploadedFile,
} from "@/utils/fileUpload";

interface FileUploadProps {
  title?: string;
  description?: string;
  config?: FileUploadConfig;
  onFileSelect?: (file: UploadedFile | null) => void;
  onFilesSelect?: (files: UploadedFile[]) => void;
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
  title = "文件上传",
  description = "点击选择要上传的文件",
  config,
  onFileSelect,
  onFilesSelect,
  onUploadSuccess,
  onUploadError,
  multiple = false,
  showPreview = true,
  maxFiles = 5,
  disabled = false,
  autoUpload = false,
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

    setIsUploading(true);
    let file: UploadedFile | null = null;

    try {
      switch (source) {
        case "camera":
          file = await pickImageFromCamera(config);
          break;
        case "gallery":
          file = await pickImageFromGallery(config);
          break;
        case "document":
          file = await pickDocument(config);
          break;
      }

      if (file) {
        if (multiple) {
          const newFiles = [...selectedFiles, file];
          if (newFiles.length > maxFiles) {
            Alert.alert("文件数量超限", `最多只能选择 ${maxFiles} 个文件`);
            return;
          }
          setSelectedFiles(newFiles);
          onFilesSelect?.(newFiles);
        } else {
          setSelectedFiles([file]);
          onFileSelect?.(file);
        }
      }
    } catch (error) {
      console.error("文件选择失败:", error);
      Alert.alert("选择失败", "文件选择过程中出现错误");
    } finally {
      setIsUploading(false);
    }
  };

  // 显示上传选项
  const handleShowOptions = async () => {
    if (disabled) return;

    const file = await showUploadOptions(config);
    if (file) {
      if (multiple) {
        const newFiles = [...selectedFiles, file];
        if (newFiles.length > maxFiles) {
          Alert.alert("文件数量超限", `最多只能选择 ${maxFiles} 个文件`);
          return;
        }
        setSelectedFiles(newFiles);
        onFilesSelect?.(newFiles);
      } else {
        setSelectedFiles([file]);
        onFileSelect?.(file);
      }
    }
  };

  // 移除文件
  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    if (multiple) {
      onFilesSelect?.(newFiles);
    } else {
      onFileSelect?.(newFiles[0] || null);
    }
  };

  // 清空所有文件
  const clearAllFiles = () => {
    setSelectedFiles([]);
    setUploadResults([]);
    if (multiple) {
      onFilesSelect?.([]);
    } else {
      onFileSelect?.(null);
    }
  };

  // 上传文件
  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      Alert.alert("提示", "请先选择要上传的文件");
      return;
    }

    setIsUploading(true);

    try {
      if (multiple) {
        // 批量上传
        const response = await fileUploadService.uploadFiles(
          selectedFiles,
          additionalData
        );

        setUploadResults(
          response.data?.files.map((f) => ({
            success: f.success,
            message: f.success ? "上传成功" : "上传失败",
            data: f.success
              ? {
                  fileId: f.fileId,
                  fileName: f.fileName,
                  fileUrl: f.fileUrl,
                  fileSize: f.fileSize,
                  fileType: f.fileType,
                  uploadTime: f.uploadTime,
                }
              : undefined,
            error: f.error,
          })) || []
        );

        onUploadSuccess?.(response);
      } else {
        // 单文件上传
        const file = selectedFiles[0];
        const response = await fileUploadService.uploadFile(
          file,
          additionalData
        );

        setUploadResults([response]);
        onUploadSuccess?.(response);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "上传失败";
      Alert.alert("上传失败", errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card style={styles.container}>
      <Card.Content style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        {/* 上传按钮区域 */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleShowOptions}
            loading={isUploading}
            disabled={disabled || isUploading}
            style={styles.uploadButton}
            icon="upload"
          >
            {isUploading ? "选择中..." : "选择文件"}
          </Button>

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
        </View>

        {/* 上传状态 */}
        {isUploading && (
          <View style={styles.uploadingContainer}>
            <Text style={styles.uploadingText}>上传中...</Text>
          </View>
        )}

        {/* 上传按钮 */}
        {selectedFiles.length > 0 && !isUploading && (
          <View style={styles.uploadContainer}>
            <Button
              mode="contained"
              onPress={uploadFiles}
              style={styles.uploadButton}
              icon="cloud-upload"
            >
              上传文件
            </Button>
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
                              color: uploadResult.success
                                ? "#4CAF50"
                                : "#F44336",
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

        {/* 平台提示 */}
        <View style={styles.platformTip}>
          <Text style={styles.tipText}>
            {Platform.OS === "web"
              ? "Web端支持：文件选择、相册图片"
              : "App端支持：文件选择、相册图片（可编辑）、拍照上传（直接拍照）"}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  buttonContainer: {
    marginBottom: 16,
  },
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
  platformTip: {
    marginTop: 12,
    padding: 8,
    backgroundColor: "#E3F2FD",
    borderRadius: 6,
  },
  tipText: {
    fontSize: 12,
    color: "#1976D2",
    textAlign: "center",
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
  uploadContainer: {
    marginVertical: 16,
    alignItems: "center",
  },
  uploadButton: {
    minWidth: 120,
  },
  uploadStatus: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
});
