import { ThemedView } from "@/components/ui";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";
import React from "react";
export default () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 65,
          paddingVertical: 5,
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
          title: "有需求",
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
