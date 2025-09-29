import React, { useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, View } from "react-native";
import { Card, Chip, Divider, Text } from "react-native-paper";

import FileUpload from "@/components/FileUpload";
import { FileUploadConfig, UploadedFile } from "@/utils/fileUpload";

export default function FileUploadDemo() {
  const [singleFile, setSingleFile] = useState<UploadedFile | null>(null);
  const [multipleFiles, setMultipleFiles] = useState<UploadedFile[]>([]);
  const [imageFiles, setImageFiles] = useState<UploadedFile[]>([]);

  // 文件上传配置
  const defaultConfig: FileUploadConfig = {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/*", "application/pdf"],
    quality: 0.8,
    allowsEditing: true,
  };

  const imageConfig: FileUploadConfig = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/*"],
    quality: 0.9,
    allowsEditing: true,
  };

  const documentConfig: FileUploadConfig = {
    maxFileSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    quality: 1.0,
    allowsEditing: false,
  };

  // 处理文件上传成功
  const handleUploadSuccess = (response: any) => {
    console.log("上传成功:", response);
    Alert.alert("上传成功", response.message || "文件上传成功");
  };

  // 处理文件上传错误
  const handleUploadError = (error: string) => {
    console.error("上传失败:", error);
    Alert.alert("上传失败", error);
  };

  // 处理上传进度
  const handleUploadProgress = (progress: number) => {
    console.log("上传进度:", progress);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>文件上传演示</Text>
      <Text style={styles.description}>
        演示跨平台文件上传功能，支持Web端和App端的不同上传方式
      </Text>

      {/* 平台信息 */}
      <Card style={styles.platformCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>当前平台</Text>
          <View style={styles.platformInfo}>
            <Chip
              icon={Platform.OS === "web" ? "web" : "cellphone"}
              style={styles.platformChip}
            >
              {Platform.OS === "web" ? "Web端" : "App端"}
            </Chip>
            <Text style={styles.platformText}>
              {Platform.OS === "web"
                ? "支持：文件选择、相册图片"
                : "支持：文件选择、相册图片、拍照上传"}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* 单文件上传 */}
      <FileUpload
        title="单文件上传"
        description="选择一个文件进行上传"
        config={defaultConfig}
        onFileSelect={setSingleFile}
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
        onUploadProgress={handleUploadProgress}
        showPreview={true}
        additionalData={{ category: "demo", userId: "123" }}
      />

      {/* 显示选中的单文件 */}
      {singleFile && (
        <Card style={styles.resultCard}>
          <Card.Content>
            <Text style={styles.resultTitle}>已选择的文件</Text>
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>{singleFile.name}</Text>
              <Text style={styles.fileDetails}>
                大小: {(singleFile.size / 1024 / 1024).toFixed(2)} MB | 类型:{" "}
                {singleFile.mimeType || singleFile.type}
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}

      <Divider style={styles.divider} />

      {/* 多文件上传 */}
      <FileUpload
        title="多文件上传"
        description="选择多个文件进行上传（最多5个）"
        config={defaultConfig}
        multiple={true}
        maxFiles={5}
        onFilesSelect={setMultipleFiles}
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
        onUploadProgress={handleUploadProgress}
        showPreview={true}
        additionalData={{ category: "batch", userId: "123" }}
      />

      {/* 显示选中的多文件 */}
      {multipleFiles.length > 0 && (
        <Card style={styles.resultCard}>
          <Card.Content>
            <Text style={styles.resultTitle}>
              已选择的文件 ({multipleFiles.length})
            </Text>
            {multipleFiles.map((file, index) => (
              <View key={index} style={styles.fileItem}>
                <Text style={styles.fileName}>{file.name}</Text>
                <Text style={styles.fileDetails}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      <Divider style={styles.divider} />

      {/* 图片专用上传 */}
      <FileUpload
        title="图片上传"
        description="专门用于上传图片文件"
        config={imageConfig}
        multiple={true}
        maxFiles={3}
        onFilesSelect={setImageFiles}
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
        onUploadProgress={handleUploadProgress}
        showPreview={true}
        additionalData={{ category: "image", userId: "123" }}
      />

      {/* 显示选中的图片 */}
      {imageFiles.length > 0 && (
        <Card style={styles.resultCard}>
          <Card.Content>
            <Text style={styles.resultTitle}>
              已选择的图片 ({imageFiles.length})
            </Text>
            {imageFiles.map((file, index) => (
              <View key={index} style={styles.fileItem}>
                <Text style={styles.fileName}>{file.name}</Text>
                <Text style={styles.fileDetails}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      <Divider style={styles.divider} />

      {/* 文档专用上传 */}
      <FileUpload
        title="文档上传"
        description="专门用于上传文档文件（PDF、Word等）"
        config={documentConfig}
        multiple={false}
        onFileSelect={(file) => {
          if (file) {
            setSingleFile(file);
          }
        }}
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
        onUploadProgress={handleUploadProgress}
        showPreview={true}
        additionalData={{ category: "document", userId: "123" }}
      />

      {/* 使用说明 */}
      <Card style={styles.helpCard}>
        <Card.Content>
          <Text style={styles.helpTitle}>使用说明</Text>
          <Text style={styles.helpText}>
            <Text style={styles.helpSection}>Web端功能：</Text>
            {"\n"}• 点击"选择文件"按钮选择任意文件{"\n"}•
            点击"文件"按钮选择文档文件{"\n"}• 点击"相册"按钮选择图片文件{"\n\n"}
            <Text style={styles.helpSection}>App端功能：</Text>
            {"\n"}• 点击"选择文件"按钮选择任意文件{"\n"}•
            点击"文件"按钮选择文档文件{"\n"}•
            点击"相册"按钮选择图片文件（可编辑）{"\n"}•
            点击"拍照"按钮直接拍照上传（无编辑步骤）{"\n\n"}
            <Text style={styles.helpSection}>注意事项：</Text>
            {"\n"}• 文件大小限制根据配置而定{"\n"}• 支持的文件类型根据配置而定
            {"\n"}• 多文件上传有数量限制{"\n"}• 相册图片可选择编辑，拍照直接上传
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  platformCard: {
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  platformInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  platformChip: {
    backgroundColor: "#E3F2FD",
  },
  platformText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  resultCard: {
    marginTop: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  fileInfo: {
    marginBottom: 16,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  fileDetails: {
    fontSize: 12,
    color: "#666",
  },
  fileItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  uploadButton: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 24,
  },
  helpCard: {
    marginTop: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  helpText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  helpSection: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1976D2",
  },
});
