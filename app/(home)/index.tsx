import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Avatar,
  Button,
  Dialog,
  Portal,
  Text as TextPaper,
} from "react-native-paper";

import { useAuth, useAuthActions } from "@/store/hooks";
import { Link, RelativePathString } from "expo-router";

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  link: RelativePathString;
}

// 菜单项数组
const menuItems: MenuItem[] = [
  {
    title: "填写资料",
    icon: (
      <AntDesign name="profile" size={24} color="#1976D2" />
    ) as React.ReactNode,
    link: "/gather" as RelativePathString,
  },
  {
    title: "提现",
    icon: (
      <AntDesign name="gift" size={24} color="#1976D2" />
    ) as React.ReactNode,
    link: "/withdraw" as RelativePathString,
  },
  {
    title: "联系客服",
    icon: (
      <AntDesign name="customer-service" size={24} color="#1976D2" />
    ) as React.ReactNode,
    link: "/contact-service" as RelativePathString,
  },
  {
    title: "Demo",
    icon: (
      <AntDesign name="experiment" size={24} color="#1976D2" />
    ) as React.ReactNode,
    link: "/demo" as RelativePathString,
  },
];

export default function HomeScreen() {
  const { isAuthenticated, userInfo } = useAuth();
  const { logout } = useAuthActions();
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* 顶部用户信息区域 */}
      <LinearGradient
        colors={["#1976D2", "#42A5F5"]}
        style={styles.headerGradient}
      >
        <View style={styles.userInfoSection}>
          {isAuthenticated ? (
            <View style={styles.loggedInHeader}>
              <Avatar.Text
                size={60}
                label={userInfo?.mobilePhone?.slice(-2) || "用户"}
                style={styles.avatar}
              />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  {userInfo?.mobilePhone || "用户"}
                </Text>
                <Text style={styles.userStatus}>✅ 已认证用户</Text>
              </View>
              <TouchableOpacity onPress={showDialog} style={styles.logoutBtn}>
                <Text style={styles.logoutText}>退出</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.notLoggedInHeader}>
              <Avatar.Icon size={60} icon="account" style={styles.avatar} />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>欢迎使用快融呗</Text>
                <Text style={styles.userStatus}>请登录以享受更多服务</Text>
              </View>
              <Link href="/login" asChild>
                <TouchableOpacity style={styles.loginBtn}>
                  <Text style={styles.loginText}>登录</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
        </View>
      </LinearGradient>
      {/* 积分模块展示 */}
      <View style={styles.pointsSection}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: "#1976D2", fontWeight: "bold" }}>
            可用积分
          </Text>
          <Text
            style={{
              fontSize: 28,
              color: "#222",
              fontWeight: "bold",
              marginTop: 4,
            }}
          >
            {userInfo?.points ?? 0}
          </Text>
          <Text style={{ fontSize: 14, color: "#888", marginTop: 2 }}>
            累计积分：{userInfo?.availablePoints ?? 0}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "#1976D2",
            borderRadius: 24,
            paddingVertical: 10,
            paddingHorizontal: 22,
          }}
          onPress={() => {
            if (!isAuthenticated) {
              // 未登录跳转登录
              // router.push("/login");
              return;
            }
            // router.push("/withdraw");
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            立即提现
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          margin: 16,
          paddingVertical: 8,
          paddingHorizontal: 0,
          elevation: 2,
        }}
      >
        {/* 菜单项 */}
        {menuItems.map((item: MenuItem, idx) => (
          <Link href={item.link} asChild key={item.title}>
            <TouchableOpacity style={styles.menuItemContainer}>
              {item.icon}
              <Text
                style={{ fontSize: 16, flex: 1, color: "#222", marginLeft: 12 }}
              >
                {item.title}
              </Text>
              <AntDesign name="right" size={24} color="darkgray" />
            </TouchableOpacity>
          </Link>
        ))}
      </View>
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={{ borderRadius: 16 }}
        >
          <Dialog.Title>系统提示</Dialog.Title>
          <Dialog.Content>
            <TextPaper variant="bodyMedium">确定要退出登录吗？</TextPaper>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>取消</Button>
            <Button onPress={handleLogout}>确定</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    paddingBottom: 32,
  },

  // 头部渐变区域
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  userInfoSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  loggedInHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  notLoggedInHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    backgroundColor: "rgba(255,255,255,0.2)",
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  logoutBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  loginBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  pointsSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: -32,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  menuItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
});
