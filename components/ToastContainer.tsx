import { useToast, useToastActions } from "@/store/hooks";
import { setGlobalToastActions } from "@/utils/fetch";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "./Toast";

export default function ToastContainer() {
  const { toasts, isVisible } = useToast();
  const { removeToast, showSuccess, showError, showWarning, showInfo } =
    useToastActions();

  // 设置全局 Toast actions，供 fetch 工具使用
  useEffect(() => {
    setGlobalToastActions({
      showSuccess,
      showError,
      showWarning,
      showInfo,
    });
  }, [showSuccess, showError, showWarning, showInfo]);

  // 自动关闭逻辑已移至 Toast 组件内部处理

  if (!isVisible || toasts.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {toasts.map((toast: any) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    pointerEvents: "box-none", // 允许点击穿透
  },
});
