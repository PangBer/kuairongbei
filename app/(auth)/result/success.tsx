import PageHeader from "@/components/PageHeader";
import globalStyles from "@/components/styles/globalStyles";
import { ThemedCard, ThemedText } from "@/components/ui";
import {
  customColors,
  customDarkTheme,
  customLightTheme,
} from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
  ViewStyle,
} from "react-native";
import { Button } from "react-native-paper";

interface LoanPlan {
  id: string;
  title: string;
  tag?: string;
  tagColor?: string;
  tagTextColor?: string;
  rate: string;
  monthlyPayment: string;
  limit: string;
  term: string;
  fee: string;
  feature: string;
}

const loanPlans: LoanPlan[] = [
  {
    id: "fast",
    title: "安心贷 · 快速贷",
    tag: "推荐",
    tagColor: "#E0F2FE",
    tagTextColor: customColors.primary,
    rate: "8.7%",
    monthlyPayment: "¥3,194",
    limit: "20万",
    term: "12-36期",
    fee: "0.5%",
    feature: "最快1小时放款 · 灵活还款",
  },
  {
    id: "smart",
    title: "安心贷 · 优享贷",
    rate: "7.5%",
    monthlyPayment: "¥3,042",
    limit: "20万",
    term: "12-60期",
    fee: "0.3%",
    feature: "低利率 · 高额度",
  },
  {
    id: "flex",
    title: "安心贷 · 尊享贷",
    tag: "任选",
    tagColor: "#EEF2FF",
    tagTextColor: "#4338CA",
    rate: "6.8%",
    monthlyPayment: "¥2,995",
    limit: "30万",
    term: "12-60期",
    fee: "0.2%",
    feature: "超低利率 · 大额尊享",
  },
];

const warmTips = [
  "您可以选择任意贷款方案，也可以联系客服为您定制个性方案",
  "所有方案均支持预支，系统会在24小时内完成放款",
];

export default function ResultScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string>(loanPlans[0].id);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const paperTheme = isDark ? customDarkTheme : customLightTheme;

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleConfirmSelection = () => {
    router.push({
      pathname: "/(auth)/productDetail",
      params: { planId: selectedPlan },
    });
  };

  const handleContactService = () => {
    const phoneNumber = "400-888-8888";
    const url = `tel:${phoneNumber.replace(/-/g, "")}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  };

  return (
    <View style={globalStyles.globalContainer}>
      <PageHeader title="审核结果" />
      <ScrollView
        style={[
          globalStyles.globalContainer,
          { backgroundColor: paperTheme.colors.foreground },
        ]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyles.globalPaddingBottom}
      >
        <ThemedCard style={styles.resultCard}>
          <View style={{ alignItems: "center" }}>
            <View
              style={[
                styles.statusIcon,
                { backgroundColor: customColors.primaryContainer },
              ]}
            >
              <AntDesign
                name="check-circle"
                size={40}
                color={customColors.primary}
              />
            </View>
          </View>
          <ThemedText style={styles.statusTitle}>
            恭喜！您的审核已通过
          </ThemedText>
          <ThemedText style={styles.statusSubtitle}>
            根据您的资质评估，我们为您准备了以下贷款方案，您可以选择最适合的方案进行下一步操作。
          </ThemedText>
        </ThemedCard>

        {loanPlans.map((plan) => {
          const isActive = selectedPlan === plan.id;
          const planCardStyle: ViewStyle[] = [
            styles.planCard,
            { borderColor: isActive ? customColors.primary : "#E5E7EB" },
          ];
          if (isActive) {
            planCardStyle.push(styles.planCardFocused);
          }
          return (
            <TouchableOpacity
              key={plan.id}
              activeOpacity={0.9}
              onPress={() => handlePlanSelect(plan.id)}
            >
              <ThemedCard style={planCardStyle}>
                <View style={styles.planHeader}>
                  <View>
                    <View style={styles.planTitleRow}>
                      <ThemedText style={styles.planTitle}>
                        {plan.title}
                      </ThemedText>
                      {plan.tag ? (
                        <View
                          style={[
                            styles.planTag,
                            {
                              backgroundColor: plan.tagColor || "#F1F5F9",
                            },
                          ]}
                        >
                          <ThemedText
                            style={[
                              styles.planTagText,
                              {
                                color:
                                  plan.tagTextColor ||
                                  customColors.onPrimaryContainer,
                              },
                            ]}
                          >
                            {plan.tag}
                          </ThemedText>
                        </View>
                      ) : null}
                    </View>
                    <View style={styles.featureContainer}>
                      <AntDesign
                        name="clock-circle"
                        size={16}
                        color={customColors.primary}
                      />
                      <ThemedText style={styles.featureText}>
                        {plan.feature}
                      </ThemedText>
                    </View>
                  </View>

                  <View style={styles.rateContainer}>
                    <ThemedText style={styles.rateValue}>
                      {plan.rate}
                    </ThemedText>
                    <ThemedText style={styles.rateLabel}>年化利率</ThemedText>
                  </View>
                </View>

                <View style={styles.planBody}>
                  <View style={styles.planInfoRow}>
                    <View style={styles.planInfoItem}>
                      <ThemedText style={styles.infoLabel}>最高额度</ThemedText>
                      <ThemedText style={styles.infoValue}>
                        {plan.limit}
                      </ThemedText>
                    </View>
                    <View style={styles.planInfoItem}>
                      <ThemedText style={styles.infoLabel}>期限</ThemedText>
                      <ThemedText style={styles.infoValue}>
                        {plan.term}
                      </ThemedText>
                    </View>
                    <View style={styles.planInfoItem}>
                      <ThemedText style={styles.infoLabel}>手续费</ThemedText>
                      <ThemedText style={styles.infoValue}>
                        {plan.fee}
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.planFooter}>
                    <ThemedText style={styles.monthlyLabel}>
                      月供参考
                    </ThemedText>
                    <ThemedText style={styles.monthlyValue}>
                      {plan.monthlyPayment}
                    </ThemedText>
                    <ThemedText style={styles.monthlyDesc}>
                      （贷款10万，等额本息）
                    </ThemedText>
                  </View>
                </View>
              </ThemedCard>
            </TouchableOpacity>
          );
        })}

        <ThemedCard style={styles.tipCard}>
          <ThemedText style={styles.tipTitle}>温馨提示</ThemedText>
          {warmTips.map((tip) => (
            <View key={tip} style={styles.tipItem}>
              <View style={styles.tipDot} />
              <ThemedText style={styles.tipText}>{tip}</ThemedText>
            </View>
          ))}
          <TouchableOpacity
            style={styles.serviceButton}
            onPress={handleContactService}
            activeOpacity={0.8}
          >
            <AntDesign name="phone" size={18} color={customColors.primary} />
            <ThemedText style={styles.serviceText}>
              联系客服 400-888-8888
            </ThemedText>
          </TouchableOpacity>
        </ThemedCard>

        <View style={styles.primaryButtonContainer}>
          <Button
            mode="contained"
            onPress={handleConfirmSelection}
            style={styles.primaryButton}
          >
            确认选择并下一步
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  resultCard: {
    alignItems: "center",
    paddingVertical: 32,
  },
  statusIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  statusSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },

  planCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 20,
    position: "relative",
  },
  planCardFocused: {
    shadowColor: customColors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  planTitleRow: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    gap: 10,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  planTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  planTagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  rateContainer: {
    alignItems: "flex-end",
  },
  rateValue: {
    fontSize: 24,
    fontWeight: "700",
    color: customColors.primary,
  },
  rateLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  planBody: {
    gap: 16,
  },
  planInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  planInfoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  planFooter: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 12,
  },
  monthlyLabel: {
    fontSize: 12,
    color: "#94A3B8",
  },
  monthlyValue: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 4,
  },
  monthlyDesc: {
    fontSize: 12,
    color: "#94A3B8",
  },
  featureContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    gap: 6,
  },
  featureText: {
    fontSize: 12,
    color: customColors.primary,
  },

  planRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tipCard: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 10,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: customColors.primary,
    marginTop: 6,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#94A3B8",
  },
  serviceButton: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginTop: 12,
  },
  serviceText: {
    fontSize: 14,
    color: customColors.primary,
    fontWeight: "600",
  },
  primaryButtonContainer: {
    marginHorizontal: 10,
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 6,
  },
});
