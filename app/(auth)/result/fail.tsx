import PageHeader from "@/components/PageHeader";
import globalStyles from "@/components/styles/globalStyles";
import { ThemedCard, ThemedText } from "@/components/ui";
import { customColors } from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const RecommendedProductCard = ({ item }: any) => (
  <ThemedCard>
    <View style={styles.productCard}>
      <View>
        <AntDesign name={item.icon} size={28} color={customColors.primary} />
      </View>
      <View style={styles.productIconContainer}>
        <ThemedText style={styles.productTitle}>{item.title}</ThemedText>
        <ThemedText style={styles.productFeature}>{item.feature}</ThemedText>
      </View>
      <View>
        <ThemedText>年利率</ThemedText>
        <ThemedText style={styles.productRate}> {item.rate}</ThemedText>
      </View>
    </View>
  </ThemedCard>
);
export default function FailMessageScreen() {
  const router = useRouter();

  // 热门产品推荐数据
  const recommendedProducts = [
    {
      id: 1,
      icon: "bank",
      title: "企业经营贷",
      feature: "最高可贷1000万",
      rate: "6.5%",
    },
    {
      id: 2,
      icon: "home",
      title: "个人住房抵押贷",
      feature: "最长可贷20年",
      rate: "3.8%",
    },
    {
      id: 3,
      icon: "bank",
      title: "信用消费贷",
      feature: "最快当天放款",
      rate: "8.8%",
    },
  ];

  // 热门产品卡片组件

  return (
    <View style={globalStyles.globalContainer}>
      <PageHeader title="匹配结果" />
      <ScrollView
        style={globalStyles.globalContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyles.globalPaddingBottom}
      >
        {/* 顶部提示 */}
        <ThemedCard>
          <View style={styles.heroIconWrapper}>
            <View style={styles.heroIconBackground}>
              <AntDesign name="info-circle" size={42} color="#FF9800" />
            </View>
          </View>
          <ThemedText style={styles.heroTitle}>匹配结果</ThemedText>
          <ThemedText style={styles.heroDescription}>
            您好，非常抱歉。您填写的需求与我们当前的产品暂时未能匹配。您可以前往下方的“产品大全”页面，根据您的具体情况自行选择适合的贷款产品。
          </ThemedText>
        </ThemedCard>

        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>热门推荐</ThemedText>
          <TouchableOpacity activeOpacity={0.8}>
            <ThemedText style={styles.viewMoreText}>查看更多 {">"}</ThemedText>
          </TouchableOpacity>
        </View>
        {recommendedProducts.map((item) => (
          <RecommendedProductCard key={item.id} item={item} />
        ))}
      </ScrollView>
      {/* 前往产品大全按钮 */}
      <TouchableOpacity
        style={styles.goToProductsButton}
        onPress={() => router.push("/product")}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.goToProductsButtonText}>
          前往产品大全
        </ThemedText>
      </TouchableOpacity>

      {/* 底部说明 */}
      <ThemedText style={styles.bottomNote}>
        查看更多贷款产品，总有一款适合您
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  heroIconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  heroIconBackground: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFFBE6",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 10,
  },
  heroDescription: {
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  viewMoreText: {
    color: customColors.primary,
    fontSize: 14,
  },
  productsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 15,
  },
  productIconContainer: {
    flex: 1,
  },
  productTitle: {
    fontWeight: "600",
  },
  productFeature: {
    fontSize: 14,
    lineHeight: 20,
  },
  productRate: {
    fontSize: 14,
    fontWeight: "bold",
    color: customColors.primary,
    textAlign: "center",
  },
  goToProductsButton: {
    backgroundColor: customColors.primary,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  goToProductsButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomNote: {
    textAlign: "center",
    fontSize: 14,
  },
});
