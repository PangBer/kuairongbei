import type { ToastItem, ToastType } from "@/store/slices/toastSlice";
import React, { useCallback, useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Button, Card, IconButton, Text } from "react-native-paper";

interface ToastProps {
  toast: ToastItem;
  onRemove: (id: string) => void;
}

export default function Toast({ toast, onRemove }: ToastProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 获取图标和颜色
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

  const config = getToastConfig(toast.type);

  // 关闭动画
  const handleClose = useCallback(() => {
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
    ]).start(() => {
      onRemove(toast.id);
    });
  }, [fadeAnim, slideAnim, onRemove, toast.id]);

  // 显示动画和自动关闭
  useEffect(() => {
    // 显示动画
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

    // 自动关闭逻辑
    if (toast.duration && toast.duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, toast.duration);
    }

    // 清理函数
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []); // 只在组件挂载时执行一次

  // 处理动作按钮
  const handleAction = () => {
    if (toast.action?.onPress) {
      toast.action.onPress();
    }
    handleClose();
  };

  // 处理关闭回调
  const handleCloseCallback = () => {
    if (toast.onClose) {
      toast.onClose();
    }
    handleClose();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Card
        style={[
          styles.toast,
          {
            backgroundColor: config.backgroundColor,
            borderLeftColor: config.color,
          },
        ]}
        elevation={3}
      >
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <IconButton
                icon={config.icon}
                iconColor={config.color}
                size={20}
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={[styles.title, { color: config.color }]}>
                  {toast.title}
                </Text>
                {toast.message && (
                  <Text style={styles.message}>{toast.message}</Text>
                )}
              </View>
            </View>
            <IconButton
              icon="close"
              size={16}
              onPress={handleCloseCallback}
              style={styles.closeButton}
            />
          </View>

          {toast.action && (
            <View style={styles.actionContainer}>
              <Button
                mode="outlined"
                onPress={handleAction}
                style={[styles.actionButton, { borderColor: config.color }]}
                labelStyle={{ color: config.color }}
              >
                {toast.action.label}
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  toast: {
    borderRadius: 8,
    borderLeftWidth: 4,
    minHeight: 60,
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  icon: {
    margin: 0,
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  closeButton: {
    margin: 0,
    marginLeft: 8,
  },
  actionContainer: {
    marginTop: 12,
    alignItems: "flex-start",
  },
  actionButton: {
    borderRadius: 6,
  },
});
