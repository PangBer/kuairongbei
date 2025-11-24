import globalStyles from "@/components/styles/globalStyles";
import ToastModal, { ToastModalChildrenStyle } from "@/components/ToastModal";
import { ThemedCard, ThemedText } from "@/components/ui";
import { customColors } from "@/constants/theme";
import { useAuth, useAuthActions } from "@/store/hooks";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link, RelativePathString } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Badge } from "react-native-paper";

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  link: RelativePathString;
  badge?: boolean;
}

// 功能服务项数组 - 根据图片设计
const functionServices: MenuItem[] = [
  {
    title: "我的资料",
    icon: (
      <AntDesign name="user" size={24} color={customColors.primary} />
    ) as React.ReactNode,
    link: "/info" as RelativePathString,
  },
  {
    title: "提现记录",
    icon: (
      <AntDesign name="reload" size={24} color={customColors.primary} />
    ) as React.ReactNode,
    link: "/withdrawalRecord" as RelativePathString,
  },
  {
    title: "邀请助力",
    icon: (
      <AntDesign name="team" size={24} color={customColors.primary} />
    ) as React.ReactNode,
    link: "/invite" as RelativePathString,
  },
  {
    title: "成为推荐官",
    icon: (
      <AntDesign name="trophy" size={24} color={customColors.primary} />
    ) as React.ReactNode,
    link: "" as RelativePathString,
  },

  {
    title: "我的团队码",
    icon: (
      <AntDesign name="qrcode" size={24} color={customColors.primary} />
    ) as React.ReactNode,
    link: "" as RelativePathString,
  },

  {
    title: "消息中心",
    icon: (
      <AntDesign name="message" size={24} color={customColors.primary} />
    ) as React.ReactNode,
    link: "/message" as RelativePathString,
    badge: true,
  },
];

// 设置链接项数组 - 根据图片设计
const settingsItems: MenuItem[] = [
  {
    title: "账户安全",
    icon: (
      <AntDesign name="safety" size={20} color={customColors.primary} />
    ) as React.ReactNode,
    link: "" as RelativePathString,
  },
  {
    title: "隐私政策",
    icon: (
      <AntDesign name="eye" size={20} color={customColors.primary} />
    ) as React.ReactNode,
    link: "/doc?name=yszc" as RelativePathString,
  },
  {
    title: "联系我们",
    icon: (
      <AntDesign name="phone" size={24} color={customColors.primary} />
    ) as React.ReactNode,
    link: "/contactUs" as RelativePathString,
  },
  {
    title: "帮助中心",
    icon: (
      <AntDesign
        name="question-circle"
        size={20}
        color={customColors.primary}
      />
    ) as React.ReactNode,
    link: "" as RelativePathString,
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
    hideDialog();
  };

  // 格式化积分显示
  const formatPoints = (points: number) => {
    return points.toLocaleString();
  };

  const myAvatar = useMemo(() => {
    const lastDigit = userInfo?.mobilePhone?.at(-1) || 0;
    const num = parseInt(lastDigit);
    let avaterName = `mineAvatar${num % 5}`;
    // 使用数字比较替代逻辑运算符
    return `https://ryr123.com/app_resources/static/image/${avaterName}.png`;
  }, [userInfo]);

  return (
    <>
      <ScrollView
        style={globalStyles.globalContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 用户信息卡片 - 蓝色背景 */}
        <View style={styles.userCard}>
          {/* 用户基本信息行 */}
          <View style={styles.userInfoRow}>
            <Avatar.Image
              size={64}
              source={{ uri: myAvatar }}
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <ThemedText style={styles.userName}>
                {isAuthenticated
                  ? userInfo?.name || `用户${userInfo?.mobilePhone?.slice(-4)}`
                  : "*****"}
              </ThemedText>
              <ThemedText style={styles.userId}>
                账号: {isAuthenticated ? userInfo?.mobilePhone : "*****"}
              </ThemedText>
            </View>
            {isAuthenticated && (
              <View style={styles.userActions}>
                <Link href="/info" asChild>
                  <TouchableOpacity
                    style={styles.notificationButton}
                    activeOpacity={0.8}
                  >
                    <AntDesign name="edit" size={16} color="#ffffff" />
                  </TouchableOpacity>
                </Link>
                <Link href="/notify" asChild>
                  <TouchableOpacity
                    style={styles.notificationButton}
                    activeOpacity={0.8}
                  >
                    <AntDesign name="bell" size={18} color="#ffffff" />
                    <Badge style={{ position: "absolute", top: -6, right: -6 }}>
                      3
                    </Badge>
                  </TouchableOpacity>
                </Link>
              </View>
            )}
          </View>

          {/* 积分信息行 */}
          <View style={styles.pointsRow}>
            <View style={styles.pointSection}>
              <ThemedText style={styles.pointSectionLabel}>我的积分</ThemedText>
              <ThemedText style={styles.pointSectionValue}>
                {isAuthenticated
                  ? formatPoints(
                      Number(userInfo?.stillAccumulateScore ?? 0) +
                        Number(userInfo?.accountAccumulateScore ?? 0)
                    )
                  : "*****"}
                分
              </ThemedText>
            </View>
            <View style={styles.pointDivider} />
            <View style={styles.pointSection}>
              <ThemedText style={styles.pointSectionLabel}>可用积分</ThemedText>
              <ThemedText style={styles.pointSectionValue}>
                {isAuthenticated
                  ? formatPoints(userInfo?.accountAccumulateScore || 0)
                  : "*****"}
                分
              </ThemedText>
            </View>
          </View>

          {/* 立即提现按钮 */}
          {isAuthenticated ? (
            <Link href="/withdrawal" asChild>
              <TouchableOpacity
                style={styles.withdrawButton}
                activeOpacity={0.8}
              >
                <AntDesign name="wallet" size={18} color="#ffffff" />
                <ThemedText style={styles.withdrawText}>立即提现</ThemedText>
              </TouchableOpacity>
            </Link>
          ) : (
            <Link
              href={{
                pathname: "/login",
                params: {
                  redirect: "/mine",
                },
              }}
              asChild
            >
              <TouchableOpacity
                style={styles.withdrawButton}
                activeOpacity={0.8}
              >
                <AntDesign name="login" size={18} color="#ffffff" />
                <ThemedText style={styles.withdrawText}>立即登录</ThemedText>
              </TouchableOpacity>
            </Link>
          )}
        </View>
        {/* 功能服务区域 */}
        <ThemedCard>
          <View style={styles.functionGrid}>
            {functionServices.map((item: MenuItem, idx) => (
              <Link href={item.link} asChild key={item.title}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.functionItem}
                >
                  <View style={styles.functionIconContainer}>
                    {item.icon}
                    {item.badge && isAuthenticated ? (
                      <Badge
                        style={{ position: "absolute", top: -6, right: -6 }}
                      >
                        3
                      </Badge>
                    ) : (
                      <></>
                    )}
                  </View>
                  <ThemedText style={styles.functionText}>
                    {item.title}
                  </ThemedText>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </ThemedCard>

        {/* 设置链接区域 */}
        <ThemedCard>
          {settingsItems.map((item: MenuItem, idx) => (
            <Link href={item.link} asChild key={item.title}>
              <TouchableOpacity activeOpacity={0.8} style={styles.settingsItem}>
                <View style={styles.settingsItemContent}>
                  <View style={styles.settingsIconContainer}>{item.icon}</View>
                  <ThemedText style={styles.settingsItemText}>
                    {item.title}
                  </ThemedText>
                </View>
                <AntDesign name="right" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </Link>
          ))}
          {/* 退出登录按钮 */}
          {isAuthenticated && (
            <TouchableOpacity
              onPress={showDialog}
              style={styles.logoutButton}
              activeOpacity={0.8}
            >
              <AntDesign name="logout" size={18} color="#ff6b6b" />
              <ThemedText style={styles.logoutText}>退出登录</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedCard>
      </ScrollView>
      {/* 退出确认对话框 */}

      <ToastModal
        visible={visible}
        onConfirm={handleLogout}
        confirmText="立即退出"
        onCancel={() => setVisible(false)}
        cancleText="关闭"
      >
        <View style={ToastModalChildrenStyle.modalIconContainer}>
          <AntDesign name="warning" size={48} color={customColors.error} />
        </View>
        <ThemedText style={ToastModalChildrenStyle.modalTitle}>
          系统提示
        </ThemedText>
        <ThemedText style={ToastModalChildrenStyle.modalContent}>
          确定要退出登录吗？~
        </ThemedText>
      </ToastModal>
    </>
  );
}

const styles = StyleSheet.create({
  // 用户信息卡片
  userCard: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: "#2B56F6",
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    backgroundColor: "rgba(255,255,255,0.2)",
    marginRight: 12,
  },
  avatarLabel: {
    color: "#FFFFFF",
    fontSize: 22,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  userId: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  userActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  notificationButton: {
    position: "relative",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },

  editText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  // 积分信息行
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  pointSection: {
    flex: 1,
    // alignItems: "left",
    backgroundColor: "rgba(79, 137, 255,0.5)",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  pointSectionLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 8,
  },
  pointSectionValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  pointDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 16,
  },
  // 立即提现按钮
  withdrawButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(79, 137, 255,0.5)",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  withdrawText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  functionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  functionItem: {
    position: "relative",
    width: "33.333%",
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  functionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(74, 154, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  functionText: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  settingsItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(74, 154, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  settingsItemText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  // 退出登录按钮
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ff6b6b",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    marginTop: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
