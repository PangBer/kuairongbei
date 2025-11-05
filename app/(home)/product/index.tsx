import SelectDropdown from "@/components/SelectDropdown";
import { ThemedText, ThemedView } from "@/components/ui";
import globalStyles from "@/styles/globalStyles";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
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
  { id: "credit", label: "个人信用贷" },
  { id: "enterprise", label: "企业经营贷" },
  { id: "house", label: "房屋抵押贷款" },
  { id: "vehicle", label: "车辆抵押贷款" },
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

export default () => {
  const { type } = useLocalSearchParams();
  const config = productConfig[type as string] || productConfig.mortgage;

  const [activeTab, setActiveTab] = useState("all");
  const [filterAmount, setFilterAmount] = useState("1");
  const [filterRate, setFilterRate] = useState("1");
  const [filterTerm, setFilterTerm] = useState("1");

  return (
    <ScrollView
      style={globalStyles.globalContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header 区域 */}
      <View style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <ThemedText style={styles.titleText}>{config.title}</ThemedText>
          <ThemedText style={styles.subtitleText}>{config.subtitle}</ThemedText>
          <TouchableOpacity style={styles.applyButton} activeOpacity={0.8}>
            <ThemedText style={styles.applyButtonText}>
              {config.buttonText}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* 导航栏 */}
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
              activeOpacity={0.7}
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
      </ThemedView>

      {/* 筛选区域 */}
      <ThemedView style={styles.filterContainer}>
        <View style={styles.filterItem}>
          <SelectDropdown
            label="贷款额度"
            value={filterAmount}
            options={filterOptions.amount}
            onSelect={setFilterAmount}
            placeholder="贷款额度"
          />
        </View>
        <View style={styles.filterItem}>
          <SelectDropdown
            label="贷款利率"
            value={filterRate}
            options={filterOptions.rate}
            onSelect={setFilterRate}
            placeholder="贷款利率"
          />
        </View>
        <View style={styles.filterItem}>
          <SelectDropdown
            label="贷款期限"
            value={filterTerm}
            options={filterOptions.term}
            onSelect={setFilterTerm}
            placeholder="贷款期限"
          />
        </View>
      </ThemedView>

      {/* 内容区域 */}
      <View style={styles.contentContainer}>
        <ThemedText>产品列表</ThemedText>
      </View>
    </ScrollView>
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
  contentContainer: {
    padding: 16,
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
    color: "#4a9aff",
    fontWeight: "600",
  },
  navTabUnderline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#4a9aff",
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
});
