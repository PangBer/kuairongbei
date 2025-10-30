import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Avatar,
  Button,
  Dialog,
  Portal,
  Text as TextPaper,
} from "react-native-paper";

import { ThemedCard, ThemedText } from "@/components/ui";
import { useAuth, useAuthActions } from "@/store/hooks";
import globalStyles from "@/styles/globalStyles";
import { Link, RelativePathString } from "expo-router";

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  link: RelativePathString;
}

// 菜单项数组 - 快融呗风格
const menuItems: MenuItem[] = [
  {
    title: "我的资料",
    icon: (
      <AntDesign name="profile" size={20} color="#4a9aff" />
    ) as React.ReactNode,
    link: "/gather" as RelativePathString,
  },
  {
    title: "消息通知",
    icon: (
      <AntDesign name="notification" size={20} color="#ff9f43" />
    ) as React.ReactNode,
    link: "/notifications" as RelativePathString,
  },
  {
    title: "我的收藏",
    icon: (
      <AntDesign name="heart" size={20} color="#ee5a6f" />
    ) as React.ReactNode,
    link: "/favorites" as RelativePathString,
  },
  {
    title: "分享推荐",
    icon: (
      <AntDesign name="share-alt" size={20} color="#26de81" />
    ) as React.ReactNode,
    link: "/share" as RelativePathString,
  },
  {
    title: "隐私安全",
    icon: (
      <AntDesign name="safety" size={20} color="#a55eea" />
    ) as React.ReactNode,
    link: "/privacy" as RelativePathString,
  },
  {
    title: "意见反馈",
    icon: (
      <AntDesign name="message" size={20} color="#4a9aff" />
    ) as React.ReactNode,
    link: "/feedback" as RelativePathString,
  },
  {
    title: "demo",
    icon: (
      <AntDesign name="api" size={20} color="#3a4b9f" />
    ) as React.ReactNode,
    link: "/demo" as RelativePathString,
  },
  {
    title: "设置",
    icon: (
      <AntDesign name="setting" size={20} color="#778ca3" />
    ) as React.ReactNode,
    link: "/settings" as RelativePathString,
  },
  {
    title: "帮助中心",
    icon: (
      <AntDesign name="question-circle" size={20} color="#4b7bec" />
    ) as React.ReactNode,
    link: "/help" as RelativePathString,
  },
];

export default function MineScreen() {
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
      style={globalStyles.globalContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 顶部渐变头部区域 */}
      <LinearGradient
        colors={["#8B5CF6", "#3B82F6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          {/* 用户信息区 */}
          {/* 原有的 Avatar/用户名块，用 ThemedText 替代 Text 部分 */}
          {isAuthenticated ? (
            <View style={styles.loggedInHeader}>
              <Avatar.Text
                size={64}
                label={userInfo?.mobilePhone?.slice(-2) || "用户"}
                style={styles.avatar}
                labelStyle={styles.avatarLabel}
              />
              <View style={styles.userDetails}>
                <ThemedText style={styles.userName}>
                  {userInfo?.mobilePhone || "用户"}
                </ThemedText>
                <ThemedText style={styles.userStatus}>
                  ID: {userInfo?.id || "123456789"}
                </ThemedText>
              </View>
              <TouchableOpacity onPress={showDialog} style={styles.logoutBtn}>
                <ThemedText style={styles.logoutText}>退出登录</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.notLoggedInHeader}>
              <Avatar.Icon size={64} icon="account" style={styles.avatar} />
              <View style={styles.userDetails}>
                <ThemedText style={styles.userName}>欢迎使用快融呗</ThemedText>
                <ThemedText style={styles.userStatus}>
                  请登录以享受更多服务
                </ThemedText>
              </View>
              <Link href="/login" asChild>
                <TouchableOpacity style={styles.loginBtn}>
                  <ThemedText style={styles.loginText}>登录</ThemedText>
                </TouchableOpacity>
              </Link>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* 积分展示区域 - 用 ThemedCard 包裹，并用 ThemedText 替代 */}
      <ThemedCard>
        <View style={styles.pointsContainer}>
          <View style={styles.pointItem}>
            <ThemedText style={styles.pointLabel}>可用积分</ThemedText>
            <ThemedText style={styles.pointValue}>
              {userInfo?.points ?? 0}
            </ThemedText>
          </View>
          <View style={styles.pointItem}>
            <ThemedText style={styles.pointLabel}>总积分</ThemedText>
            <ThemedText style={styles.pointValue}>
              {userInfo?.availablePoints ?? 0}
            </ThemedText>
          </View>
          <View style={styles.pointItem}>
            <ThemedText style={styles.pointLabel}>推荐积分</ThemedText>
            <ThemedText style={styles.pointValue}>
              {userInfo?.recommendPoints ?? 0}
            </ThemedText>
          </View>
        </View>
      </ThemedCard>

      {/* 菜单项 - 快融呗风格 */}
      <ThemedCard style={{ marginTop: 0 }}>
        {menuItems.map((item: MenuItem, idx) => (
          <Link href={item.link} asChild key={item.title}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.menuItemContainer}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.menuItemIconContainer}>{item.icon}</View>
                <ThemedText style={styles.menuItemText}>
                  {item.title}
                </ThemedText>
              </View>
              <AntDesign name="right" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </Link>
        ))}
      </ThemedCard>
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
  // 头部渐变区域
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
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
  avatarLabel: {
    color: "#FFFFFF",
    fontWeight: "bold",
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
  pointsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
  },
  pointItem: {
    alignItems: "center",
  },
  pointLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  pointValue: {
    fontSize: 24,
    fontWeight: "bold",
  },

  // 菜单项样式
  menuItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(74, 154, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
