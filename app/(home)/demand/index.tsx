import globalStyles from "@/components/styles/globalStyles";
import { ThemedCard, ThemedText } from "@/components/ui";
import { customColors } from "@/constants/theme";
import { AntDesign } from "@expo/vector-icons";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
interface Feature {
  id: number;
  icon?: any;
  title: string;
  description: string;
}

export default function DemandScreen() {
  // 特性数据
  const features: Feature[] = [
    {
      id: 1,
      icon: "thunderbolt",
      title: "极速匹配",
      description: "AI智能算法，2分钟内完成产品匹配",
    },
    {
      id: 2,
      icon: "verified",
      title: "信息安全",
      description: "银行级加密技术，保障您的信息安全",
    },
    {
      id: 3,
      icon: "tags",
      title: "最优选择",
      description: "根据您的需求，筛选最合适的贷款方案",
    },
  ];

  // 统计数据
  const statistics = [
    {
      value: "10万+",
      label: "成功匹配",
    },
    {
      value: "98%",
      label: "用户满意度",
    },
    {
      value: "50+",
      label: "合作机构",
    },
  ];

  return (
    <ScrollView
      style={globalStyles.globalContainer}
      contentContainerStyle={[
        globalStyles.globalPaddingBottom,
        { paddingTop: 20 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* 标题区域 */}
      <View style={styles.headerSection}>
        <ThemedText style={styles.mainTitle}>发布您的需求，</ThemedText>
        <ThemedText style={styles.mainTitle}>最快2分钟匹配最佳产品</ThemedText>
        <ThemedText style={styles.subtitle}>
          填写真实信息，我们将为您智能匹配最适合的贷款产品
        </ThemedText>
      </View>

      {/* 特性卡片区域 */}
      <ThemedCard>
        {features.map((feature) => (
          <View key={feature.id} style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <AntDesign
                name={feature.icon}
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

      <ThemedCard>
        <ThemedText style={styles.featureTitle}>填写需求提醒</ThemedText>
        <View>
          <ThemedText style={styles.featureDescription}>
            请根据自身实际情况填写需求哦，上传照片可扩大真实性，最高还可以获得50元现金返现哦
          </ThemedText>
        </View>
      </ThemedCard>
      {/* 立即申请按钮 */}
      <Link href="/subdemand" asChild>
        <Button mode="outlined" style={styles.applyButton}>
          立即申请
        </Button>
      </Link>

      {/* 服务条款提示 */}
      <ThemedText style={styles.termsText}>
        点击"立即申请"即表示您同意我们的
        <Link
          href={{
            pathname: "/doc",
            params: {
              name: "sqxy",
            },
          }}
          asChild
        >
          <Text style={styles.termsLink}>《用户协议》</Text>
        </Link>
        <Text>和</Text>
        <Link
          href={{
            pathname: "/doc",
            params: {
              name: "yszc",
            },
          }}
          asChild
        >
          <Text style={styles.termsLink}>《隐私政策》</Text>
        </Link>
      </ThemedText>
      {/* 统计数据区域 */}
      <View style={styles.statisticsSection}>
        {statistics.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
            <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    marginBottom: 30,
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  featureCard: {
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
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
  applyButton: {
    marginVertical: 16,
    marginHorizontal: 10,

    borderColor: customColors.primary,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: customColors.primary,
  },
  termsText: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 18,
  },
  termsLink: {
    color: customColors.primary,
    textDecorationLine: "underline",
  },
  statisticsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: customColors.outlineVariant,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: customColors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
});
