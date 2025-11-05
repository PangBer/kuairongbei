import { ThemedCard, ThemedText } from "@/components/ui";
import { customColors } from "@/constants/theme";
import SimpleLineIcons from "@expo/vector-icons/build/SimpleLineIcons";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export interface ProductCardProps {
  // 产品基本信息
  icon?: string | number; // 图标路径或require的资源
  title: string; // 产品标题
  subtitle?: string; // 银行/产品描述
  isPreferred?: boolean; // 是否显示优选标签

  // 关键指标
  annualRate: string; // 年利率
  loanAmount: string; // 可贷额度
  loanTerm: string; // 贷款期限
  approvalTime: string; // 审批时效

  // 功能标签
  features?: string[]; // 功能标签列表

  // 操作回调
  onView?: () => void; // 立即申请回调
  onFavorite?: () => void; // 收藏回调
  isFavorited?: boolean; // 是否已收藏

  // 样式
  style?: ViewStyle | ViewStyle[];
}
export function ProductCard({
  icon,
  title,
  subtitle,
  isPreferred = false,
  annualRate,
  loanAmount,
  loanTerm,
  approvalTime,
  features = [],
  onView,
  onFavorite,
  isFavorited = false,
  style,
}: ProductCardProps) {
  return (
    <ThemedCard style={style}>
      {/* 头部区域 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {icon && (
            <View style={styles.iconContainer}>
              {typeof icon === "string" ? (
                <Image source={{ uri: icon }} style={styles.icon} />
              ) : (
                <Image source={icon} style={styles.icon} />
              )}
            </View>
          )}
          <View style={styles.headerTextContainer}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            {subtitle && (
              <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
            )}
          </View>
        </View>
        {isPreferred && (
          <View style={styles.preferredBadge}>
            <ThemedText style={styles.preferredText}>优选</ThemedText>
          </View>
        )}
      </View>

      {/* 关键指标区域 */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <ThemedText
            style={[styles.metricValue, { color: customColors.primary }]}
          >
            {annualRate}
          </ThemedText>
          <ThemedText style={styles.metricLabel}>年利率</ThemedText>
        </View>
        <View style={styles.metricItem}>
          <ThemedText style={styles.metricValue}>{loanAmount}</ThemedText>
          <ThemedText style={styles.metricLabel}>可贷额度</ThemedText>
        </View>
        <View style={styles.metricItem}>
          <ThemedText style={styles.metricValue}>{loanTerm}</ThemedText>
          <ThemedText style={styles.metricLabel}>贷款期限</ThemedText>
        </View>
        <View style={styles.metricItem}>
          <ThemedText style={styles.metricValue}>{approvalTime}</ThemedText>
          <ThemedText style={styles.metricLabel}>审批时效</ThemedText>
        </View>
      </View>

      {/* 功能标签区域 */}
      {features.length > 0 && (
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureTag}>
              <ThemedText style={styles.featureText}>{feature}</ThemedText>
            </View>
          ))}
        </View>
      )}

      {/* 底部操作区域 */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onFavorite}
          activeOpacity={0.8}
        >
          <SimpleLineIcons
            name="heart"
            size={18}
            color={isFavorited ? "#ff4444" : "#666666"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={onView}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.applyButtonText}>查看详情</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    marginRight: 12,
    backgroundColor: "#f0f0f0",
  },
  icon: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
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
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#d3d3d3",
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
  },
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    gap: 8,
  },
  featureTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  featureText: {
    fontSize: 12,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: customColors.primary,
  },
  applyButtonText: {
    color: customColors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  favoriteButton: {
    width: 44,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteIcon: {
    fontSize: 20,
  },
});
