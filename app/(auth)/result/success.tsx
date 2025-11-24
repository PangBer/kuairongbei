import PageHeader from "@/components/PageHeader";
import { ThemedCard, ThemedText } from "@/components/ui";
import { customColors } from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

export default () => {
  return (
    <>
      {/* 页面头部 */}
      <PageHeader title="匹配结果" />

      {/* 成功匹配部分 */}
      <View style={styles.successSection}>
        <View style={styles.successIconContainer}>
          <AntDesign
            name="check-circle"
            size={64}
            color={customColors.customGreen}
          />
        </View>
        <ThemedText style={styles.successTitle}>
          已为您匹配到合适机构
        </ThemedText>
        <ThemedText style={styles.successMessage}>
          基于您提交的贷款需求，系统已匹配到1家优质机构，是否选择现在联系？
        </ThemedText>
      </View>

      {/* 机构详情 */}
      <ThemedCard>
        <View style={styles.institutionHeader}>
          <AntDesign name="bank" size={24} color={customColors.primary} />
          <ThemedText style={styles.institutionName}>
            诚信金融服务有限公司
          </ThemedText>
        </View>

        <View style={styles.ratingContainer}>
          <AntDesign name="star" size={16} color="#FFD700" />
          <ThemedText style={styles.rating}>4.8分</ThemedText>
          <ThemedText style={styles.userCount}>· 2.3万+用户选择</ThemedText>
        </View>

        <View style={styles.loanDetails}>
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>可贷额度</ThemedText>
            <ThemedText style={styles.detailValue}>5万-50万元</ThemedText>
          </View>
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>贷款利率</ThemedText>
            <ThemedText style={styles.detailValue}>年化5.8%-8.2%</ThemedText>
          </View>
        </View>
      </ThemedCard>

      {/* 操作按钮 */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => {}}
          icon="chat"
          style={styles.primaryButton}
          buttonColor={customColors.primary}
        >
          是，现在联系
        </Button>

        <Button
          mode="outlined"
          onPress={() => {}}
          icon="phone"
          style={styles.secondaryButton}
          textColor={customColors.primary}
        >
          否，保持电话畅通
        </Button>
      </View>

      {/* 提示信息 */}
      <ThemedText style={styles.note}>
        您也可以在「我的-匹配记录」中查看机构详情
      </ThemedText>
    </>
  );
};

const styles = StyleSheet.create({
  successSection: {
    alignItems: "center",
    padding: 20,
    marginTop: 20,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  institutionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  institutionName: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  rating: {
    marginLeft: 5,
    fontSize: 14,
  },
  userCount: {
    fontSize: 14,
  },
  loanDetails: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 15,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  buttonContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
  primaryButton: {
    borderRadius: 25,
    marginBottom: 10,
  },
  secondaryButton: {
    borderRadius: 25,
  },
  note: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
  },
});
