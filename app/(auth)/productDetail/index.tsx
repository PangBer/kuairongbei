import ExpandItem from "@/components/ExpandItem";
import PageHeader from "@/components/PageHeader";
import globalStyles from "@/components/styles/globalStyles";
import { ThemedCard, ThemedText, ThemedView } from "@/components/ui";
import {
  customColors,
  customDarkTheme,
  customLightTheme,
} from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import SimpleLineIcons from "@expo/vector-icons/build/SimpleLineIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from "react-native";
import { Appbar, TextInput as PaperTextInput } from "react-native-paper";
interface ProductFeature {
  icon: string;
  title: string;
  description: string;
}

interface Material {
  icon: string;
  label: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // 贷款信息预览状态
  const [applicationAmount, setApplicationAmount] = useState("");
  const [loanTerm, setLoanTerm] = useState("12个月");
  const [showRepaymentPlan, setShowRepaymentPlan] = useState(false);

  const paperTheme = isDark ? customDarkTheme : customLightTheme;
  // 产品数据（实际应该从API获取）
  const productData = {
    id: id || "1",
    icon: require("@/assets/images/icon.png"),
    title: "安心贷 - 个人信用贷款",
    subtitle: "招商银行·纯信用·无抵押",
    isPreferred: true,
    annualRate: "3.85%",
    loanAmount: "1-30万",
    loanTerm: "1-5年",
    approvalTime: "24小时",
    minAmount: 1000,
    maxAmount: 300000,
    loanTerms: ["6个月", "12个月", "24个月", "36个月", "48个月", "60个月"],
  };

  // 产品特点
  const features: ProductFeature[] = [
    {
      icon: "check",
      title: "无需抵押担保",
      description: "纯信用贷款,无需任何抵押物和担保人",
    },
    {
      icon: "clock-circle",
      title: "审批速度快",
      description: "在线提交资料,24小时内完成审批",
    },
    {
      icon: "dashboard",
      title: "随借随还",
      description: "支持提前还款,无违约金,资金使用灵活",
    },
    {
      icon: "lock",
      title: "安全可靠",
      description: "银行正规贷款产品,信息安全有保障",
    },
  ];

  // 申请条件
  const conditions = [
    "年龄在22-55周岁之间的中国大陆居民",
    "个人征信良好,无严重逾期记录",
  ];

  // 所需材料
  const materials: Material[] = [
    { icon: "idcard", label: "身份证正反面" },
    { icon: "credit-card", label: "本人银行卡" },
    { icon: "container", label: "工作证明" },
    { icon: "dollar", label: "收入证明" },
    { icon: "home", label: "居住证明" },
  ];

  // 常见问题
  const faqs: FAQ[] = [
    {
      question: "贷款资金可以用于哪些用途?",
      answer:
        "本产品贷款资金可用于个人及家庭消费,包括但不限于装修、旅游、教育、医疗等合法消费用途,不得用于投资股票、期货、房地产等领域及其他法律法规禁止的用途。",
    },
    {
      question: "如何查询我的贷款审批进度?",
      answer:
        '您可以通过登录APP在"我的贷款"页面查看审批进度,或拨打客服热线400-XXX-XXXX进行咨询。',
    },
    {
      question: "提前还款是否有违约金?",
      answer:
        "本产品支持提前还款且无违约金,您可以随时通过APP或前往银行网点办理提前还款手续。",
    },
    {
      question: "贷款逾期会有什么影响?",
      answer:
        "贷款逾期将影响个人信用记录,可能产生罚息,并影响后续贷款申请。建议您按时还款,保持良好的信用记录。",
    },
  ];

  // 还款计划预览数据
  const repaymentPlan = {
    monthlyPayment: "¥4,321.94",
    totalInterest: "¥1,863.28",
    totalRepayment: "¥51,863.28",
  };

  const handleShare = () => {
    Alert.alert("分享", "分享功能待实现");
  };

  const handleViewApplicationMethod = () => {
    router.push("/subdemand");
  };

  const handleAmountChange = (text: string) => {
    // 只允许数字，允许空字符串
    const numericText = text.replace(/[^0-9]/g, "");
    setApplicationAmount(numericText);
  };

  const handleAmountBlur = () => {
    const amount = parseInt(applicationAmount) || productData.minAmount;
    if (amount < productData.minAmount) {
      setApplicationAmount(productData.minAmount.toString());
    } else if (amount > productData.maxAmount) {
      setApplicationAmount(productData.maxAmount.toString());
    }
  };

  return (
    <>
      {/* 头部导航 */}
      <PageHeader title="产品详情" onRightPress={handleShare}>
        <Appbar.Action
          icon={() => (
            <AntDesign
              name="export"
              size={24}
              color={isDark ? "#ffffff" : "#1a1a1a"}
            />
          )}
          onPress={() => {}}
        />
      </PageHeader>
      <KeyboardAvoidingView
        style={globalStyles.globalContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={45}
      >
        <TouchableWithoutFeedback
          style={globalStyles.globalContainer}
          onPress={Keyboard.dismiss}
        >
          <ScrollView
            style={[
              globalStyles.globalContainer,
              { backgroundColor: paperTheme.colors.foreground },
            ]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={globalStyles.globalPaddingBottom}
          >
            {/* 产品摘要区域 */}
            <ThemedCard>
              <View style={styles.productHeader}>
                <View style={styles.productHeaderLeft}>
                  <View style={styles.iconContainer}>
                    <Image
                      source={productData.icon}
                      style={styles.productIcon}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.productInfo}>
                    <View style={styles.productTitleRow}>
                      <ThemedText style={styles.productTitle}>
                        {productData.title}
                      </ThemedText>
                      {productData.isPreferred && (
                        <View style={styles.preferredBadge}>
                          <ThemedText style={styles.preferredText}>
                            优选
                          </ThemedText>
                        </View>
                      )}
                    </View>
                    <ThemedText style={styles.productSubtitle}>
                      {productData.subtitle}
                    </ThemedText>
                  </View>
                </View>
              </View>

              {/* 关键指标 */}
              <View
                style={[
                  styles.metricsContainer,
                  {
                    borderTopColor: isDark ? "#333" : "#e0e0e0",
                  },
                ]}
              >
                <View style={styles.metricItem}>
                  <ThemedText
                    style={[
                      styles.metricValue,
                      { color: customColors.primary },
                    ]}
                  >
                    {productData.annualRate}
                  </ThemedText>
                  <ThemedText style={styles.metricLabel}>参考年利率</ThemedText>
                </View>
                <View style={styles.metricItem}>
                  <ThemedText style={styles.metricValue}>
                    {productData.loanAmount}
                  </ThemedText>
                  <ThemedText style={styles.metricLabel}>可贷额度</ThemedText>
                </View>
                <View style={styles.metricItem}>
                  <ThemedText style={styles.metricValue}>
                    {productData.loanTerm}
                  </ThemedText>
                  <ThemedText style={styles.metricLabel}>贷款期限</ThemedText>
                </View>
                <View style={styles.metricItem}>
                  <ThemedText style={styles.metricValue}>
                    {productData.approvalTime}
                  </ThemedText>
                  <ThemedText style={styles.metricLabel}>审批时效</ThemedText>
                </View>
              </View>
            </ThemedCard>

            {/* 贷款信息预览 */}
            <ThemedCard>
              <ThemedText style={styles.sectionTitle}>贷款信息预览</ThemedText>

              <View style={styles.loanInputContainer}>
                <View style={styles.inputGroup}>
                  <View style={styles.amountInputContainer}>
                    <PaperTextInput
                      mode="outlined"
                      label="申请金额"
                      value={applicationAmount}
                      onChangeText={handleAmountChange}
                      onBlur={handleAmountBlur}
                      keyboardType="numeric"
                      style={styles.amountInput}
                      contentStyle={styles.amountInputContent}
                      outlineColor={isDark ? "#444" : "#e0e0e0"}
                      activeOutlineColor={customColors.primary}
                      dense
                    />
                    <ThemedText style={styles.amountUnit}>元</ThemedText>
                  </View>
                  <View style={styles.amountRange}>
                    <ThemedText style={styles.amountRangeText}>
                      最低{productData.minAmount.toLocaleString()}元
                    </ThemedText>
                    <ThemedText style={styles.amountRangeText}>
                      最高{productData.maxAmount.toLocaleString()}元
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>贷款期限</ThemedText>
                  <View style={styles.termSelectContainer}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.termScrollContent}
                    >
                      {productData.loanTerms.map((term, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.termOption,
                            {
                              borderColor: isDark ? "#444" : "#e0e0e0",
                            },
                            loanTerm === term && styles.termOptionActive,
                          ]}
                          onPress={() => setLoanTerm(term)}
                          activeOpacity={0.7}
                        >
                          <ThemedText
                            style={[
                              styles.termOptionText,
                              loanTerm === term && styles.termOptionTextActive,
                            ]}
                          >
                            {term}
                          </ThemedText>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </View>

              {/* 还款计划预览 */}
              <View
                style={[
                  styles.repaymentPlanContainer,
                  {
                    borderTopColor: isDark ? "#333" : "#e0e0e0",
                  },
                ]}
              >
                <ThemedText style={styles.repaymentPlanTitle}>
                  还款计划预览
                </ThemedText>
                <View style={styles.repaymentPlanRow}>
                  <View style={styles.repaymentPlanItem}>
                    <ThemedText style={styles.repaymentPlanLabel}>
                      月供金额
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.repaymentPlanValue,
                        { color: customColors.primary },
                      ]}
                    >
                      {repaymentPlan.monthlyPayment}
                    </ThemedText>
                  </View>
                  <View style={styles.repaymentPlanItem}>
                    <ThemedText style={styles.repaymentPlanLabel}>
                      总利息
                    </ThemedText>
                    <ThemedText style={styles.repaymentPlanValue}>
                      {repaymentPlan.totalInterest}
                    </ThemedText>
                  </View>
                  <View style={styles.repaymentPlanItem}>
                    <ThemedText style={styles.repaymentPlanLabel}>
                      还款总额
                    </ThemedText>
                    <ThemedText style={styles.repaymentPlanValue}>
                      {repaymentPlan.totalRepayment}
                    </ThemedText>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.viewPlanButton}
                  onPress={() => setShowRepaymentPlan(!showRepaymentPlan)}
                  activeOpacity={0.7}
                >
                  <ThemedText
                    style={[
                      styles.viewPlanText,
                      { color: customColors.primary },
                    ]}
                  >
                    查看详细还款计划
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </ThemedCard>

            {/* 产品特点 */}
            <ThemedCard>
              <ThemedText style={styles.sectionTitle}>产品特点</ThemedText>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View
                    style={[
                      styles.featureIconContainer,
                      { backgroundColor: customColors.primaryContainer },
                    ]}
                  >
                    <AntDesign
                      name={feature.icon as any}
                      size={20}
                      color={customColors.primary}
                    />
                  </View>
                  <View style={styles.featureContent}>
                    <ThemedText style={styles.featureTitle}>
                      {feature.title}
                    </ThemedText>
                    <ThemedText style={styles.featureDescription}>
                      {feature.description}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </ThemedCard>

            {/* 申请条件 */}
            <ThemedCard>
              <ThemedText style={styles.sectionTitle}>申请条件</ThemedText>
              {conditions.map((condition, index) => (
                <View key={index} style={styles.conditionItem}>
                  <View style={styles.conditionDot} />
                  <ThemedText style={styles.conditionText}>
                    {condition}
                  </ThemedText>
                </View>
              ))}
            </ThemedCard>

            {/* 所需材料 */}
            <ThemedCard>
              <ThemedText style={styles.sectionTitle}>所需材料</ThemedText>
              <View style={styles.materialsGrid}>
                {materials.map((material, index) => (
                  <View key={index} style={styles.materialItem}>
                    <View
                      style={[
                        styles.materialIconContainer,
                        { backgroundColor: customColors.primaryContainer },
                      ]}
                    >
                      <AntDesign
                        name={material.icon as any}
                        size={24}
                        color={customColors.primary}
                      />
                    </View>
                    <ThemedText style={styles.materialLabel}>
                      {material.label}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </ThemedCard>

            {/* 常见问题 */}
            <ThemedCard>
              <ThemedText style={styles.sectionTitle}>常见问题</ThemedText>
              {faqs.map((faq, index) => (
                <ExpandItem
                  key={index}
                  title={faq.question}
                  content={faq.answer}
                  defaultExpanded={index === 0}
                />
              ))}
            </ThemedCard>

            {/* 底部间距 */}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      {/* 底部按钮 */}
      <ThemedView style={styles.footer}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => {
            console.log("收藏");
          }}
          activeOpacity={0.8}
        >
          <SimpleLineIcons name="heart" size={18} color={"#666666"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          activeOpacity={0.8}
          onPress={handleViewApplicationMethod}
        >
          <ThemedText style={styles.applyButtonText}>立即申请</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  productHeader: {
    marginBottom: 16,
  },
  productHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    marginRight: 12,
    backgroundColor: "#f0f0f0",
  },
  productIcon: {
    width: "100%",
    height: "100%",
  },
  productInfo: {
    flex: 1,
  },
  productTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  preferredBadge: {
    backgroundColor: "#E7EEFF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 15,
  },
  preferredText: {
    fontSize: 12,
    fontWeight: "500",
    color: customColors.primary,
  },
  productSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  loanInputContainer: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  amountInput: {
    flex: 1,
    height: 48,
    backgroundColor: "transparent",
  },
  amountInputContent: {
    fontSize: 16,
  },
  amountUnit: {
    fontSize: 16,
    marginTop: 12,
  },
  amountRange: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  amountRangeText: {
    fontSize: 12,
  },
  termSelectContainer: {
    marginTop: 8,
  },
  termScrollContent: {
    gap: 8,
  },
  termOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  termOptionActive: {
    backgroundColor: customColors.primaryContainer,
    borderColor: customColors.primary,
  },
  termOptionText: {
    fontSize: 14,
  },
  termOptionTextActive: {
    color: customColors.primary,
    fontWeight: "600",
  },
  repaymentPlanContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  repaymentPlanTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  repaymentPlanRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  repaymentPlanItem: {
    flex: 1,
    alignItems: "center",
  },
  repaymentPlanLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  repaymentPlanValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  viewPlanButton: {
    alignItems: "center",
    marginTop: 8,
  },
  viewPlanText: {
    fontSize: 14,
  },
  featureItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  conditionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  conditionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: customColors.primary,
    marginTop: 6,
    marginRight: 12,
  },
  conditionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
  materialsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 1,
  },
  materialItem: {
    width: "33%",
    alignItems: "center",
    marginBottom: 20,
  },
  materialIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  materialLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: customColors.primary,
  },
  favoriteButton: {
    width: 44,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
