import globalStyles from "@/components/styles/globalStyles";
import { ThemedCard, ThemedText } from "@/components/ui";
import { customColors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

// 产品数据类型定义
interface Product {
  id: string;
  name: string;
  yieldLabel: string;
  yieldValue: string;
  info: string;
  remainingQuota?: string;
  riskLevel?: string;
  buttonText: string;
}

// 示例产品数据
const productsData: Product[] = [
  {
    id: "1",
    name: "安心理财90天",
    yieldLabel: "七日年化收益率",
    yieldValue: "4.25%",
    info: "期限:90天起购:1,000元",
    riskLevel: "剩余额度: 86.5万",
    buttonText: "购买",
  },
  {
    id: "2",
    name: "科技成长基金",
    yieldLabel: "近一年收益率",
    yieldValue: "18.6%",
    info: "开放申购起购:100元",
    riskLevel: "风险等级:R4",
    buttonText: "定投",
  },
  {
    id: "3",
    name: "科技成长基金",
    yieldLabel: "近一年收益率",
    yieldValue: "18.6%",
    info: "开放申购起购:100元",
    riskLevel: "风险等级:R4",
    buttonText: "定投",
  },
  {
    id: "4",
    name: "科技成长基金",
    yieldLabel: "近一年收益率",
    yieldValue: "18.6%",
    info: "开放申购起购:100元",
    riskLevel: "风险等级:R4",
    buttonText: "定投",
  },
];

export default () => {
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  return (
    <ScrollView
      style={globalStyles.globalContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#007aff"]} // Android 下拉圈颜色
          tintColor="#007aff" // iOS 下拉圈颜色
          title="正在刷新..." // iOS 提示文本
        />
      }
    >
      {/* 顶部渐变头部区域 */}
      <View style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <ThemedText style={styles.welcomeText}>您好,欢迎回来</ThemedText>
          <View style={styles.creditLimitContainer}>
            <ThemedText style={styles.creditLimitLabel}>预计额度:</ThemedText>
            <ThemedText style={styles.creditLimitValue}>1454545￥</ThemedText>
          </View>

          {/* 积分显示区域 */}
          <View style={styles.pointsContainer}>
            <View style={styles.pointItem}>
              <ThemedText style={styles.pointLabel}>可用积分</ThemedText>
              <ThemedText style={styles.pointValue}>***</ThemedText>
            </View>
            <View style={styles.pointItem}>
              <ThemedText style={styles.pointLabel}>总积分</ThemedText>
              <ThemedText style={styles.pointValue}>***</ThemedText>
            </View>
            <View style={styles.pointItem}>
              <ThemedText style={styles.pointLabel}>推荐积分</ThemedText>
              <ThemedText style={styles.pointValue}>***</ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* 快捷功能区域 */}
      <ThemedCard>
        <ThemedText style={[styles.sectionTitle, { marginBottom: 16 }]}>
          快捷功能
        </ThemedText>
        <View style={styles.functionsGrid}>
          <Link
            href={{
              pathname: "/product",
              params: {
                type: "mortgage",
              },
            }}
            asChild
          >
            <TouchableOpacity style={styles.functionItem} activeOpacity={0.8}>
              <View
                style={[styles.functionIcon, { backgroundColor: "#C5DEFE" }]}
              >
                <Ionicons name="swap-horizontal" size={20} color="#2C74FF" />
              </View>
              <ThemedText style={styles.functionLabel}>抵押贷</ThemedText>
            </TouchableOpacity>
          </Link>
          <Link
            href={{
              pathname: "/product",
              params: {
                type: "credit",
              },
            }}
            asChild
          >
            <TouchableOpacity style={styles.functionItem} activeOpacity={0.8}>
              <View
                style={[styles.functionIcon, { backgroundColor: "#D2FEE0" }]}
              >
                <Ionicons name="wallet" size={20} color="#22C55E" />
              </View>
              <ThemedText style={styles.functionLabel}>信用贷</ThemedText>
            </TouchableOpacity>
          </Link>

          <Link
            href={{
              pathname: "/product",
              params: {
                type: "small",
              },
            }}
            asChild
          >
            <TouchableOpacity style={styles.functionItem} activeOpacity={0.8}>
              <View
                style={[styles.functionIcon, { backgroundColor: "#F7E3E3" }]}
              >
                <Ionicons name="card" size={20} color="#EF4544" />
              </View>
              <ThemedText style={styles.functionLabel}>小额贷</ThemedText>
            </TouchableOpacity>
          </Link>

          <Link
            href={{
              pathname: "/product",
              params: {
                type: "enterprise",
              },
            }}
            asChild
          >
            <TouchableOpacity style={styles.functionItem} activeOpacity={0.8}>
              <View
                style={[styles.functionIcon, { backgroundColor: "#FCF6DB" }]}
              >
                <Ionicons name="bar-chart" size={20} color="#F59E0C" />
              </View>
              <ThemedText style={styles.functionLabel}>企业贷</ThemedText>
            </TouchableOpacity>
          </Link>
        </View>
      </ThemedCard>
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>热门推荐</ThemedText>
        <TouchableOpacity activeOpacity={0.8}>
          <ThemedText style={styles.viewMoreText}>查看更多 {">"}</ThemedText>
        </TouchableOpacity>
      </View>
      {/* 推荐产品区域 */}
      <View style={styles.productsContainer}>
        {productsData.map((product) => (
          <ThemedCard
            key={product.id}
            style={[
              styles.productCard,
              {
                width: (width - 40) / 2,
              },
            ]}
          >
            <ThemedText style={styles.productName}>{product.name}</ThemedText>
            <ThemedText style={styles.yieldLabel}>
              {product.yieldLabel}
            </ThemedText>
            <ThemedText style={styles.yieldValue}>
              {product.yieldValue}
            </ThemedText>
            <ThemedText style={styles.productInfo}>{product.info}</ThemedText>

            <ThemedText style={styles.riskLevel}>
              {product.riskLevel}
            </ThemedText>

            <TouchableOpacity style={styles.purchaseButton} activeOpacity={0.8}>
              <ThemedText style={styles.purchaseButtonText}>
                {product.buttonText}
              </ThemedText>
            </TouchableOpacity>
          </ThemedCard>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: "#2B56F6",
  },
  headerContent: {
    alignItems: "flex-start",
  },
  welcomeText: {
    color: "white",
    fontSize: 16,
    marginBottom: 8,
  },
  creditLimitContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    gap: 8,
  },
  creditLimitLabel: {
    color: "white",
    fontSize: 24,
  },
  creditLimitValue: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  applyMoreButton: {
    marginBottom: 20,
  },
  applyMoreText: {
    color: "white",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  pointsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  pointItem: {
    alignItems: "center",
    flex: 1,
  },
  pointLabel: {
    color: "white",
    fontSize: 12,
    marginBottom: 4,
  },
  pointValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  functionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  functionItem: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 8,
  },
  functionIcon: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  functionLabel: {
    fontSize: 14,
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  viewMoreText: {
    color: customColors.primary,
    fontSize: 14,
  },
  productsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  yieldLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  yieldValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff4444",
    marginBottom: 8,
  },
  productInfo: {
    fontSize: 12,
    marginBottom: 4,
  },
  remainingQuota: {
    fontSize: 12,
    marginBottom: 12,
  },
  riskLevel: {
    fontSize: 12,
    marginBottom: 12,
  },
  purchaseButton: {
    borderWidth: 1,
    borderColor: customColors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  purchaseButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: customColors.primary,
  },
});
