import PageHeader from "@/components/PageHeader";
import globalStyles from "@/components/styles/globalStyles";
import { ThemedCard, ThemedText, ThemedView } from "@/components/ui";
import {
  customColors,
  customDarkTheme,
  customLightTheme,
} from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function MatchScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const paperTheme = isDark ? customDarkTheme : customLightTheme;

  // 旋转动画
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 创建持续旋转动画
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear, // 线性缓动，确保匀速旋转
        useNativeDriver: true,
      })
    );

    rotateAnimation.start();

    return () => {
      rotateAnimation.stop();
    };
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleGoToPersonalCenter = () => {
    // TODO: 跳转到个人中心
    console.log("前往个人中心");
  };

  return (
    <View style={styles.container}>
      {/* 头部导航 */}
      <PageHeader title="正在匹配" />

      <ScrollView
        style={[
          styles.scrollView,
          { backgroundColor: paperTheme.colors.foreground },
        ]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 匹配中区域 */}
        <View style={styles.matchingSection}>
          {/* 匹配图标 */}
          <Animated.View
            style={[styles.matchingIconContainer, { transform: [{ rotate }] }]}
          >
            <View
              style={[
                styles.matchingIconCircle,
                { backgroundColor: customColors.primaryContainer },
              ]}
            >
              <AntDesign
                name="loading-3-quarters"
                size={48}
                color={customColors.primary}
              />
            </View>
          </Animated.View>

          {/* 匹配标题 */}
          <ThemedText style={styles.matchingTitle}>
            正在为您匹配最佳方案
          </ThemedText>

          {/* 描述文本 */}
          <ThemedText style={styles.matchingDescription}>
            我们正在根据您提交的资质信息,为您匹配最合适的贷款产品,请保持电话畅通,将有专员与您联系
          </ThemedText>

          {/* 预计时间 */}
          <ThemedView style={styles.timeEstimateContainer}>
            <AntDesign
              name="clock-circle"
              size={16}
              color={customColors.onSurfaceVariant}
            />
            <ThemedText style={styles.timeEstimateText}>
              预计匹配时间: 1-3个工作日
            </ThemedText>
          </ThemedView>
        </View>

        {/* 积分奖励卡片 */}
        <ThemedCard style={styles.pointsCard}>
          <View style={styles.pointsCardContent}>
            <View
              style={[
                styles.pointsIconContainer,
                { backgroundColor: "#E8F5E9" },
              ]}
            >
              <AntDesign name="star" size={24} color="#66BB6A" />
            </View>
            <View style={styles.pointsTextContainer}>
              <ThemedText style={styles.pointsTitle}>
                您获得了120积分
              </ThemedText>
              <ThemedText style={styles.pointsDescription}>
                可兑换12元现金
              </ThemedText>
            </View>
          </View>
          <TouchableOpacity
            style={styles.pointsLink}
            onPress={handleGoToPersonalCenter}
            activeOpacity={0.8}
          >
            <ThemedText
              style={[styles.pointsLinkText, { color: customColors.primary }]}
            >
              前往个人中心提取 →
            </ThemedText>
          </TouchableOpacity>
        </ThemedCard>

        {/* 后续步骤 */}
        <View style={styles.stepsSection}>
          <ThemedText style={styles.stepsTitle}>后续步骤</ThemedText>

          {/* 步骤1 */}
          <View style={styles.stepItem}>
            <View
              style={[
                styles.stepNumberContainer,
                { backgroundColor: customColors.primaryContainer },
              ]}
            >
              <ThemedText
                style={[styles.stepNumber, { color: customColors.primary }]}
              >
                1
              </ThemedText>
            </View>
            <View style={styles.stepContent}>
              <ThemedText style={styles.stepTitle}>电话核实信息</ThemedText>
              <ThemedText style={styles.stepDescription}>
                工作人员将在1-3个工作日内与您联系
              </ThemedText>
            </View>
          </View>

          {/* 步骤2 */}
          <View style={styles.stepItem}>
            <View
              style={[
                styles.stepNumberContainer,
                { backgroundColor: customColors.primaryContainer },
              ]}
            >
              <ThemedText
                style={[styles.stepNumber, { color: customColors.primary }]}
              >
                2
              </ThemedText>
            </View>
            <View style={styles.stepContent}>
              <ThemedText style={styles.stepTitle}>审批结果通知</ThemedText>
              <ThemedText style={styles.stepDescription}>
                审批通过后将通过短信发送贷款方案
              </ThemedText>
            </View>
          </View>

          {/* 步骤3 */}
          <View style={styles.stepItem}>
            <View
              style={[
                styles.stepNumberContainer,
                { backgroundColor: customColors.primaryContainer },
              ]}
            >
              <ThemedText
                style={[styles.stepNumber, { color: customColors.primary }]}
              >
                3
              </ThemedText>
            </View>
            <View style={styles.stepContent}>
              <ThemedText style={styles.stepTitle}>确认方案</ThemedText>
              <ThemedText style={styles.stepDescription}>
                确认方案后,将立即进入放款流程
              </ThemedText>
            </View>
          </View>
        </View>

        {/* 底部间距 */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* 底部按钮 */}
      <ThemedView style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.progressButton,
            {
              borderColor: customColors.primary,
            },
          ]}
          activeOpacity={0.8}
        >
          <Link href="/review" replace style={globalStyles.fullWidthHeight}>
            <ThemedText
              style={[
                styles.progressButtonText,
                { color: customColors.primary },
              ]}
            >
              查看我的申请进度
            </ThemedText>
          </Link>
        </TouchableOpacity>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === "ios" ? 50 : 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  matchingSection: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  matchingIconContainer: {
    marginBottom: 24,
  },
  matchingIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  matchingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  matchingDescription: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  timeEstimateContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  timeEstimateText: {
    fontSize: 12,
  },
  pointsCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  pointsCardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  pointsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  pointsTextContainer: {
    flex: 1,
  },
  pointsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  pointsDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  pointsLink: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 12,
  },
  pointsLinkText: {
    fontSize: 14,
    textAlign: "center",
  },
  stepsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  stepItem: {
    flexDirection: "row",
    marginBottom: 24,
  },
  stepNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "600",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  progressButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  progressButtonText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
