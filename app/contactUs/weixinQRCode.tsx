import globalStyles from "@/components/styles/globalStyles";
import { ThemedText } from "@/components/ui";
import { customColors } from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function WeixinQRCodeScreen() {
  return (
    <ScrollView
      style={globalStyles.globalContainer}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.cardBox}>
        <View style={styles.qrCodeCard}>
          {/* 顶部标题 */}
          <ThemedText style={styles.cardTitle}>请加我的企业微信</ThemedText>
          {/* 二维码气泡容器 */}
          <View style={styles.qrCodeBubble}>
            <View style={styles.qrCodeWrapper}>
              <QRCode
                value="https://example.com/wechat"
                size={120}
                color="#000000"
                backgroundColor="#FFFFFF"
              />
              {/* 二维码中心Logo */}
              <View style={styles.qrCodeLogo}>
                <AntDesign name="wechat" size={24} color="#FFFFFF" />
                <ThemedText style={styles.qrCodeLogoText}>企业微信</ThemedText>
              </View>
            </View>
          </View>
          {/* 联系人信息 */}
          <View style={styles.contactInfo}>
            <ThemedText style={styles.contactName}>李咏宸</ThemedText>
            <ThemedText style={styles.contactCompany}>壹元鑫科</ThemedText>
          </View>
        </View>

        {/* 底部Footer */}
        <View style={styles.footer}>
          <AntDesign name="wechat" size={16} color="#2B56F6" />
          <ThemedText style={styles.footerText}>企业微信</ThemedText>
        </View>
      </View>
      <ThemedText style={styles.underText}>
        长按识别二维码，添加我的企业微信
      </ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  cardBox: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  // 二维码卡片（蓝色背景）
  qrCodeCard: {
    width: "100%",
    backgroundColor: customColors.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  // 卡片标题
  cardTitle: {
    fontSize: 26,
    lineHeight: 42,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 50,
    marginBottom: 50,
    textAlign: "center",
  },
  // 二维码气泡容器（浅蓝色）
  qrCodeBubble: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
    alignSelf: "center",
  },
  // 二维码包装器
  qrCodeWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  // 二维码中心Logo
  qrCodeLogo: {
    position: "absolute",
    width: 60,
    height: 60,
    backgroundColor: customColors.primary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  qrCodeLogoText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  // 联系人信息
  contactInfo: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  contactName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  contactCompany: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  // 底部Footer
  footer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingVertical: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    gap: 6,
    width: "100%",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 20,
    fontWeight: "500",
    color: customColors.primary,
  },
  underText: {
    marginTop: 20,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
});
