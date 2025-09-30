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

type ReviewStatus = "pending" | "reviewing" | "approved" | "rejected";

export default function HomeScreen() {
  const { isAuthenticated, userInfo } = useAuth();
  const { logout } = useAuthActions();
  const [visible, setVisible] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("reviewing");
  const [completionRate, setCompletionRate] = useState(65);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const handleLogout = async () => {
    await logout();
  };

  const getStatusInfo = (status: ReviewStatus) => {
    switch (status) {
      case "pending":
        return { step: 0, text: "待提交", color: "#9CA3AF" };
      case "reviewing":
        return { step: 1, text: "审核中", color: "#4a9aff" };
      case "approved":
        return { step: 2, text: "审核通过", color: "#10B981" };
      case "rejected":
        return { step: 2, text: "审核未通过", color: "#EF4444" };
      default:
        return { step: 0, text: "待提交", color: "#9CA3AF" };
    }
  };

  const statusInfo = getStatusInfo(reviewStatus);

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* 顶部用户信息区域 - 快融呗风格 */}
      <LinearGradient
        colors={["#4a9aff", "#6ab0ff"]}
        style={styles.headerGradient}
      >
        <View style={styles.userInfoSection}>
          {isAuthenticated ? (
            <View style={styles.loggedInHeader}>
              <Avatar.Text
                size={64}
                label={userInfo?.mobilePhone?.slice(-2) || "用户"}
                style={styles.avatar}
                labelStyle={styles.avatarLabel}
              />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  {userInfo?.mobilePhone || "用户"}
                </Text>
                <Text style={styles.userStatus}>
                  ID: {userInfo?.id || "123456789"}
                </Text>
              </View>
              <TouchableOpacity onPress={showDialog} style={styles.logoutBtn}>
                <Text style={styles.logoutText}>退出登录</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.notLoggedInHeader}>
              <Avatar.Icon size={64} icon="account" style={styles.avatar} />
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
      {/* 积分模块展示 - 快融呗风格 */}
      <View style={styles.pointsSection}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: "#4a9aff", fontWeight: "bold" }}>
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
            backgroundColor: "#4a9aff",
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

      {/* 资料审核状态卡片 */}
      <View style={styles.reviewStatusCard}>
        <View style={styles.reviewStatusHeader}>
          <Text style={styles.reviewStatusTitle}>资料审核状态</Text>
          <View
            style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}
          >
            <Text style={styles.statusBadgeText}>{statusInfo.text}</Text>
          </View>
        </View>

        {/* 进度条 */}
        <View style={styles.progressContainer}>
          <View style={styles.progressSteps}>
            {["待提交", "待审核", "审核结果"].map((step, index) => (
              <View key={step} style={styles.progressStep}>
                <View
                  style={[
                    styles.progressStepCircle,
                    {
                      backgroundColor:
                        index <= statusInfo.step ? "#4a9aff" : "#E5E7EB",
                    },
                  ]}
                >
                  {index < statusInfo.step ? (
                    <AntDesign name="check" size={16} color="#FFFFFF" />
                  ) : (
                    <Text
                      style={[
                        styles.progressStepNumber,
                        {
                          color:
                            index <= statusInfo.step ? "#FFFFFF" : "#9CA3AF",
                        },
                      ]}
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.progressStepLabel,
                    { color: index <= statusInfo.step ? "#4a9aff" : "#9CA3AF" },
                  ]}
                >
                  {step}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.progressLine}>
            <View
              style={[
                styles.progressLineFill,
                { width: `${(statusInfo.step / 2) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* 状态说明 */}
        <View style={styles.statusDescription}>
          {reviewStatus === "pending" && (
            <Text style={styles.statusDescriptionText}>
              请尽快提交您的资料，我们将在1-3个工作日内完成审核
            </Text>
          )}
          {reviewStatus === "reviewing" && (
            <Text style={styles.statusDescriptionText}>
              您的资料正在审核中，请耐心等待，预计1-3个工作日完成
            </Text>
          )}
          {reviewStatus === "approved" && (
            <Text style={[styles.statusDescriptionText, { color: "#10B981" }]}>
              恭喜！您的资料已通过审核
            </Text>
          )}
          {reviewStatus === "rejected" && (
            <Text style={[styles.statusDescriptionText, { color: "#EF4444" }]}>
              很抱歉，您的资料未通过审核，请重新提交
            </Text>
          )}
        </View>

        {/* 资料完整度 */}
        <View style={styles.completionSection}>
          <View style={styles.completionHeader}>
            <Text style={styles.completionTitle}>资料完整度</Text>
            <Text style={styles.completionRate}>{completionRate}%</Text>
          </View>

          <View style={styles.completionProgressBar}>
            <View
              style={[
                styles.completionProgressFill,
                { width: `${completionRate}%` },
              ]}
            />
          </View>

          {completionRate < 100 && (
            <TouchableOpacity
              style={styles.completionButton}
              onPress={() => {
                if (completionRate < 100) {
                  setCompletionRate(Math.min(100, completionRate + 15));
                }
              }}
            >
              <Text style={styles.completionButtonText}>补充资料</Text>
            </TouchableOpacity>
          )}
          {completionRate === 100 && (
            <View style={styles.completionComplete}>
              <AntDesign name="check-circle" size={20} color="#10B981" />
              <Text style={styles.completionCompleteText}>资料已完善</Text>
            </View>
          )}
        </View>

        {/* 操作按钮 */}
        {reviewStatus === "pending" && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setReviewStatus("reviewing")}
          >
            <Text style={styles.actionButtonText}>提交资料</Text>
          </TouchableOpacity>
        )}
        {reviewStatus === "rejected" && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setReviewStatus("reviewing")}
          >
            <Text style={styles.actionButtonText}>重新提交</Text>
          </TouchableOpacity>
        )}
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
        {/* 菜单项 - 快融呗风格 */}
        {menuItems.map((item: MenuItem, idx) => (
          <Link href={item.link} asChild key={item.title}>
            <TouchableOpacity style={styles.menuItemContainer}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuItemIconContainer}>{item.icon}</View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <AntDesign name="right" size={20} color="#9CA3AF" />
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

  // 资料审核状态卡片样式
  reviewStatusCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  reviewStatusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  reviewStatusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },

  // 进度条样式
  progressContainer: {
    position: "relative",
    marginBottom: 24,
  },
  progressSteps: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressStep: {
    flex: 1,
    alignItems: "center",
  },
  progressStepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  progressStepNumber: {
    fontSize: 14,
    fontWeight: "bold",
  },
  progressStepLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  progressLine: {
    position: "absolute",
    top: 16,
    left: "12.5%",
    right: "12.5%",
    height: 2,
    backgroundColor: "#E5E7EB",
    zIndex: -1,
  },
  progressLineFill: {
    height: "100%",
    backgroundColor: "#4a9aff",
  },

  // 状态说明样式
  statusDescription: {
    backgroundColor: "#F0F8FF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  statusDescriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },

  // 资料完整度样式
  completionSection: {
    marginBottom: 24,
  },
  completionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  completionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  completionRate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a9aff",
  },
  completionProgressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 16,
    overflow: "hidden",
  },
  completionProgressFill: {
    height: "100%",
    backgroundColor: "#4a9aff",
    borderRadius: 4,
  },
  completionButton: {
    borderWidth: 1,
    borderColor: "#4a9aff",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  completionButtonText: {
    color: "#4a9aff",
    fontSize: 16,
    fontWeight: "500",
  },
  completionComplete: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  completionCompleteText: {
    color: "#10B981",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },

  // 操作按钮样式
  actionButton: {
    backgroundColor: "#4a9aff",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },

  // 菜单项样式
  menuItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
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
    color: "#222",
    fontWeight: "500",
  },
});
