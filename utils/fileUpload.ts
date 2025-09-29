import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Alert, Platform } from "react-native";

/**
 * 文件上传配置
 */
export interface FileUploadConfig {
  maxFileSize?: number; // 最大文件大小（字节）
  allowedTypes?: string[]; // 允许的文件类型
  quality?: number; // 图片质量 (0-1)
  allowsEditing?: boolean; // 是否允许编辑
}

/**
 * 上传的文件信息
 */
export interface UploadedFile {
  uri: string;
  name: string;
  type: string;
  size: number;
  mimeType?: string;
}

/**
 * 上传选项
 */
export interface UploadOptions {
  source: "camera" | "gallery" | "document";
  config?: FileUploadConfig;
}

// 默认配置
const defaultConfig: FileUploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    "image/*",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  quality: 0.8,
  allowsEditing: true,
};

/**
 * 请求相机权限
 */
export const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS === "web") {
    return true; // Web端不需要权限
  }

  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === "granted";
};

/**
 * 请求媒体库权限
 */
export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  if (Platform.OS === "web") {
    return true; // Web端不需要权限
  }

  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === "granted";
};

/**
 * 验证文件
 */
const validateFile = (
  file: UploadedFile,
  config: FileUploadConfig
): boolean => {
  // 检查文件大小
  if (file.size > config.maxFileSize!) {
    Alert.alert(
      "文件过大",
      `文件大小不能超过 ${Math.round(config.maxFileSize! / 1024 / 1024)}MB`
    );
    return false;
  }

  // 检查文件类型
  if (config.allowedTypes && config.allowedTypes.length > 0) {
    const fileType = file.mimeType || file.type;
    const isAllowed = config.allowedTypes.some((type) => {
      if (type.endsWith("/*")) {
        return fileType.startsWith(type.slice(0, -1));
      }
      return fileType === type;
    });

    if (!isAllowed) {
      Alert.alert(
        "文件类型不支持",
        `只支持以下文件类型：${config.allowedTypes.join(", ")}`
      );
      return false;
    }
  }

  return true;
};

/**
 * 从相机拍照
 */
export const pickImageFromCamera = async (
  config: FileUploadConfig = defaultConfig
): Promise<UploadedFile | null> => {
  if (Platform.OS === "web") {
    Alert.alert("提示", "Web端不支持相机拍照功能");
    return null;
  }

  const hasPermission = await requestCameraPermission();
  if (!hasPermission) {
    Alert.alert("权限不足", "需要相机权限才能拍照");
    return null;
  }

  try {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: false, // 拍照时不允许编辑，直接拍照上传
      quality: config.quality,
      exif: false,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];
    const file: UploadedFile = {
      uri: asset.uri,
      name: asset.fileName || `camera_${Date.now()}.jpg`,
      type: "image/jpeg",
      size: asset.fileSize || 0,
      mimeType: "image/jpeg",
    };

    if (!validateFile(file, config)) {
      return null;
    }

    return file;
  } catch (error) {
    console.error("拍照失败:", error);
    Alert.alert("拍照失败", "无法打开相机，请重试");
    return null;
  }
};

/**
 * 从相册选择图片
 */
export const pickImageFromGallery = async (
  config: FileUploadConfig = defaultConfig
): Promise<UploadedFile | null> => {
  const hasPermission = await requestMediaLibraryPermission();
  if (!hasPermission) {
    Alert.alert("权限不足", "需要相册权限才能选择图片");
    return null;
  }

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: config.allowsEditing,
      quality: config.quality,
      exif: false,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];
    const file: UploadedFile = {
      uri: asset.uri,
      name: asset.fileName || `gallery_${Date.now()}.jpg`,
      type: "image/jpeg",
      size: asset.fileSize || 0,
      mimeType: "image/jpeg",
    };

    if (!validateFile(file, config)) {
      return null;
    }

    return file;
  } catch (error) {
    console.error("选择图片失败:", error);
    Alert.alert("选择失败", "无法打开相册，请重试");
    return null;
  }
};

/**
 * 选择文档文件
 */
export const pickDocument = async (
  config: FileUploadConfig = defaultConfig
): Promise<UploadedFile | null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: config.allowedTypes?.join(",") || "*/*",
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];
    const file: UploadedFile = {
      uri: asset.uri,
      name: asset.name,
      type: asset.mimeType || "application/octet-stream",
      size: asset.size || 0,
      mimeType: asset.mimeType,
    };

    if (!validateFile(file, config)) {
      return null;
    }

    return file;
  } catch (error) {
    console.error("选择文档失败:", error);
    Alert.alert("选择失败", "无法打开文件选择器，请重试");
    return null;
  }
};

/**
 * 显示上传选项菜单
 */
export const showUploadOptions = async (
  config: FileUploadConfig = defaultConfig
): Promise<UploadedFile | null> => {
  return new Promise((resolve) => {
    const options = [
      { text: "选择文件", onPress: () => pickDocument(config).then(resolve) },
      {
        text: "选择图片",
        onPress: () => pickImageFromGallery(config).then(resolve),
      },
    ];

    // App端添加拍照选项
    if (Platform.OS !== "web") {
      options.push({
        text: "拍照上传",
        onPress: () => pickImageFromCamera(config).then(resolve),
      });
    }

    options.push({
      text: "取消",
      onPress: () => Promise.resolve(resolve(null)),
    });

    Alert.alert("选择上传方式", "请选择您要上传的内容", options);
  });
};

/**
 * 获取文件大小显示文本
 */
export const getFileSizeText = (size: number): string => {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  } else {
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  }
};

/**
 * 获取文件类型图标
 */
export const getFileTypeIcon = (mimeType: string): string => {
  if (mimeType.startsWith("image/")) {
    return "🖼️";
  } else if (mimeType.includes("pdf")) {
    return "📄";
  } else if (mimeType.includes("word") || mimeType.includes("document")) {
    return "📝";
  } else if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) {
    return "📊";
  } else if (
    mimeType.includes("powerpoint") ||
    mimeType.includes("presentation")
  ) {
    return "📈";
  } else {
    return "📎";
  }
};
