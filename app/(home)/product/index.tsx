import { ProductCard, ProductCardProps } from "@/components/ProductCard";
import SelectDropdown from "@/components/SelectDropdown";
import SortModal from "@/components/SortModal";
import globalStyles from "@/components/styles/globalStyles";
import { ThemedText, ThemedView } from "@/components/ui";
import { customColors } from "@/constants/theme";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

// 产品类型配置
const productConfig: Record<
  string,
  {
    title: string;
    subtitle: string;
    buttonText: string;
  }
> = {
  mortgage: {
    title: "最高可贷50万元",
    subtitle: "低利率-审批快、手续简单",
    buttonText: "立即申请",
  },
  credit: {
    title: "最高可贷30万元",
    subtitle: "纯信用-无需抵押、快速放款",
    buttonText: "立即申请",
  },
  small: {
    title: "最高可贷10万元",
    subtitle: "小额快速-线上申请、秒批秒放",
    buttonText: "立即申请",
  },
  enterprise: {
    title: "最高可贷500万元",
    subtitle: "企业专享-额度高、利率低",
    buttonText: "立即申请",
  },
};

// 导航标签
const navTabs = [
  { id: "all", label: "全部产品" },
  { id: "mortgage", label: "抵押贷款" },
  { id: "credit", label: "信用贷款" },
  { id: "small", label: "小额贷款" },
  { id: "enterprise", label: "企业贷款" },
];

// 筛选选项
const filterOptions = {
  amount: [
    { label: "不限", value: "1" },
    { label: "1-10万", value: "1-10" },
    { label: "10-30万", value: "10-30" },
    { label: "30-50万", value: "30-50" },
    { label: "50万以上", value: "50+" },
  ],
  rate: [
    { label: "不限", value: "1" },
    { label: "5%以下", value: "0-5" },
    { label: "5%-8%", value: "5-8" },
    { label: "8%-12%", value: "8-12" },
    { label: "12%以上", value: "12+" },
  ],
  term: [
    { label: "不限", value: "1" },
    { label: "1-6期", value: "1-6" },
    { label: "6-12期", value: "6-12" },
    { label: "12-24期", value: "12-24" },
    { label: "24期以上", value: "24+" },
  ],
};

// 产品数据接口
interface ProductData extends Omit<ProductCardProps, "onApply" | "onFavorite"> {
  id: string;
}

// 产品列表数据
const productList: ProductData[] = [
  {
    id: "1",
    icon: require("@/assets/images/icon.png"),
    title: "安心贷 - 个人信用贷款",
    subtitle: "招商银行 - 纯信用 · 无抵押",
    isPreferred: true,
    annualRate: "3.85%",
    loanAmount: "1-30万",
    loanTerm: "1-5年",
    approvalTime: "24小时",
    features: ["无需抵押", "随借随还", "门槛低", "支持提前还款"],
    isFavorited: true,
  },
  {
    id: "2",
    icon: require("@/assets/images/icon.png"),
    title: "安心贷 - 个人信用贷款",
    subtitle: "招商银行 - 纯信用 · 无抵押",
    isPreferred: true,
    annualRate: "3.85%",
    loanAmount: "1-30万",
    loanTerm: "1-5年",
    approvalTime: "24小时",
    features: ["无需抵押", "随借随还", "门槛低", "支持提前还款"],
  },
];

const sortOptions = [
  { label: "默认", value: "default" },
  { label: "按利率", value: "rate" },
  { label: "按期限", value: "term" },
];
export default () => {
  const router = useRouter();
  const { type } = useLocalSearchParams();
  const config = productConfig[type as string] || productConfig.mortgage;

  const [activeTab, setActiveTab] = useState("all");
  const [filterAmount, setFilterAmount] = useState("1");
  const [filterRate, setFilterRate] = useState("1");
  const [filterTerm, setFilterTerm] = useState("1");
  const [menuVisible, setMenuVisible] = useState(false);
  const [sort, setSort] = useState("default");
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    if (type) {
      setActiveTab(type as string);
    }
  }, [type]);

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

  const handleScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    setIsSticky(y > headerHeight);
  };

  const handleHeaderLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  // 导航栏和筛选区域 JSX（可复用）
  const navAndFilterJSX = (
    <ThemedView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.navContent}
      >
        {navTabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={styles.navTab}
            activeOpacity={0.8}
            onPress={() => setActiveTab(tab.id)}
          >
            <ThemedText
              style={[
                styles.navTabText,
                activeTab === tab.id && styles.navTabTextActive,
              ]}
            >
              {tab.label}
            </ThemedText>
            {activeTab === tab.id && <View style={styles.navTabUnderline} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.filterContainer}>
        <View style={styles.filterItem}>
          <SelectDropdown
            label="贷款额度"
            value={filterAmount}
            options={filterOptions.amount}
            onSelect={setFilterAmount}
            placeholder="贷款额度"
            showClear={false}
            showError={false}
            style={styles.filterDropdown}
          />
        </View>
        <View style={styles.filterItem}>
          <SelectDropdown
            label="贷款利率"
            value={filterRate}
            options={filterOptions.rate}
            onSelect={setFilterRate}
            placeholder="贷款利率"
            showClear={false}
            showError={false}
            style={styles.filterDropdown}
          />
        </View>
        <View style={styles.filterItem}>
          <SelectDropdown
            label="贷款期限"
            value={filterTerm}
            options={filterOptions.term}
            onSelect={setFilterTerm}
            placeholder="贷款期限"
            showClear={false}
            showError={false}
            style={styles.filterDropdown}
          />
        </View>
      </View>
    </ThemedView>
  );

  // 固定的导航栏和筛选区域
  const stickyNavAndFilter = (
    <View style={[styles.stickyContainer, isSticky && styles.stickyVisible]}>
      {navAndFilterJSX}
    </View>
  );

  return (
    <View style={globalStyles.globalContainer}>
      {stickyNavAndFilter}
      <ScrollView
        style={globalStyles.globalContainer}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Header 区域 */}
        <View style={styles.headerGradient} onLayout={handleHeaderLayout}>
          <View style={styles.headerContent}>
            <ThemedText style={styles.titleText}>{config.title}</ThemedText>
            <ThemedText style={styles.subtitleText}>
              {config.subtitle}
            </ThemedText>
            <Link href="/demand" asChild>
              <TouchableOpacity style={styles.applyButton} activeOpacity={0.8}>
                <ThemedText style={styles.applyButtonText}>
                  {config.buttonText}
                </ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* 导航栏 筛选区域 */}
        {navAndFilterJSX}

        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>热门推荐</ThemedText>
          <TouchableOpacity activeOpacity={0.8}>
            <ThemedText style={styles.viewMoreText}>查看更多 {">"}</ThemedText>
          </TouchableOpacity>
        </View>

        {/* 内容区域 */}
        {productList.map((product) => (
          <ProductCard
            key={product.id}
            title={product.title}
            subtitle={product.subtitle}
            isPreferred={product.isPreferred}
            annualRate={product.annualRate}
            loanAmount={product.loanAmount}
            loanTerm={product.loanTerm}
            approvalTime={product.approvalTime}
            features={product.features}
            icon={product.icon}
            isFavorited={product.isFavorited}
            onView={() => {
              router.push({
                pathname: "/productDetail",
                params: { id: product.id },
              });
            }}
            onFavorite={() => {
              console.log("收藏", product.id);
            }}
          />
        ))}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>全部产品</ThemedText>
          <TouchableOpacity activeOpacity={0.8} onPress={openMenu}>
            <ThemedText style={styles.viewMoreText}>
              排序：
              {sortOptions.find((option) => option.value === sort)?.label}
            </ThemedText>
          </TouchableOpacity>
        </View>
        {productList.map((product) => (
          <ProductCard
            key={product.id}
            title={product.title}
            subtitle={product.subtitle}
            isPreferred={product.isPreferred}
            annualRate={product.annualRate}
            loanAmount={product.loanAmount}
            loanTerm={product.loanTerm}
            approvalTime={product.approvalTime}
            features={product.features}
            icon={product.icon}
            isFavorited={product.isFavorited}
            onView={() => {
              router.push({
                pathname: "/productDetail",
                params: { id: product.id },
              });
            }}
            onFavorite={() => {
              console.log("收藏", product.id);
            }}
          />
        ))}
      </ScrollView>

      {/* 排序选择 Modal */}
      <SortModal
        visible={menuVisible}
        options={sortOptions}
        selectedValue={sort}
        onSelect={setSort}
        onClose={closeMenu}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    padding: 20,
    backgroundColor: "#2B56F6",
  },
  headerContent: {
    alignItems: "center",
  },
  titleText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitleText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
  },
  applyButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 140,
  },
  applyButtonText: {
    color: "#2B56F6",
    fontSize: 16,
    fontWeight: "bold",
  },

  // 导航栏样式

  navContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  navTab: {
    paddingVertical: 8,
    position: "relative",
    textAlign: "center",
  },
  navTabText: {
    fontSize: 14,
  },
  navTabTextActive: {
    color: customColors.primary,
    fontWeight: "600",
  },
  navTabUnderline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: customColors.primary,
    borderRadius: 1,
  },
  // 筛选区域样式
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
  },
  filterItem: {
    flex: 1,
  },
  filterDropdown: {
    height: 30,
    marginBottom: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  viewMoreText: {
    color: customColors.primary,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  stickyContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    opacity: 0,
    pointerEvents: "none",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: "#ffffff",
  },
  stickyVisible: {
    opacity: 1,
    pointerEvents: "auto",
  },
});
