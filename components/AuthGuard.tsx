import { useAuth, useAuthActions } from "@/store/hooks";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true: 需要登录, false: 不需要登录
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { checkAuth } = useAuthActions();
  const pathname = usePathname();
  const router = useRouter();
  // 初始化时检查认证状态，只在组件挂载时执行一次
  useEffect(() => {
    // 只有在未初始化时才检查认证状态
    if (!isAuthenticated && !isLoading) {
      checkAuth();
    }
  }, []); // 空依赖数组，只在组件挂载时执行

  // 处理重定向逻辑
  useEffect(() => {
    if (requireAuth && !isAuthenticated && !isLoading) {
      router.replace({
        pathname: "/login",
        params: { redirect: pathname },
      });
    }
  }, [requireAuth, isAuthenticated, isLoading, pathname]);

  // 加载中状态
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a9aff" />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  // 需要登录但未登录
  if (requireAuth && !isAuthenticated) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.redirectText}>重定向到登录页面...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  redirectText: {
    fontSize: 16,
    color: "#666",
  },
});
