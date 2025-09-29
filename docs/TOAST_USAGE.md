# Toast 消息提示功能使用文档

## 概述

Toast 消息提示功能提供了完整的用户反馈解决方案，支持多种消息类型、动画效果、自动关闭和自定义操作，帮助开发者快速实现优雅的用户提示界面。

## 功能特性

- ✅ 支持多种消息类型（成功、错误、警告、信息）
- ✅ 流畅的进入和退出动画
- ✅ 自动关闭和手动关闭
- ✅ 支持自定义操作按钮
- ✅ 全局状态管理
- ✅ 可配置的显示时长
- ✅ 响应式设计
- ✅ 支持回调函数

## 核心组件

### Toast 组件

单个 Toast 消息的显示组件，负责消息的渲染和动画效果。

#### 基本结构

```tsx
import Toast from "@/components/Toast";

function ToastExample() {
  const toast = {
    id: "1",
    type: "success",
    title: "操作成功",
    message: "您的操作已完成",
    duration: 3000,
  };

  const handleRemove = (id) => {
    console.log("移除 Toast:", id);
  };

  return <Toast toast={toast} onRemove={handleRemove} />;
}
```

### ToastContainer 组件

Toast 消息的容器组件，负责管理多个 Toast 消息的显示和移除。

#### 基本用法

```tsx
import ToastContainer from "@/components/ToastContainer";

function App() {
  return (
    <View>
      {/* 你的应用内容 */}
      <YourAppContent />

      {/* Toast 容器 */}
      <ToastContainer />
    </View>
  );
}
```

## 状态管理

### Toast Slice

使用 Redux Toolkit 管理 Toast 状态。

#### 状态结构

```tsx
interface ToastState {
  toasts: ToastItem[];
  isVisible: boolean;
}

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  position?: "top" | "bottom" | "center";
  action?: {
    label: string;
    onPress: () => void;
  };
  onClose?: () => void;
}

type ToastType = "success" | "error" | "warning" | "info";
```

### 使用 Hooks

#### useToast Hook

获取 Toast 状态信息。

```tsx
import { useToast } from "@/store/hooks";

function MyComponent() {
  const { toasts, isVisible } = useToast();

  return (
    <View>
      <Text>当前有 {toasts.length} 个 Toast</Text>
      <Text>Toast 可见性: {isVisible ? "可见" : "隐藏"}</Text>
    </View>
  );
}
```

#### useToastActions Hook

获取 Toast 操作方法。

```tsx
import { useToastActions } from "@/store/hooks";

function MyComponent() {
  const {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showToast,
    removeToast,
    clearAllToasts,
  } = useToastActions();

  const handleShowSuccess = () => {
    showSuccess("操作成功", "您的操作已完成");
  };

  const handleShowError = () => {
    showError("操作失败", "请检查网络连接后重试");
  };

  return (
    <View>
      <Button onPress={handleShowSuccess}>显示成功消息</Button>
      <Button onPress={handleShowError}>显示错误消息</Button>
    </View>
  );
}
```

## 使用方法

### 1. 基础消息类型

#### 成功消息

```tsx
import { useToastActions } from "@/store/hooks";

function SuccessExample() {
  const { showSuccess } = useToastActions();

  const handleSuccess = () => {
    showSuccess("保存成功", "您的数据已成功保存");
  };

  return <Button onPress={handleSuccess}>保存数据</Button>;
}
```

#### 错误消息

```tsx
function ErrorExample() {
  const { showError } = useToastActions();

  const handleError = () => {
    showError("网络错误", "无法连接到服务器，请检查网络设置");
  };

  return <Button onPress={handleError}>测试错误</Button>;
}
```

#### 警告消息

```tsx
function WarningExample() {
  const { showWarning } = useToastActions();

  const handleWarning = () => {
    showWarning("注意", "此操作将删除所有数据，请谨慎操作");
  };

  return <Button onPress={handleWarning}>显示警告</Button>;
}
```

#### 信息消息

```tsx
function InfoExample() {
  const { showInfo } = useToastActions();

  const handleInfo = () => {
    showInfo("提示", "新版本已发布，建议您更新应用");
  };

  return <Button onPress={handleInfo}>显示信息</Button>;
}
```

### 2. 自定义 Toast

#### 使用 showToast 方法

```tsx
function CustomToastExample() {
  const { showToast } = useToastActions();

  const handleCustomToast = () => {
    showToast({
      type: "info",
      title: "自定义消息",
      message: "这是一个自定义的 Toast 消息",
      duration: 5000,
      position: "center",
      action: {
        label: "查看详情",
        onPress: () => {
          console.log("用户点击了查看详情");
        },
      },
      onClose: () => {
        console.log("Toast 已关闭");
      },
    });
  };

  return <Button onPress={handleCustomToast}>自定义 Toast</Button>;
}
```

### 3. 带操作按钮的 Toast

```tsx
function ActionToastExample() {
  const { showToast } = useToastActions();

  const handleActionToast = () => {
    showToast({
      type: "warning",
      title: "数据未保存",
      message: "您有未保存的更改，是否要保存？",
      duration: 0, // 不自动关闭
      action: {
        label: "保存",
        onPress: () => {
          // 执行保存操作
          saveData();
          showSuccess("保存成功", "数据已保存");
        },
      },
    });
  };

  return <Button onPress={handleActionToast}>显示操作 Toast</Button>;
}
```

### 4. 手动控制 Toast

```tsx
function ManualControlExample() {
  const { showToast, removeToast, clearAllToasts } = useToastActions();
  const [toastId, setToastId] = useState(null);

  const showPersistentToast = () => {
    const id = Date.now().toString();
    setToastId(id);

    showToast({
      id,
      type: "info",
      title: "持久消息",
      message: "这个消息不会自动关闭",
      duration: 0, // 不自动关闭
    });
  };

  const removeSpecificToast = () => {
    if (toastId) {
      removeToast(toastId);
      setToastId(null);
    }
  };

  const clearAll = () => {
    clearAllToasts();
    setToastId(null);
  };

  return (
    <View>
      <Button onPress={showPersistentToast}>显示持久消息</Button>
      <Button onPress={removeSpecificToast}>移除特定消息</Button>
      <Button onPress={clearAll}>清除所有消息</Button>
    </View>
  );
}
```

## 消息类型配置

### 默认样式配置

```tsx
const getToastConfig = (type: ToastType) => {
  switch (type) {
    case "success":
      return {
        icon: "check-circle",
        color: "#4CAF50",
        backgroundColor: "#E8F5E8",
      };
    case "error":
      return {
        icon: "close-circle",
        color: "#F44336",
        backgroundColor: "#FFEBEE",
      };
    case "warning":
      return {
        icon: "alert-circle",
        color: "#FF9800",
        backgroundColor: "#FFF3E0",
      };
    case "info":
      return {
        icon: "information",
        color: "#2196F3",
        backgroundColor: "#E3F2FD",
      };
    default:
      return {
        icon: "information",
        color: "#2196F3",
        backgroundColor: "#E3F2FD",
      };
  }
};
```

### 自定义样式

```tsx
function CustomStyledToast() {
  const { showToast } = useToastActions();

  const handleCustomStyle = () => {
    showToast({
      type: "info",
      title: "自定义样式",
      message: "这个消息使用了自定义样式",
      duration: 3000,
      // 可以通过修改组件样式来实现自定义外观
    });
  };

  return <Button onPress={handleCustomStyle}>自定义样式 Toast</Button>;
}
```

## 动画效果

### 进入动画

```tsx
// 进入动画配置
Animated.parallel([
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true,
  }),
  Animated.timing(slideAnim, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  }),
]).start();
```

### 退出动画

```tsx
// 退出动画配置
Animated.parallel([
  Animated.timing(fadeAnim, {
    toValue: 0,
    duration: 200,
    useNativeDriver: true,
  }),
  Animated.timing(slideAnim, {
    toValue: -100,
    duration: 200,
    useNativeDriver: true,
  }),
]).start();
```

## 使用场景

### 1. 表单提交反馈

```tsx
function FormExample() {
  const { showSuccess, showError } = useToastActions();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);

    try {
      await submitForm(formData);
      showSuccess("提交成功", "您的表单已成功提交");
    } catch (error) {
      showError("提交失败", "请检查网络连接后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {/* 表单内容 */}
      <Button onPress={() => handleSubmit(formData)} loading={loading}>
        提交表单
      </Button>
    </View>
  );
}
```

### 2. 网络请求反馈

```tsx
function NetworkRequestExample() {
  const { showSuccess, showError, showInfo } = useToastActions();

  const handleApiCall = async () => {
    showInfo("请求中", "正在处理您的请求...");

    try {
      const response = await apiCall();
      showSuccess("请求成功", "数据已成功获取");
    } catch (error) {
      showError("请求失败", error.message);
    }
  };

  return <Button onPress={handleApiCall}>发起请求</Button>;
}
```

### 3. 用户操作确认

```tsx
function ConfirmationExample() {
  const { showToast } = useToastActions();

  const handleDelete = () => {
    showToast({
      type: "warning",
      title: "确认删除",
      message: "此操作不可撤销，确定要删除吗？",
      duration: 0,
      action: {
        label: "确认删除",
        onPress: () => {
          // 执行删除操作
          deleteItem();
          showSuccess("删除成功", "项目已删除");
        },
      },
    });
  };

  return <Button onPress={handleDelete}>删除项目</Button>;
}
```

### 4. 系统通知

```tsx
function SystemNotificationExample() {
  const { showInfo, showWarning } = useToastActions();

  const handleSystemUpdate = () => {
    showInfo("系统更新", "新版本已发布，建议您更新应用");
  };

  const handleMaintenance = () => {
    showWarning("系统维护", "系统将在今晚 2:00-4:00 进行维护");
  };

  return (
    <View>
      <Button onPress={handleSystemUpdate}>系统更新通知</Button>
      <Button onPress={handleMaintenance}>维护通知</Button>
    </View>
  );
}
```

## 最佳实践

### 1. 合理使用消息类型

```tsx
// ✅ 正确使用
showSuccess("保存成功", "数据已保存");
showError("保存失败", "网络连接异常");
showWarning("注意", "此操作不可撤销");
showInfo("提示", "新功能已上线");

// ❌ 避免滥用
showError("保存成功", "数据已保存"); // 错误类型使用错误
```

### 2. 控制消息数量

```tsx
// ✅ 避免同时显示过多消息
const { clearAllToasts } = useToastActions();

// 在显示新消息前清除旧消息
clearAllToasts();
showSuccess("操作完成", "所有任务已完成");
```

### 3. 设置合适的显示时长

```tsx
// ✅ 根据消息重要性设置时长
showSuccess("操作成功", "数据已保存", 2000); // 2秒
showError("操作失败", "请重试", 5000); // 5秒
showInfo("系统通知", "新版本已发布", 0); // 不自动关闭
```

### 4. 提供有意义的操作

```tsx
// ✅ 提供有用的操作按钮
showToast({
  type: "error",
  title: "网络错误",
  message: "无法连接到服务器",
  action: {
    label: "重试",
    onPress: () => retryConnection(),
  },
});
```

## 注意事项

1. **性能考虑**: 避免同时显示过多 Toast 消息
2. **用户体验**: 确保消息内容简洁明了
3. **无障碍性**: 考虑屏幕阅读器的支持
4. **国际化**: 消息文本应支持多语言
5. **主题适配**: 确保在不同主题下都能正常显示

## 相关文件

- `components/Toast.tsx` - Toast 组件
- `components/ToastContainer.tsx` - Toast 容器组件
- `store/slices/toastSlice.ts` - Toast 状态管理
- `store/hooks/toastHooks.ts` - Toast Hooks
- `utils/fetch.ts` - 全局 Toast 集成
