import { ThemedView } from "@/components/ui";
import { useAuth, useAuthActions } from "@/store/hooks";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs, usePathname } from "expo-router";
import React, { useEffect } from "react";

export default () => {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const { checkAuth } = useAuthActions();
  // 初始化时检查认证状态，只在组件挂载时执行一次
  useEffect(() => {
    // 只有在未初始化时才检查认证状态
    if (!isAuthenticated && !isLoading) {
      checkAuth();
    }
  }, []); // 空依赖数组，只在组件挂载时执行
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 70,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "首页",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="product/index"
        options={{
          title: "产品",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="product" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="demand/index"
        options={{
          title: "我要申请",
          tabBarIcon: ({ color }) => (
            <ThemedView
              style={{
                width: 60,
                height: 60,
                alignItems: "center",
                justifyContent: "center",
                marginTop: -25,
                borderRadius: 30,
              }}
            >
              <AntDesign name="plus-circle" size={48} color={color} />
            </ThemedView>
          ),
        }}
      />
      <Tabs.Screen
        name="promotion/index"
        options={{
          title: "推广",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="account-book" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mine/index"
        options={{
          title: "我的",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};
