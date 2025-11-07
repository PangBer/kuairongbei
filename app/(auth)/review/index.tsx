import ExpandItem from "@/components/ExpandItem";
import PageHeader from "@/components/PageHeader";
import { ThemedCard, ThemedText } from "@/components/ui";
import {
  customColors,
  customDarkTheme,
  customLightTheme,
} from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { ProgressBar } from "react-native-paper";

interface ProgressStep {
  label: string;
  completed: boolean;
  active: boolean;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function ReviewScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const paperTheme = isDark ? customDarkTheme : customLightTheme;

  // 倒计时状态（分钟）
  const [remainingMinutes, setRemainingMinutes] = useState(26);

  // 贷款申请数据
  const loanData = {
    title: "安心贷 - 个人信用贷款",
    applicationId: "AP2023051200876",
    status: "审核中",
    applicationAmount: "¥50,000.00",
    estimatedTerm: "12个月",
    applicationDate: "2023-05-12 09:45",
    currentProgress: "资质审核中",
  };

  // 进度步骤
  const progressSteps: ProgressStep[] = [
    { label: "提交申请", completed: true, active: false },
    { label: "资质审核", completed: false, active: true },
    { label: "电话核实", completed: false, active: false },
    { label: "审批通过", completed: false, active: false },
  ];

  // 常见问题
  const faqs: FAQ[] = [
    {
      question: "审核需要多长时间?",
      answer:
        "一般情况下，审核时间为1-3个工作日。我们会在收到您的申请后尽快处理，并在审核过程中通过电话与您联系核实信息。如超过30分钟未收到联系，请及时联系客服协助处理。",
    },
    {
      question: "审核会核实哪些信息?",
      answer:
        "审核过程中，我们会核实您的身份信息、工作信息、收入情况、信用记录等。请确保您提供的信息真实有效，以便我们能够快速完成审核。",
    },
    {
      question: "审核未通过可以重新申请吗?",
      answer:
        "如果您的申请未通过审核，您可以在30天后重新提交申请。建议您在重新申请前，先了解未通过的原因，并确保您的资质符合要求后再提交。",
    },
  ];
  const progress = useMemo(() => {
    return (
      progressSteps.findIndex((step) => step.active) / progressSteps.length
    );
  }, [progressSteps]);
  // 倒计时效果
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingMinutes((prev) => {
        if (prev <= 0) {
          return 0;
        }
        return prev - 1;
      });
    }, 60000); // 每分钟更新一次

    return () => clearInterval(timer);
  }, []);

  // 拨打电话
  const handleCall = () => {
    const phoneNumber = "400-888-9999";
    const url = `tel:${phoneNumber.replace(/-/g, "")}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert("提示", "无法拨打电话，请检查设备是否支持");
        }
      })
      .catch((err) => {
        Alert.alert("错误", "拨打电话失败");
        console.error("拨打电话失败:", err);
      });
  };

  // 打开微信客服
  const handleOpenWeChat = async () => {
    try {
      // 检查微信是否安装
      const canOpenWechat = await Linking.canOpenURL("weixin://");

      if (!canOpenWechat) {
        Alert.alert("提示", "未检测到微信应用，请先安装微信");
        return;
      }

      // 尝试打开微信
      const opened = await Linking.openURL("weixin://");

      if (!opened) {
        Alert.alert("提示", "无法打开微信，请检查是否已安装微信");
      } else {
        Alert.alert(
          "提示",
          "已为您打开微信，请在微信中搜索并添加" +
            "安心贷客服中心" +
            "或扫描客服二维码"
        );
      }
    } catch (error) {
      Alert.alert("错误", "打开微信失败");
      console.error("打开微信失败:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 头部导航 */}
      <PageHeader title="审核进度" />

      <ScrollView
        style={[
          styles.scrollView,
          { backgroundColor: paperTheme.colors.foreground },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 贷款申请详情卡片 */}
        <ThemedCard>
          <View style={styles.loanHeader}>
            <View style={styles.loanTitleRow}>
              <ThemedText style={styles.loanTitle}>
                申请编号: {loanData.applicationId}
              </ThemedText>
              <View style={styles.statusBadge}>
                <ThemedText style={styles.statusBadgeText}>
                  {loanData.status}
                </ThemedText>
              </View>
            </View>
          </View>

          <View>
            <View style={styles.progressSteps}>
              {progressSteps.map((step, index) => (
                <ThemedText key={step.label} style={{ fontSize: 14 }}>
                  {step.label}
                </ThemedText>
              ))}
            </View>
            <ProgressBar
              progress={progress}
              fillStyle={{ backgroundColor: customColors.primary }}
              style={{ backgroundColor: "#E2E8F0" }}
            />
          </View>

          {/* 申请信息网格 */}
          <View
            style={[
              styles.infoGrid,
              {
                borderTopColor: isDark ? "#333" : "#e0e0e0",
              },
            ]}
          >
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <ThemedText style={styles.infoLabel}>申请金额</ThemedText>
                <ThemedText
                  style={[styles.infoValue, { color: customColors.primary }]}
                >
                  {loanData.applicationAmount}
                </ThemedText>
              </View>
              <View style={styles.infoItem}>
                <ThemedText style={styles.infoLabel}>预计期限</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {loanData.estimatedTerm}
                </ThemedText>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <ThemedText style={styles.infoLabel}>申请日期</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {loanData.applicationDate}
                </ThemedText>
              </View>
              <View style={styles.infoItem}>
                <ThemedText style={styles.infoLabel}>当前进度</ThemedText>
                <ThemedText
                  style={[styles.infoValue, { color: customColors.primary }]}
                >
                  {loanData.currentProgress}
                </ThemedText>
              </View>
            </View>
          </View>
        </ThemedCard>

        {/* 处理状态卡片 */}
        <ThemedCard>
          <View style={styles.processingHeader}>
            <View
              style={[styles.infoIconContainer, { backgroundColor: "#FFF3E0" }]}
            >
              <AntDesign name="info-circle" size={20} color="#FF9800" />
            </View>
            <ThemedText style={styles.processingTitle}>审核处理中</ThemedText>
          </View>
          <ThemedText style={styles.processingMessage}>
            您的贷款申请正在审核中，我们将在
            <ThemedText style={styles.highlightText}>
              {remainingMinutes}分钟
            </ThemedText>
            内通过电话与您联系核实信息。如超过30分钟未收到联系，请及时联系客服协助处理。
          </ThemedText>
        </ThemedCard>

        {/* 客服联系方式卡片 */}
        <ThemedCard>
          <ThemedText style={styles.sectionTitle}>客服联系方式</ThemedText>

          {/* 客服热线 */}
          <TouchableOpacity
            style={styles.contactItem}
            onPress={handleCall}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.contactIconContainer,
                { backgroundColor: customColors.primaryContainer },
              ]}
            >
              <AntDesign name="phone" size={20} color={customColors.primary} />
            </View>
            <View style={styles.contactContent}>
              <ThemedText style={styles.contactLabel}>客服热线</ThemedText>
              <ThemedText style={styles.contactValue}>400-888-9999</ThemedText>
            </View>
            <AntDesign name="phone" size={18} color={customColors.primary} />
          </TouchableOpacity>

          {/* 微信客服 */}
          <TouchableOpacity
            style={styles.contactItem}
            onPress={handleOpenWeChat}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.contactIconContainer,
                { backgroundColor: customColors.primaryContainer },
              ]}
            >
              <AntDesign
                name="message"
                size={20}
                color={customColors.primary}
              />
            </View>
            <View style={styles.contactContent}>
              <ThemedText style={styles.contactLabel}>微信客服</ThemedText>
              <ThemedText style={styles.contactValue}>
                安心贷客服中心
              </ThemedText>
            </View>
            <AntDesign name="qrcode" size={18} color={customColors.primary} />
          </TouchableOpacity>

          {/* 服务时间 */}
          <View style={styles.contactItem}>
            <View
              style={[
                styles.contactIconContainer,
                { backgroundColor: customColors.primaryContainer },
              ]}
            >
              <AntDesign
                name="clock-circle"
                size={20}
                color={customColors.primary}
              />
            </View>
            <View style={styles.contactContent}>
              <ThemedText style={styles.contactLabel}>服务时间</ThemedText>
              <ThemedText style={styles.contactValue}>
                工作日 9:00-18:00
              </ThemedText>
            </View>
          </View>
        </ThemedCard>

        {/* 常见问题卡片 */}
        <ThemedCard>
          <ThemedText style={styles.sectionTitle}>常见问题</ThemedText>
          {faqs.map((faq, index) => (
            <ExpandItem
              key={index}
              title={faq.question}
              content={faq.answer}
              defaultExpanded={false}
            />
          ))}
        </ThemedCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loanHeader: {
    marginBottom: 20,
  },
  loanTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  loanTitle: {
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    backgroundColor: "#FF9800",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  applicationId: {
    fontSize: 14,
    marginTop: 4,
  },
  progressSteps: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 5,
  },
  infoGrid: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  processingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  processingTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  processingMessage: {
    fontSize: 14,
    lineHeight: 22,
  },
  highlightText: {
    color: "#FF9800",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  bottomSpacer: {
    height: 20,
  },
});
