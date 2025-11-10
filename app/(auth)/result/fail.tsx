import PageHeader from "@/components/PageHeader";
import globalStyles from "@/components/styles/globalStyles";
import { ThemedCard, ThemedText } from "@/components/ui";
import { customDarkTheme, customLightTheme } from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
const failReasons = [
  {
    icon: "idcard",
    title: "身份信息验证失败",
    description: "您提交的身份信息与平台记录不一致，请核对后重新提交。",
  },
  {
    icon: "bank",
    title: "收入证明不足",
    description:
      "未提供收入证明或收入水平暂不符合要求，请补充相关工资或公积金证明。",
  },
  {
    icon: "credit-card",
    title: "信用记录不符合要求",
    description: "信用记录存在逾期或异常，请保持良好信用习惯后再次申请。",
  },
];

const suggestions = [
  {
    icon: "checkcircle",
    color: "#2B56F6",
    text: "请确保提供的身份信息与身份证一致，并且在有效期内。",
  },
  {
    icon: "filedone",
    color: "#2B56F6",
    text: "补充收入证明材料，如近6个月的工资流水、公积金、税单等。",
  },
  {
    icon: "database",
    color: "#2B56F6",
    text: "及时维护信用记录，保持良好的信用习惯。",
  },
  {
    icon: "infocirlce",
    color: "#2B56F6",
    text: "如有疑问可联系在线客服，以便我们为您提供针对性的指导。",
  },
];

export default function FailMessageScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const paperTheme = isDark ? customDarkTheme : customLightTheme;
  const router = useRouter();

  return (
    <View style={styles.container}>
      <PageHeader title="审核结果" />
      <ScrollView
        style={[
          globalStyles.globalContainer,
          { backgroundColor: paperTheme.colors.foreground },
        ]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyles.globalPaddingBottom}
      >
        {/* 顶部提示 */}
        <View style={styles.heroCard}>
          <View style={styles.heroIconWrapper}>
            <View style={styles.heroIconBackground}>
              <AntDesign name="close-circle" size={42} color="#F56C6C" />
            </View>
          </View>
          <ThemedText style={styles.heroTitle}>
            很抱歉，您的申请未通过
          </ThemedText>
          <ThemedText style={styles.heroDescription}>
            根据您提交的信审评估，目前暂时无法为您提供贷款服务。请查看下方原因并准备相关材料后重新申请。
          </ThemedText>
        </View>

        {/* 未通过原因 */}
        <ThemedCard style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AntDesign name="exclamation-circle" size={18} color="#F56C6C" />
            <ThemedText style={styles.sectionTitle}>未通过原因</ThemedText>
          </View>
          <View style={styles.divider} />
          {failReasons.map((item, index) => (
            <View
              key={item.title}
              style={[
                styles.listItem,
                index !== failReasons.length - 1 && styles.listDivider,
              ]}
            >
              <View style={[styles.listIcon, styles.failIconBackground]}>
                <AntDesign name={item.icon as any} size={18} color="#F56C6C" />
              </View>
              <View style={styles.listContent}>
                <ThemedText style={styles.listTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.listDescription}>
                  {item.description}
                </ThemedText>
              </View>
            </View>
          ))}
        </ThemedCard>

        {/* 重新申请建议 */}
        <ThemedCard style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AntDesign name="bulb" size={18} color="#2B56F6" />
            <ThemedText style={styles.sectionTitle}>重新申请建议</ThemedText>
          </View>
          <View style={styles.divider} />
          {suggestions.map((item, index) => (
            <View
              key={item.text}
              style={[
                styles.listItem,
                index !== suggestions.length - 1 && styles.listDivider,
              ]}
            >
              <View style={[styles.listIcon, styles.suggestionIconBackground]}>
                <AntDesign name="check-circle" size={18} color={item.color} />
              </View>
              <ThemedText style={styles.listSuggestion}>{item.text}</ThemedText>
            </View>
          ))}
        </ThemedCard>

        {/* 帮助卡片 */}
        <ThemedCard style={styles.helpCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.listIcon, styles.suggestionIconBackground]}>
              <AntDesign name="customer-service" size={18} color="#2B56F6" />
            </View>
            <ThemedText style={styles.sectionTitle}>需要帮助？</ThemedText>
          </View>
          <ThemedText style={styles.helpDescription}>
            请与我们的客服团队联系，我们将为您提供一对一的咨询服务。
          </ThemedText>
          <TouchableOpacity
            style={styles.helpButton}
            activeOpacity={0.8}
            onPress={() => router.push("/contactUs")}
          >
            <ThemedText style={styles.helpButtonText}>立即联系客服</ThemedText>
            <AntDesign name="arrow-right" size={16} color="#2B56F6" />
          </TouchableOpacity>
        </ThemedCard>
      </ScrollView>

      <View style={styles.footerBar}>
        <TouchableOpacity
          style={[styles.footerButton, styles.footerButtonSecondary]}
          activeOpacity={0.8}
          onPress={() => router.push("/(home)")}
        >
          <ThemedText
            style={[styles.footerButtonText, styles.footerButtonSecondaryText]}
          >
            返回首页
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, styles.footerButtonPrimary]}
          activeOpacity={0.8}
          onPress={() => router.push("/(home)/demand")}
        >
          <ThemedText style={styles.footerButtonText}>重新申请</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  heroCard: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 16,
    marginTop: 12,
  },
  heroIconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  heroIconBackground: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFECE8",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333333",
  },
  heroDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  sectionCard: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F2F5",
    marginVertical: 16,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 12,
  },
  listDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  listIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  failIconBackground: {
    backgroundColor: "rgba(245,108,108,0.12)",
  },
  suggestionIconBackground: {
    backgroundColor: "#EBF4FF",
  },
  listContent: {
    flex: 1,
    gap: 6,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
  },
  listDescription: {
    fontSize: 13,
    color: "#666666",
    lineHeight: 20,
  },
  listSuggestion: {
    flex: 1,
    fontSize: 13,
    color: "#606266",
    lineHeight: 20,
  },
  helpCard: {
    marginTop: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 12,
    borderColor: "#2B56F6",
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "#F0F7FF",
  },
  helpDescription: {
    fontSize: 13,
    color: "#666666",
    lineHeight: 20,
  },
  helpButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    // borderRadius: 22,
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2B56F6",
  },
  footerBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    gap: 12,
  },
  footerButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 24,
  },
  footerButtonPrimary: {
    backgroundColor: "#2B56F6",
  },
  footerButtonSecondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#2B56F6",
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  footerButtonSecondaryText: {
    color: "#2B56F6",
  },
});
