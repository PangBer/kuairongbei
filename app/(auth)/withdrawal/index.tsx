import PageHeader from "@/components/PageHeader";
import globalStyles from "@/components/styles/globalStyles";
import { ThemedCard, ThemedText } from "@/components/ui";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";

interface firstcardItem {
  title: string;
  subTitle: string;
  num: number;
  text: string;
}
const firstCardList: firstcardItem[] = [
  {
    title: "可用积分",
    subTitle: "可直接用于提现的积分",
    num: 8677,
    text: "分",
  },
  {
    title: "推荐积分",
    subTitle: "邀请好友获得的奖励积分",
    num: 3200,
    text: "分",
  },
  {
    title: "不可用积分",
    subTitle: "为满足提现条件的积分",
    num: 677,
    text: "分",
  },
];

interface BankCard {
  id: string;
  bankName: string;
  cardNumber: string; // 完整卡号，用于加密显示
}

// 银行卡列表初始数据
const initialBankCards: BankCard[] = [
  {
    id: "1",
    bankName: "中国工商银行",
    cardNumber: "6222021234567890123",
  },
  {
    id: "2",
    bankName: "中国建设银行",
    cardNumber: "6227001234567890123",
  },
  {
    id: "3",
    bankName: "中国农业银行",
    cardNumber: "6228481234567890123",
  },
];

// 加密银行卡号显示（显示前4位和后4位，中间用*代替）
const formatCardNumber = (cardNumber: string) => {
  if (cardNumber.length <= 8) return cardNumber;
  const first4 = cardNumber.slice(0, 4);
  const last4 = cardNumber.slice(-4);
  const middle = "*".repeat(cardNumber.length - 8);
  return `${first4} ${middle} ${last4}`;
};

export default function WithdrawalRecordScreen() {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [bankCards, setBankCards] = useState<BankCard[]>(initialBankCards);
  const [selectedBankCard, setSelectedBankCard] = useState<string | null>(
    initialBankCards[0]?.id || null
  );

  const amountOptions = [50, 100, 200, 500];

  // 保存每个 Swipeable 的引用
  const swipeableRefs = useRef<{ [key: string]: SwipeableMethods | null }>({});

  // 当某个 Swipeable 即将打开时，关闭其他所有的
  const handleSwipeableWillOpen = (cardId: string) => {
    Object.keys(swipeableRefs.current).forEach((id) => {
      if (id !== cardId && swipeableRefs.current[id]) {
        swipeableRefs.current[id]?.close();
      }
    });
  };

  // 删除银行卡
  const handleDeleteBankCard = (cardId: string) => {
    setBankCards((prevCards) => {
      const newCards = prevCards.filter((card) => card.id !== cardId);
      // 如果删除的是当前选中的卡，则选择第一张卡
      if (selectedBankCard === cardId && newCards.length > 0) {
        setSelectedBankCard(newCards[0].id);
      } else if (newCards.length === 0) {
        setSelectedBankCard(null);
      }
      return newCards;
    });
  };

  // 渲染删除按钮
  const renderRightActions = (cardId: string) => {
    return (
      <View style={styles.deleteButtonContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteBankCard(cardId)}
          activeOpacity={0.8}
        >
          <AntDesign name="delete" size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  };

  // 格式化积分显示
  const formatPoints = (points: number) => {
    return points.toLocaleString();
  };

  return (
    <>
      <PageHeader title="立即提现" />
      <ScrollView
        style={globalStyles.globalContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 积分明细卡片 */}
        <ThemedCard>
          <View style={styles.cardContainer}>
            <ThemedText style={styles.cardTitle}>积分明细</ThemedText>

            {firstCardList.map((item, index) => (
              <View key={index} style={styles.cardItem}>
                <View style={styles.cardItemLeft}>
                  <ThemedText style={styles.cardItemLeftText}>
                    {item.title}
                  </ThemedText>
                  <ThemedText style={styles.cardItemLeftSubText}>
                    {item.subTitle}
                  </ThemedText>
                </View>
                <View style={styles.cardItemRight}>
                  <ThemedText style={styles.cardItemRightNum}>
                    {formatPoints(item.num)}
                  </ThemedText>
                  <ThemedText style={styles.cardItemRightText}>
                    {item.text}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        </ThemedCard>
        {/* 提现金额卡片 */}
        <ThemedCard>
          <View style={styles.cardContainer}>
            <ThemedText style={styles.cardTitle}>提现金额</ThemedText>
            <View style={styles.amountDisplay}>
              <ThemedText style={styles.amountSymbol}>￥</ThemedText>
              <ThemedText style={styles.amountValue}>
                {selectedAmount}
              </ThemedText>
            </View>

            <View style={styles.amountButtons}>
              {amountOptions.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.amountButton,
                    selectedAmount === amount && styles.amountButtonActive,
                  ]}
                  onPress={() => setSelectedAmount(amount)}
                  activeOpacity={0.8}
                >
                  <ThemedText
                    style={[
                      styles.amountButtonText,
                      selectedAmount === amount &&
                        styles.amountButtonTextActive,
                    ]}
                  >
                    ￥{amount}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            <ThemedText style={styles.amountHint}>
              100积分=1元，最低提现金额为50元
            </ThemedText>
          </View>
        </ThemedCard>
        {/* 提现方式卡片 */}
        <ThemedCard>
          <View style={styles.cardContainer}>
            <ThemedText style={styles.cardTitle}>提现方式</ThemedText>

            {bankCards.map((card) => (
              <Swipeable
                key={card.id}
                // @ts-ignore
                ref={(ref) => {
                  swipeableRefs.current[card.id] = ref;
                }}
                renderRightActions={() => renderRightActions(card.id)}
                overshootRight={false}
                rightThreshold={30}
                friction={2}
                onSwipeableWillOpen={() => handleSwipeableWillOpen(card.id)}
              >
                <TouchableOpacity
                  style={styles.bankCardItem}
                  onPress={() => setSelectedBankCard(card.id)}
                  activeOpacity={0.8}
                >
                  {/* 左侧图标 */}
                  <View style={styles.bankCardIcon}>
                    <AntDesign name="credit-card" size={24} color="#2B56F6" />
                  </View>

                  {/* 中间信息 */}
                  <View style={styles.bankCardInfo}>
                    <ThemedText style={styles.bankCardName}>
                      {card.bankName}
                    </ThemedText>
                    <ThemedText style={styles.bankCardNumber}>
                      {formatCardNumber(card.cardNumber)}
                    </ThemedText>
                  </View>

                  {/* 右侧单选勾选框 */}
                  <View style={styles.radioContainer}>
                    {selectedBankCard === card.id ? (
                      <View style={styles.radioSelected}>
                        <AntDesign name="check" size={16} color="#FFFFFF" />
                      </View>
                    ) : (
                      <View style={styles.radioUnselected} />
                    )}
                  </View>
                </TouchableOpacity>
              </Swipeable>
            ))}
          </View>
        </ThemedCard>

        {/* 提现按钮 */}
        <TouchableOpacity style={styles.submitButton} activeOpacity={0.8}>
          <AntDesign name="swap" size={18} color="#ffffff" />
          <ThemedText style={styles.submitButtonText}>确认提现</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  // 积分明细卡片样式
  cardContainer: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  cardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  cardItemLeft: {
    flex: 1,
  },
  cardItemLeftText: {
    fontSize: 16,
    color: "#999999",
    marginBottom: 6,
  },
  cardItemLeftSubText: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 18,
  },
  cardItemRight: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  cardItemRightNum: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2B56F6",
    lineHeight: 34,
  },
  cardItemRightText: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
  // 提现金额卡片样式
  amountDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 20,
    marginTop: 8,
  },
  amountSymbol: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2B56F6",
    marginRight: 4,
    lineHeight: 48,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2B56F6",
    lineHeight: 48,
  },
  amountButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  amountButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  amountButtonActive: {
    borderColor: "#2B56F6",
    backgroundColor: "#EBF4FF",
  },
  amountButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666666",
  },
  amountButtonTextActive: {
    color: "#2B56F6",
    fontWeight: "bold",
  },
  amountHint: {
    fontSize: 12,
    color: "#999999",
    lineHeight: 18,
    textAlign: "center",
  },
  // 提现方式卡片样式
  bankCardItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  bankCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EBF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  bankCardInfo: {
    flex: 1,
  },
  bankCardName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 6,
  },
  bankCardNumber: {
    fontSize: 14,
    color: "#666666",
    letterSpacing: 1,
  },
  radioContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2B56F6",
    alignItems: "center",
    justifyContent: "center",
  },
  radioUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
  },
  // 提现按钮样式
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2B56F6",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 16,
    gap: 8,
    shadowColor: "#2B56F6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  // 删除按钮容器样式
  deleteButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  // 删除按钮样式
  deleteButton: {
    backgroundColor: "#FF4444",
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
    borderRadius: 18,
  },
});
