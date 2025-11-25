import { useAuth, useAuthActions } from "@/store/hooks";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "./ui";

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
    if (requireAuth && !isAuthenticated && !isLoading && pathname !== "/") {
      router.replace({
        pathname: "/login",
        params: { redirect: pathname },
      });
    }
  }, [requireAuth, isAuthenticated, isLoading, pathname]);

  // 如果是加载中状态，显示加载指示器
  if (!isAuthenticated || isLoading) {
    return <ThemedText>正在检查登录状态...</ThemedText>;
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
