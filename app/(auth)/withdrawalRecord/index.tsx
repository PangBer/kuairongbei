import PageHeader from "@/components/PageHeader";
import globalStyles from "@/components/styles/globalStyles";
import { ThemedCard, ThemedText } from "@/components/ui";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

interface recordItem {
  withdrawalTime: string;
  estimatedTime: string;
  amount: number;
  cardNumber: string;
  status: number;
}
const recordList: recordItem[] = [
  {
    withdrawalTime: "2025/11/06 16:23:45",
    estimatedTime: "2025/11/07 4:23:45",
    amount: 230,
    cardNumber: "1234567890",
    status: 0,
  },
  {
    withdrawalTime: "2025/11/06 16:23:45",
    estimatedTime: "2025/11/07 4:23:45",
    amount: 230,
    cardNumber: "1234567890",
    status: 1,
  },
  {
    withdrawalTime: "2025/11/06 16:23:45",
    estimatedTime: "2025/11/07 4:23:45",
    amount: 230,
    cardNumber: "1234567890",
    status: 2,
  },
];

export default function WithdrawalRecordScreen() {
  const [selectedscreen, setSelectedscreen] = useState("全部");
  const typeOptions = ["全部", "已到账", "处理中"];

  return (
    <>
      <PageHeader title="提现记录" />
      <ScrollView
        style={globalStyles.globalContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 筛选框 */}
        <ThemedCard>
          <View style={styles.screenButtons}>
            {typeOptions.map((screen) => (
              <TouchableOpacity
                key={screen}
                style={[
                  styles.screenButton,
                  selectedscreen === screen && styles.screenButtonActive,
                ]}
                onPress={() => setSelectedscreen(screen)}
                activeOpacity={0.8}
              >
                <ThemedText
                  style={[
                    styles.screenButtonText,
                    selectedscreen === screen && styles.screenButtonTextActive,
                  ]}
                >
                  {screen}
                </ThemedText>
              </TouchableOpacity>
            ))}
            <View style={styles.screenLeft}>
              <ThemedText style={styles.screenLeftText}>筛选</ThemedText>
              <AntDesign
                name="filter"
                size={20}
                color="#2B56F6"
                style={styles.screenLeftIcon}
              />
            </View>
          </View>
        </ThemedCard>
        {/* 记录列表 */}
        {recordList.map((recordItem, index) => (
          <ThemedCard key={index}>
            <View style={[styles.itemCard, styles.border]}>
              <View>
                <ThemedText style={styles.itemCardTitle}>积分提现</ThemedText>

                <ThemedText style={styles.itemCardText}>
                  {recordItem.withdrawalTime}
                </ThemedText>
              </View>
              <ThemedText style={styles.itemCardAmount}>
                +￥{recordItem.amount}
              </ThemedText>
            </View>
            <View style={styles.itemCard}>
              <View style={styles.itemCard}>
                <ThemedText
                  style={[
                    styles.itemCardStatus,
                    recordItem.status === 0
                      ? styles.type1
                      : recordItem.status === 1
                      ? styles.type2
                      : styles.type3,
                    { marginRight: 10 },
                  ]}
                >
                  {recordItem.status === 0
                    ? "处理中"
                    : recordItem.status === 1
                    ? "已到账"
                    : "已拒绝"}
                </ThemedText>
                <ThemedText style={styles.itemCardText}>
                  银行卡尾号 {recordItem.cardNumber.slice(-4)}
                </ThemedText>
              </View>

              <ThemedText
                style={[
                  styles.itemCardText,
                  recordItem.status === 1 ? styles.itemCardText : styles.blue,
                ]}
              >
                {recordItem.status === 0
                  ? recordItem.estimatedTime
                  : recordItem.status === 1
                  ? "预计1-3个工作日到账"
                  : "查看原因"}
              </ThemedText>
            </View>
          </ThemedCard>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screenButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  screenButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  screenButtonActive: {
    borderColor: "#2B56F6",
    backgroundColor: "#EBF4FF",
  },
  screenButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666666",
  },
  screenButtonTextActive: {
    color: "#2B56F6",
    fontWeight: "bold",
  },
  screenLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    gap: 6,
    paddingHorizontal: 12,
  },
  screenLeftText: {
    color: "#2B56F6",
  },
  screenLeftIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  //提现记录卡片样式
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  //下划线
  border: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 10,
  },
  itemCardTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  itemCardAmount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  itemCardText: {
    fontSize: 12,
    color: "#bcc2c8",
  },
  itemCardStatus: {
    fontSize: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    textAlign: "center",
  },
  type1: {
    color: "#E6A23C",
    backgroundColor: "rgba(230,162,60,0.2)",
  },
  type2: {
    color: "#67C23A",
    backgroundColor: "rgba(103,194,58,0.2)",
  },
  type3: {
    color: "#F56C6C",
    backgroundColor: "rgba(245,108,108,0.2)",
  },
  blue: {
    color: "#2B56F6",
  },
});
