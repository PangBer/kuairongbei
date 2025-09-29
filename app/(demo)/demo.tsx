import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Button, Card } from "react-native-paper";

import ContactService from "@/components/ContactService";
import { useAuth, useAuthActions } from "@/store/hooks";
import { defaultContactConfig } from "@/utils/contactService";
import { Link } from "expo-router";

export default function HomeScreen() {
  const { isAuthenticated, userInfo } = useAuth();
  const { logout } = useAuthActions();

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
              <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                <Text style={styles.logoutText}>退出</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.notLoggedInHeader}>
              <Avatar.Icon size={60} icon="account" style={styles.avatar} />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>欢迎使用快融贝</Text>
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

      {/* 快捷功能区域 */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>快捷功能</Text>

        {/* 第一行功能 */}
        <View style={styles.functionRow}>
          <TouchableOpacity style={styles.quickActionCard}>
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>📄</Text>
            </View>
            <Text style={styles.actionTitle}>文档浏览</Text>
            <Text style={styles.actionSubtitle}>查看协议文档</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionCard}>
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>📱</Text>
            </View>
            <Text style={styles.actionTitle}>二维码</Text>
            <Text style={styles.actionSubtitle}>生成与扫描</Text>
          </TouchableOpacity>
        </View>

        {/* 第二行功能 */}
        <View style={styles.functionRow}>
          <TouchableOpacity style={styles.quickActionCard}>
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>💬</Text>
            </View>
            <Text style={styles.actionTitle}>联系客服</Text>
            <Text style={styles.actionSubtitle}>在线客服支持</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionCard}>
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>🧪</Text>
            </View>
            <Text style={styles.actionTitle}>功能测试</Text>
            <Text style={styles.actionSubtitle}>系统功能测试</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 详细功能列表 */}
      <View style={styles.detailedFunctionsSection}>
        <Text style={styles.sectionTitle}>功能详情</Text>

        {/* 文档功能 */}
        <Card style={styles.detailCard}>
          <Card.Content style={styles.detailCardContent}>
            <View style={styles.detailHeader}>
              <View style={styles.detailIconContainer}>
                <Text style={styles.detailIcon}>📄</Text>
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailTitle}>文档浏览</Text>
                <Text style={styles.detailDescription}>
                  浏览服务器上的 DOCX 和 PDF 文档
                </Text>
              </View>
            </View>
            <View style={styles.detailActions}>
              <Link href="/doc" asChild>
                <Button mode="contained" compact style={styles.detailButton}>
                  查看协议
                </Button>
              </Link>
              <Link href="/doc?showAgreement=true" asChild>
                <Button mode="outlined" compact style={styles.detailButton}>
                  确认模式
                </Button>
              </Link>
            </View>
          </Card.Content>
        </Card>

        {/* 二维码功能 */}
        <Card style={styles.detailCard}>
          <Card.Content style={styles.detailCardContent}>
            <View style={styles.detailHeader}>
              <View style={styles.detailIconContainer}>
                <Text style={styles.detailIcon}>📱</Text>
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailTitle}>二维码功能</Text>
                <Text style={styles.detailDescription}>
                  生成和扫描二维码，支持App和Web访问
                </Text>
              </View>
            </View>
            <View style={styles.detailActions}>
              <Link href="/qrcode" asChild>
                <Button mode="contained" compact style={styles.detailButton}>
                  生成二维码
                </Button>
              </Link>
              <Link href="/qrcode-scanner" asChild>
                <Button mode="outlined" compact style={styles.detailButton}>
                  扫描二维码
                </Button>
              </Link>
            </View>
          </Card.Content>
        </Card>

        {/* 客服功能 */}
        <Card style={styles.detailCard}>
          <Card.Content style={styles.detailCardContent}>
            <View style={styles.detailHeader}>
              <View style={styles.detailIconContainer}>
                <Text style={styles.detailIcon}>💬</Text>
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailTitle}>联系客服</Text>
                <Text style={styles.detailDescription}>
                  遇到问题？联系我们的客服团队获取帮助
                </Text>
              </View>
            </View>
            <View style={styles.detailActions}>
              <Link href="/contact-service" asChild>
                <Button mode="contained" compact style={styles.detailButton}>
                  客服页面
                </Button>
              </Link>
            </View>
          </Card.Content>
        </Card>

        {/* 文件上传功能 */}
        <Card style={styles.detailCard}>
          <Card.Content style={styles.detailCardContent}>
            <View style={styles.detailHeader}>
              <View style={styles.detailIconContainer}>
                <Text style={styles.detailIcon}>📁</Text>
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailTitle}>文件上传</Text>
                <Text style={styles.detailDescription}>
                  跨平台文件上传，支持多种上传方式
                </Text>
              </View>
            </View>
            <View style={styles.detailActions}>
              <Link href="./file-upload" asChild>
                <Button mode="contained" compact style={styles.detailButton}>
                  上传演示
                </Button>
              </Link>
            </View>
          </Card.Content>
        </Card>

        {/* 选择器功能 */}
        <Card style={styles.detailCard}>
          <Card.Content style={styles.detailCardContent}>
            <View style={styles.detailHeader}>
              <View style={styles.detailIconContainer}>
                <Text style={styles.detailIcon}>📋</Text>
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailTitle}>选择器组件</Text>
                <Text style={styles.detailDescription}>
                  跨平台选择器组件，支持普通下拉和多级选择
                </Text>
              </View>
            </View>
            <View style={styles.detailActions}>
              <Link href="./select-demo" asChild>
                <Button mode="contained" compact style={styles.detailButton}>
                  选择器演示
                </Button>
              </Link>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* 快速联系客服 */}
      <ContactService
        title="快速联系客服"
        description="点击直接联系客服"
        wechatId={defaultContactConfig.wechatId}
        webContactUrl={defaultContactConfig.webContactUrl}
        showCard={true}
        buttonText="联系客服"
        onContactPress={() => {
          console.log("用户点击了联系客服");
        }}
      />
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
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  userInfoSection: {
    flexDirection: "row",
    alignItems: "center",
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

  // 快捷功能区域
  quickActionsSection: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  functionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    textAlign: "center",
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },

  // 详细功能区域
  detailedFunctionsSection: {
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  detailCard: {
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderRadius: 12,
  },
  detailCardContent: {
    padding: 16,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailIcon: {
    fontSize: 20,
  },
  detailInfo: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  detailDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  detailActions: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  detailButton: {
    flex: 1,
    minWidth: 100,
  },
});
