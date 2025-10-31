import { ThemedText } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useToastActions } from "@/store/hooks";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useMemo, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";

import {
  BatchUploadResponse,
  fileUploadService,
  UploadResponse,
} from "@/service/fileUploadService";

import {
  FileUploadConfig,
  getFileSizeText,
  pickDocument,
  pickImageFromCamera,
  pickImageFromGallery,
  UploadedFile,
} from "@/utils/fileUpload";

/**
 * 根据文件 MIME 类型返回对应的 AntDesign 图标名称
 * @param mimeType - 文件的 MIME 类型
 * @returns AntDesign 图标名称
 */
const getFileTypeIconName = (
  mimeType: string
): keyof typeof AntDesign.glyphMap => {
  if (mimeType.startsWith("image/")) {
    return "picture";
  } else if (mimeType.includes("pdf")) {
    return "file-pdf";
  } else if (mimeType.includes("word") || mimeType.includes("document")) {
    return "file-word";
  } else if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) {
    return "file-excel";
  } else if (
    mimeType.includes("powerpoint") ||
    mimeType.includes("presentation")
  ) {
    return "file-ppt";
  }
  return "file";
};

interface FileUploadProps {
  config?: FileUploadConfig; // 文件上传配置
  onFileSelect?: (files: UploadResponse[]) => void; // 文件选择回调
  onUploadSuccess?: (response: UploadResponse | BatchUploadResponse) => void; // 上传成功回调
  onUploadError?: (error: string) => void; // 上传失败回调
  multiple?: boolean; // 是否支持多选
  showPreview?: boolean; // 是否显示预览（预留）
  maxFiles?: number; // 最大文件数量
  disabled?: boolean; // 是否禁用
  autoUpload?: boolean; // 是否自动上传
  additionalData?: Record<string, any>; // 额外数据
  allowedSources?: Array<"camera" | "gallery" | "document">; // 允许的文件来源
  buttonTitle?: string; // 上传按钮标题
}

/**
 * 文件上传组件
 * 支持单文件/多文件上传，支持相机、相册、文档选择
 */
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
  allowedSources,
  buttonTitle = "上传文件",
}: FileUploadProps) {
  // 状态管理
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<UploadResponse[]>([]);
  const [sourceSheetVisible, setSourceSheetVisible] = useState(false);

  // 主题和工具
  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background"
  );
  const { showError, showInfo } = useToastActions();

  // 计算有效的文件来源（根据平台和配置）
  const effectiveSources = useMemo<Array<"camera" | "gallery" | "document">>(
    () =>
      allowedSources && allowedSources.length > 0
        ? allowedSources
        : Platform.OS === "web"
        ? ["document", "gallery"]
        : ["document", "gallery", "camera"],
    [allowedSources]
  );

  /**
   * 处理文件选择
   * @param source - 文件来源（相机/相册/文档）
   */
  const handleFileSelect = async (
    source: "camera" | "gallery" | "document"
  ) => {
    if (disabled) return;

    try {
      let result: UploadedFile | UploadedFile[] | null = null;
      const isMultipleSelection = multiple && maxFiles > 1;

      // 根据来源选择文件
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

      if (!result) return;

      if (multiple) {
        // 多文件模式：合并新选择的文件
        const newFiles = Array.isArray(result)
          ? [...selectedFiles, ...result]
          : [...selectedFiles, result];

        // 限制文件数量
        if (newFiles.length > maxFiles) {
          showInfo("系统提醒", `最多只能选择 ${maxFiles} 个文件`);
          newFiles.splice(maxFiles, newFiles.length - maxFiles);
        }

        setSelectedFiles(newFiles);

        // 自动上传
        if (autoUpload) {
          await uploadFiles(newFiles);
        }
      } else {
        // 单文件模式：替换现有文件
        const file = Array.isArray(result) ? result[0] : result;
        setSelectedFiles([file]);

        // 自动上传
        if (autoUpload) {
          await uploadFiles([file]);
        }
      }
    } catch (error) {
      console.error("文件选择失败:", error);
      showError("系统错误", "文件选择过程中出现错误");
    }
  };

  /**
   * 移除指定索引的文件
   * @param index - 文件索引
   */
  const removeFile = async (index: number) => {
    const uploadResult = uploadResults[index];

    // 如果文件已上传成功，调用删除接口
    if (uploadResult?.success && uploadResult.data?.fileId) {
      try {
        await fileUploadService.deleteFile(uploadResult.data.fileId);
        console.log("文件删除成功:", uploadResult.data.fileId);
      } catch (error) {
        console.error("文件删除失败:", error);
        showError("系统错误", "文件删除失败");
      }
    }

    // 从本地状态中移除文件
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUploadResults = uploadResults.filter((_, i) => i !== index);

    setSelectedFiles(newFiles);
    setUploadResults(newUploadResults);
    onFileSelect?.(newUploadResults);
  };

  /**
   * 清空所有文件
   */
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
      } catch (error) {
        showError("系统错误", "批量删除文件失败");
      }
    }

    // 清空本地状态
    setSelectedFiles([]);
    setUploadResults([]);
    onFileSelect?.([]);
  };

  /**
   * 上传文件（支持单文件和多文件批量上传）
   * @param files - 要上传的文件数组
   */
  const uploadFiles = async (files: UploadedFile[]) => {
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      if (multiple) {
        // 批量上传模式
        await uploadMultipleFiles(files);
      } else {
        // 单文件上传模式
        await uploadSingleFile(files[0]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "上传失败";
      // 上传异常，清空所有文件
      setSelectedFiles([]);
      setUploadResults([]);
      onFileSelect?.([]);
      showError("系统错误", errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * 批量上传文件
   * @param files - 文件数组
   */
  const uploadMultipleFiles = async (files: UploadedFile[]) => {
    // 分离已上传和待上传的文件
    const filesToUpload: UploadedFile[] = [];
    const alreadyUploadedFiles: UploadedFile[] = [];

    files.forEach((file, index) => {
      const uploadResult = uploadResults[index];
      if (uploadResult?.success) {
        alreadyUploadedFiles.push(file);
      } else {
        filesToUpload.push(file);
      }
    });

    // 如果没有需要上传的文件，直接返回
    if (filesToUpload.length === 0) {
      return;
    }

    // 执行批量上传
    const response = await fileUploadService.uploadFiles(
      filesToUpload,
      additionalData
    );

    // 处理上传结果
    const newSuccessfulFiles: UploadedFile[] = [];
    const newSuccessfulResults: UploadResponse[] = [];
    const failedFiles: UploadedFile[] = [];

    // 添加已上传成功的文件
    alreadyUploadedFiles.forEach((file) => {
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

    // 更新状态
    setSelectedFiles(newSuccessfulFiles);
    setUploadResults(newSuccessfulResults);
    onFileSelect?.(newSuccessfulResults);

    // 提示失败文件
    if (failedFiles.length > 0) {
      showInfo(
        "系统提醒",
        `有 ${failedFiles.length} 个文件上传失败，已自动移除`
      );
    }

    onUploadSuccess?.(response);
  };

  /**
   * 单文件上传
   * @param file - 文件对象
   */
  const uploadSingleFile = async (file: UploadedFile) => {
    const response = await fileUploadService.uploadFile(file, additionalData);

    if (response.success) {
      setUploadResults([response]);
      onUploadSuccess?.(response);
    } else {
      // 上传失败，清空文件
      setSelectedFiles([]);
      setUploadResults([]);
      onFileSelect?.([]);
      const errorMessage = response.error || "上传失败";
      showError("系统错误", errorMessage);
      onUploadError?.(errorMessage);
    }
  };

  return (
    <View>
      {/* 上传触发按钮 */}
      <Button
        mode="contained"
        onPress={() => setSourceSheetVisible(true)}
        disabled={disabled || isUploading}
        icon={() => <AntDesign name="upload" size={20} color="#FFFFFF" />}
      >
        {isUploading ? "上传中..." : buttonTitle}
      </Button>

      {/* 文件来源选择弹窗 */}
      <Portal>
        <Modal
          visible={sourceSheetVisible}
          onDismiss={() => setSourceSheetVisible(false)}
          contentContainerStyle={[
            styles.bottomSheet,
            { backgroundColor: backgroundColor },
          ]}
        >
          <View style={styles.sheetHandle} />
          <ThemedText style={styles.sheetTitle}>选择上传来源</ThemedText>
          <View style={styles.sheetOptions}>
            {effectiveSources.includes("document") && (
              <Button
                mode="outlined"
                icon={() => <AntDesign name="file" size={20} color="#4a9aff" />}
                style={styles.sheetOptionButton}
                onPress={async () => {
                  setSourceSheetVisible(false);
                  await handleFileSelect("document");
                }}
              >
                文件
              </Button>
            )}
            {effectiveSources.includes("gallery") && (
              <Button
                mode="outlined"
                icon={() => (
                  <AntDesign name="picture" size={20} color="#4a9aff" />
                )}
                style={styles.sheetOptionButton}
                onPress={async () => {
                  setSourceSheetVisible(false);
                  await handleFileSelect("gallery");
                }}
              >
                相册
              </Button>
            )}
            {effectiveSources.includes("camera") && Platform.OS !== "web" && (
              <Button
                mode="outlined"
                icon={() => (
                  <AntDesign name="camera" size={20} color="#4a9aff" />
                )}
                style={styles.sheetOptionButton}
                onPress={async () => {
                  setSourceSheetVisible(false);
                  await handleFileSelect("camera");
                }}
              >
                拍照
              </Button>
            )}
          </View>
          <Button
            mode="text"
            onPress={() => setSourceSheetVisible(false)}
            textColor="#4a9aff"
          >
            取消
          </Button>
        </Modal>
      </Portal>

      {/* 已选择文件列表 */}
      {selectedFiles.length > 0 && (
        <View style={styles.filesContainer}>
          <View style={styles.filesHeader}>
            <ThemedText style={styles.filesTitle}>
              已选择文件 ({selectedFiles.length}
              {multiple ? `/${maxFiles}` : ""})
            </ThemedText>
            {selectedFiles.length > 0 && !isUploading && (
              <Button
                mode="text"
                onPress={clearAllFiles}
                textColor="#ff6b6b"
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
                  <View style={styles.fileIconContainer}>
                    <AntDesign
                      name={getFileTypeIconName(file.mimeType || file.type)}
                      size={24}
                      color="#4a9aff"
                    />
                  </View>
                  <View style={styles.fileDetails}>
                    <ThemedText style={styles.fileName} numberOfLines={1}>
                      {file.name}
                    </ThemedText>
                    <View style={styles.fileSizeContainer}>
                      {uploadResult && (
                        <Text
                          style={[
                            styles.uploadStatus,
                            {
                              color: uploadResult.success
                                ? "#4CAF50"
                                : "#ff6b6b",
                            },
                          ]}
                        >
                          {uploadResult.success
                            ? "上传成功"
                            : `上传失败: ${uploadResult.error}`}
                        </Text>
                      )}
                      <ThemedText style={styles.fileSize}>
                        {getFileSizeText(file.size)}
                      </ThemedText>
                    </View>
                  </View>
                </View>
                {!isUploading && (
                  <TouchableOpacity
                    onPress={() => removeFile(index)}
                    style={styles.closeIcon}
                    activeOpacity={0.7}
                  >
                    <AntDesign name="close" size={20} color="#ff6b6b" />
                  </TouchableOpacity>
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
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#e0e0e0",
    alignSelf: "center",
    borderRadius: 2,
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  sheetOptions: {
    flexDirection: "column",
    gap: 8,
    marginBottom: 8,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  sheetOptionButton: {
    flex: 1,
    minWidth: "100%",
    marginBottom: 12,
    borderRadius: 12,
    borderColor: "#4a9aff",
  },
  filesContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
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
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    marginBottom: 8,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  fileIconContainer: {
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    padding: 4,
  },
  fileDetails: {
    flex: 1,
  },
  fileSizeContainer: {
    flexDirection: "row",
    gap: 10,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
    color: "#666666",
  },
  uploadStatus: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
});
