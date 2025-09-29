import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Toast 类型
export type ToastType = "success" | "error" | "warning" | "info";

// Toast 项接口
export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // 显示时长（毫秒），0 表示不自动关闭
  position?: "top" | "bottom" | "center";
  action?: {
    label: string;
    onPress: () => void;
  };
  onClose?: () => void;
}

// Toast 状态接口
interface ToastState {
  toasts: ToastItem[];
  isVisible: boolean;
}

// 初始状态
const initialState: ToastState = {
  toasts: [],
  isVisible: false,
};

// Toast slice
const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    // 显示 Toast
    showToast: (state, action: PayloadAction<Omit<ToastItem, "id">>) => {
      const toast: ToastItem = {
        id: Date.now().toString() + Math.random().toString(36),
        position: "top", // 默认顶部
        ...action.payload,
        duration: 3000, // 默认 3 秒
      };

      state.toasts.push(toast);
      state.isVisible = true;
    },

    // 显示成功 Toast
    showSuccess: (
      state,
      action: PayloadAction<{
        title: string;
        message?: string;
        duration?: number;
      }>
    ) => {
      const toast: ToastItem = {
        id: Date.now().toString() + Math.random().toString(36),
        type: "success",
        position: "top",
        ...action.payload,
        duration: action.payload.duration ?? 3000, // 使用传入的 duration 或默认 3000ms
      };

      state.toasts.push(toast);
      state.isVisible = true;
    },

    // 显示错误 Toast
    showError: (
      state,
      action: PayloadAction<{
        title: string;
        message?: string;
        duration?: number;
      }>
    ) => {
      const toast: ToastItem = {
        id: Date.now().toString() + Math.random().toString(36),
        type: "error",
        position: "top",
        ...action.payload,
        duration: action.payload.duration ?? 5000, // 使用传入的 duration 或默认 5000ms
      };

      state.toasts.push(toast);
      state.isVisible = true;
    },

    // 显示警告 Toast
    showWarning: (
      state,
      action: PayloadAction<{
        title: string;
        message?: string;
        duration?: number;
      }>
    ) => {
      const toast: ToastItem = {
        id: Date.now().toString() + Math.random().toString(36),
        type: "warning",
        position: "top",
        ...action.payload,
        duration: action.payload.duration ?? 4000, // 使用传入的 duration 或默认 4000ms
      };

      state.toasts.push(toast);
      state.isVisible = true;
    },

    // 显示信息 Toast
    showInfo: (
      state,
      action: PayloadAction<{
        title: string;
        message?: string;
        duration?: number;
      }>
    ) => {
      const toast: ToastItem = {
        id: Date.now().toString() + Math.random().toString(36),
        type: "info",
        position: "top",
        ...action.payload,
        duration: action.payload.duration ?? 3000, // 使用传入的 duration 或默认 3000ms
      };

      state.toasts.push(toast);
      state.isVisible = true;
    },

    // 移除 Toast
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
      if (state.toasts.length === 0) {
        state.isVisible = false;
      }
    },

    // 清除所有 Toast
    clearAllToasts: (state) => {
      state.toasts = [];
      state.isVisible = false;
    },

    // 设置可见性
    setVisible: (state, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload;
    },
  },
});

// 导出 actions
export const {
  showToast,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  removeToast,
  clearAllToasts,
  setVisible,
} = toastSlice.actions;

// 导出 reducer
export default toastSlice.reducer;
