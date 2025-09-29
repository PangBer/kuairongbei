# 文件上传功能使用文档

## 概述

文件上传功能提供了完整的文件选择和上传解决方案，支持多种文件类型、多平台兼容，并包含完整的错误处理和用户反馈机制。

## 功能特性

- ✅ 支持多种文件选择方式（文档、相册、拍照）
- ✅ 单文件和批量文件上传
- ✅ 文件类型和大小验证
- ✅ 上传进度显示和状态反馈
- ✅ 跨平台支持（Web、iOS、Android）
- ✅ 自动权限管理
- ✅ 文件预览和管理
- ✅ 可配置的上传参数

## 核心组件

### FileUpload 组件

主要的文件上传组件，提供完整的用户界面和交互功能。

#### 基本用法

```tsx
import FileUpload from "@/components/FileUpload";

function MyComponent() {
  const handleFileSelect = (file) => {
    console.log("选择的文件:", file);
  };

  const handleUploadSuccess = (response) => {
    console.log("上传成功:", response);
  };

  const handleUploadError = (error) => {
    console.log("上传失败:", error);
  };

  return (
    <FileUpload
      title="上传文件"
      description="请选择要上传的文件"
      onFileSelect={handleFileSelect}
      onUploadSuccess={handleUploadSuccess}
      onUploadError={handleUploadError}
    />
  );
}
```

#### 属性配置

| 属性              | 类型                                                        | 默认值                 | 描述               |
| ----------------- | ----------------------------------------------------------- | ---------------------- | ------------------ |
| `title`           | `string`                                                    | "文件上传"             | 组件标题           |
| `description`     | `string`                                                    | "点击选择要上传的文件" | 组件描述           |
| `config`          | `FileUploadConfig`                                          | -                      | 文件上传配置       |
| `onFileSelect`    | `(file: UploadedFile \| null) => void`                      | -                      | 单文件选择回调     |
| `onFilesSelect`   | `(files: UploadedFile[]) => void`                           | -                      | 多文件选择回调     |
| `onUploadSuccess` | `(response: UploadResponse \| BatchUploadResponse) => void` | -                      | 上传成功回调       |
| `onUploadError`   | `(error: string) => void`                                   | -                      | 上传失败回调       |
| `multiple`        | `boolean`                                                   | `false`                | 是否支持多文件选择 |
| `showPreview`     | `boolean`                                                   | `true`                 | 是否显示文件预览   |
| `maxFiles`        | `number`                                                    | `5`                    | 最大文件数量       |
| `disabled`        | `boolean`                                                   | `false`                | 是否禁用组件       |
| `autoUpload`      | `boolean`                                                   | `false`                | 是否自动上传       |
| `additionalData`  | `Record<string, any>`                                       | -                      | 额外数据           |

#### 文件上传配置

```tsx
interface FileUploadConfig {
  maxFileSize?: number; // 最大文件大小（字节）
  allowedTypes?: string[]; // 允许的文件类型
  quality?: number; // 图片质量 (0-1)
  allowsEditing?: boolean; // 是否允许编辑
}

// 示例配置
const config: FileUploadConfig = {
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
```

### 文件上传服务

#### FileUploadService 类

提供文件上传的核心服务功能。

```tsx
import { fileUploadService } from "@/service/fileUploadService";

// 上传单个文件
const uploadFile = async (file: UploadedFile) => {
  try {
    const response = await fileUploadService.uploadFile(file, {
      userId: "123",
      category: "avatar",
    });

    if (response.success) {
      console.log("文件上传成功:", response.data);
    } else {
      console.error("上传失败:", response.error);
    }
  } catch (error) {
    console.error("上传异常:", error);
  }
};

// 批量上传文件
const uploadFiles = async (files: UploadedFile[]) => {
  try {
    const response = await fileUploadService.uploadFiles(files, {
      batchId: "batch_001",
    });

    console.log("批量上传结果:", response);
  } catch (error) {
    console.error("批量上传异常:", error);
  }
};
```

#### 服务方法

| 方法          | 参数                                                          | 返回值                                         | 描述         |
| ------------- | ------------------------------------------------------------- | ---------------------------------------------- | ------------ |
| `uploadFile`  | `file: UploadedFile, additionalData?: Record<string, any>`    | `Promise<UploadResponse>`                      | 上传单个文件 |
| `uploadFiles` | `files: UploadedFile[], additionalData?: Record<string, any>` | `Promise<BatchUploadResponse>`                 | 批量上传文件 |
| `deleteFile`  | `fileId: string`                                              | `Promise<{success: boolean, message: string}>` | 删除文件     |
| `getFileInfo` | `fileId: string`                                              | `Promise<UploadResponse>`                      | 获取文件信息 |

### 文件选择工具

#### 基础文件选择函数

```tsx
import {
  pickImageFromCamera,
  pickImageFromGallery,
  pickDocument,
  showUploadOptions,
} from "@/utils/fileUpload";

// 从相机拍照
const takePhoto = async () => {
  const file = await pickImageFromCamera({
    quality: 0.8,
    allowsEditing: false,
  });

  if (file) {
    console.log("拍照成功:", file);
  }
};

// 从相册选择
const selectFromGallery = async () => {
  const file = await pickImageFromGallery({
    quality: 0.8,
    allowsEditing: true,
  });

  if (file) {
    console.log("选择图片:", file);
  }
};

// 选择文档
const selectDocument = async () => {
  const file = await pickDocument({
    allowedTypes: ["application/pdf", "image/*"],
  });

  if (file) {
    console.log("选择文档:", file);
  }
};

// 显示选择选项
const showOptions = async () => {
  const file = await showUploadOptions({
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/*", "application/pdf"],
  });

  if (file) {
    console.log("选择的文件:", file);
  }
};
```

## 使用场景

### 1. 头像上传

```tsx
function AvatarUpload() {
  const [avatar, setAvatar] = useState(null);

  const handleAvatarSelect = (file) => {
    setAvatar(file);
  };

  const handleUploadSuccess = (response) => {
    if (response.success) {
      // 更新用户头像
      updateUserAvatar(response.data.fileUrl);
    }
  };

  return (
    <FileUpload
      title="上传头像"
      description="选择一张图片作为您的头像"
      config={{
        maxFileSize: 2 * 1024 * 1024, // 2MB
        allowedTypes: ["image/*"],
        quality: 0.9,
        allowsEditing: true,
      }}
      onFileSelect={handleAvatarSelect}
      onUploadSuccess={handleUploadSuccess}
      showPreview={true}
    />
  );
}
```

### 2. 文档批量上传

```tsx
function DocumentUpload() {
  const handleFilesSelect = (files) => {
    console.log("选择的文档:", files);
  };

  const handleUploadSuccess = (response) => {
    console.log("批量上传结果:", response);
  };

  return (
    <FileUpload
      title="上传文档"
      description="选择要上传的文档文件"
      multiple={true}
      maxFiles={10}
      config={{
        maxFileSize: 20 * 1024 * 1024, // 20MB
        allowedTypes: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ],
      }}
      onFilesSelect={handleFilesSelect}
      onUploadSuccess={handleUploadSuccess}
    />
  );
}
```

### 3. 图片相册上传

```tsx
function ImageGalleryUpload() {
  const handleFilesSelect = (files) => {
    console.log("选择的图片:", files);
  };

  return (
    <FileUpload
      title="上传图片"
      description="选择要上传的图片"
      multiple={true}
      maxFiles={20}
      config={{
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ["image/*"],
        quality: 0.8,
        allowsEditing: true,
      }}
      onFilesSelect={handleFilesSelect}
    />
  );
}
```

## 平台差异

### Web 端

- ✅ 支持文件选择器
- ✅ 支持相册图片选择
- ❌ 不支持相机拍照
- ✅ 支持拖拽上传（通过文件选择器）

### App 端（iOS/Android）

- ✅ 支持文件选择器
- ✅ 支持相册图片选择（可编辑）
- ✅ 支持相机拍照
- ✅ 自动权限管理

## 错误处理

### 常见错误类型

1. **权限错误**

   ```tsx
   // 自动处理权限请求
   const hasPermission = await requestCameraPermission();
   if (!hasPermission) {
     Alert.alert("权限不足", "需要相机权限才能拍照");
   }
   ```

2. **文件大小超限**

   ```tsx
   // 自动验证文件大小
   if (file.size > config.maxFileSize) {
     Alert.alert(
       "文件过大",
       `文件大小不能超过 ${Math.round(config.maxFileSize / 1024 / 1024)}MB`
     );
   }
   ```

3. **文件类型不支持**

   ```tsx
   // 自动验证文件类型
   const isAllowed = config.allowedTypes.some((type) => {
     if (type.endsWith("/*")) {
       return file.mimeType.startsWith(type.slice(0, -1));
     }
     return file.mimeType === type;
   });
   ```

4. **网络错误**
   ```tsx
   try {
     const response = await fileUploadService.uploadFile(file);
   } catch (error) {
     console.error("上传失败:", error);
     Alert.alert("上传失败", "网络连接异常，请重试");
   }
   ```

## 最佳实践

### 1. 配置合理的文件限制

```tsx
const config = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ["image/*", "application/pdf"],
  quality: 0.8,
};
```

### 2. 提供用户反馈

```tsx
const handleUploadSuccess = (response) => {
  if (response.success) {
    showSuccessToast("上传成功", "文件已成功上传");
  } else {
    showErrorToast("上传失败", response.error);
  }
};
```

### 3. 处理上传进度

```tsx
const [uploadProgress, setUploadProgress] = useState(0);

// 在组件中显示上传进度
{
  isUploading && (
    <View>
      <Text>上传中... {uploadProgress}%</Text>
      <ProgressBar progress={uploadProgress / 100} />
    </View>
  );
}
```

### 4. 文件预览功能

```tsx
const [selectedFiles, setSelectedFiles] = useState([]);

// 显示文件预览
{
  selectedFiles.map((file, index) => (
    <View key={index} style={styles.filePreview}>
      <Text>{getFileTypeIcon(file.mimeType)}</Text>
      <Text>{file.name}</Text>
      <Text>{getFileSizeText(file.size)}</Text>
    </View>
  ));
}
```

## 注意事项

1. **权限管理**: 确保在 App 端正确配置相机和相册权限
2. **文件大小**: 根据实际需求设置合理的文件大小限制
3. **网络环境**: 考虑网络不稳定情况下的重试机制
4. **用户体验**: 提供清晰的上传状态反馈
5. **安全性**: 验证文件类型，防止恶意文件上传
6. **性能优化**: 大文件上传时考虑分片上传

## 相关文件

- `components/FileUpload.tsx` - 主组件
- `service/fileUploadService.ts` - 上传服务
- `utils/fileUpload.ts` - 工具函数
- `store/slices/toastSlice.ts` - Toast 状态管理
