import PageHeader from "@/components/PageHeader";
import globalStyles from "@/components/styles/globalStyles";
import ToastModal, { ToastModalChildrenStyle } from "@/components/ToastModal";
import { ThemedCard, ThemedText } from "@/components/ui";
import { customColors } from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Button } from "react-native-paper";

// 消息类型
type MessageType =
  | "match_success"
  | "match_fail"
  | "system"
  | "points"
  | "match_status";

interface MessageItem {
  id: string;
  type: MessageType;
  title: string;
  content: string;
  time: Date;
  buttonText?: string; // 匹配成功/失败时使用
  confirmButtonText?: string; // 状态通知确认按钮
  cancelButtonText?: string; // 状态通知取消按钮
}

// 时间格式化函数
const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diff / (1000 * 60));

  // 半小时内显示"刚刚"
  if (diffMinutes < 30) {
    return "刚刚";
  }

  // 判断是否是昨天
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    // 昨天显示"昨天+时分"
    const hoursStr = date.getHours().toString().padStart(2, "0");
    const minutesStr = date.getMinutes().toString().padStart(2, "0");
    return `昨天 ${hoursStr}:${minutesStr}`;
  }

  // 更早的消息显示"月-日 时:分"
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hoursStr = date.getHours().toString().padStart(2, "0");
  const minutesStr = date.getMinutes().toString().padStart(2, "0");
  return `${month}-${day} ${hoursStr}:${minutesStr}`;
};

const getMessageIcon = (type: MessageType): string => {
  switch (type) {
    case "match_success":
      return "check-circle";
    case "match_fail":
      return "close-circle";
    case "system":
      return "notification";
    case "points":
      return "gift";
    default:
      return "notification";
  }
};

// 获取图标容器背景色
const getIconBackgroundColor = (type: MessageType): string => {
  switch (type) {
    case "match_success":
      return "#E8F5E9"; // 浅绿色
    case "match_fail":
      return "#FFF3E0"; // 浅橙色
    case "match_status":
      return "#EBF4FF"; // 浅蓝色
    default:
      return "#EBF4FF"; // 默认浅蓝色
  }
};

// 获取图标颜色
const getIconColor = (type: MessageType): string => {
  switch (type) {
    case "match_success":
      return "#67C23A"; // 绿色
    case "match_fail":
      return "#E6A23C"; // 橙色
    case "match_status":
      return "#2B56F6"; // 蓝色
    default:
      return "#2B56F6"; // 默认蓝色
  }
};

// 模拟消息数据
const messageList: MessageItem[] = [
  {
    id: "0",
    type: "match_status",
    title: "匹配状态通知",
    content: "当前匹配的机构暂时无法办理，我们将您的需求上传至公海继续为您匹配",
    time: new Date(Date.now() - 5 * 60 * 1000), // 5分钟前
    confirmButtonText: "同意",
    cancelButtonText: "不同意",
  },
  {
    id: "1",
    type: "match_success",
    title: "匹配成功通知",
    content:
      "恭喜您！您的贷款需求已成功匹配到合适的产品，请尽快前往匹配页查看详情并进行下一步操作。",
    time: new Date(Date.now() - 10 * 60 * 1000), // 10分钟前
    buttonText: "前往匹配页面",
  },
  {
    id: "2",
    type: "match_fail",
    title: "匹配失败通知",
    content:
      "很抱歉，目前没有匹配到适合您的贷款产品。您可以点击查看详情，了解具体原因及后续建议。",
    time: new Date(Date.now() - 25 * 60 * 1000), // 25分钟前
    buttonText: "查看详情",
  },
  {
    id: "3",
    type: "system",
    title: "系统通知",
    content: "您的贷款申请已提交，正在等待系统匹配适合的产品，请耐心等待。",
    time: new Date(Date.now() - 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000), // 昨天
  },
  {
    id: "4",
    type: "points",
    title: "积分到账通知",
    content: "您邀请的好友已成功为您助力,获得100积分奖励,已存入您的帐户。",
    time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
  },
];

export default function MessageScreen() {
  const router = useRouter();
  const [waitingModalVisible, setWaitingModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);

  // 处理按钮点击
  const handleButtonPress = (type: string, action?: "confirm" | "cancel") => {
    // 处理状态通知的双按钮情况
    if (type === "match_status") {
      if (action === "confirm") {
        // 同意操作 - 打开等待模态框
        setWaitingModalVisible(true);
      } else if (action === "cancel") {
        // 不同意操作 - 打开选择其他产品模态框
        setProductModalVisible(true);
      }
      return;
    }

    // 处理原有的单按钮情况
    if (type === "match_fail") {
      router.push("/result/fail");
    } else {
      router.push("/result/success");
    }
  };

  // 处理等待模态框关闭
  const handleWaitingModalClose = () => {
    setWaitingModalVisible(false);
    // 可以在这里添加模态框关闭后的逻辑
  };

  // 处理产品模态框关闭
  const handleProductModalClose = () => {
    setProductModalVisible(false);
    // 导航到产品大全页面
    router.push("/product");
  };

  return (
    <>
      <PageHeader title="消息通知" />
      <ScrollView
        style={globalStyles.globalContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyles.globalPaddingBottom}
      >
        {messageList.map((message, index) => {
          const cardStyles: ViewStyle = {
            ...(index > 0 ? styles.cardMargin : {}),
            ...(message.type === "match_success" ? styles.greenBorder : {}),
            ...(message.type === "match_fail" ? styles.orangeBorder : {}),
            ...(message.type === "match_status" ? styles.blueBorder : {}),
          };

          return (
            <ThemedCard key={message.id} style={cardStyles}>
              <View style={styles.messageContainer}>
                {/* 左侧图标 */}
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: getIconBackgroundColor(message.type) },
                  ]}
                >
                  <AntDesign
                    name={getMessageIcon(message.type) as any}
                    size={24}
                    color={getIconColor(message.type)}
                  />
                </View>

                {/* 右侧内容 */}
                <View style={styles.contentContainer}>
                  {/* 标题和时间行 */}
                  <View style={styles.titleRow}>
                    <ThemedText style={styles.messageTitle}>
                      {message.title}
                    </ThemedText>
                    <ThemedText style={styles.messageTime}>
                      {formatTime(message.time)}
                    </ThemedText>
                  </View>

                  {/* 消息内容 */}
                  <ThemedText style={styles.messageContent}>
                    {message.content}
                  </ThemedText>

                  {/* 匹配状态通知的双按钮 */}
                  {message.type === "match_status" && (
                    <View style={styles.buttonGroup}>
                      <Button
                        mode="outlined"
                        style={{ borderColor: customColors.primary }}
                        onPress={() =>
                          handleButtonPress(message.type, "confirm")
                        }
                      >
                        <AntDesign
                          name="check"
                          size={14}
                          color={customColors.primary}
                        />
                        <Text>{message.confirmButtonText}</Text>
                      </Button>
                      <Button
                        mode="outlined"
                        style={{ borderColor: customColors.onErrorContainer }}
                        onPress={() =>
                          handleButtonPress(message.type, "cancel")
                        }
                      >
                        <AntDesign
                          name="close"
                          size={14}
                          color={customColors.onErrorContainer}
                        />
                        <Text style={{ color: customColors.onErrorContainer }}>
                          {message.cancelButtonText}
                        </Text>
                      </Button>
                    </View>
                  )}

                  {/* 匹配成功/失败时的单按钮 */}
                  {(message.type === "match_success" ||
                    message.type === "match_fail") && (
                    <View style={styles.buttonGroup}>
                      <Button
                        mode="outlined"
                        style={{ borderColor: customColors.primary }}
                        onPress={() => handleButtonPress(message.type)}
                      >
                        <Text>{message.buttonText}</Text>
                      </Button>
                    </View>
                  )}
                </View>
              </View>
            </ThemedCard>
          );
        })}
      </ScrollView>

      {/* 等待提示模态框 */}
      <ToastModal
        visible={waitingModalVisible}
        onConfirm={handleWaitingModalClose}
        onCancel={() => setWaitingModalVisible(false)}
      >
        <View style={ToastModalChildrenStyle.modalIconContainer}>
          <AntDesign name="clock-circle" size={48} color="#2B56F6" />
        </View>
        <ThemedText style={ToastModalChildrenStyle.modalTitle}>
          请您耐心等待
        </ThemedText>
        <ThemedText style={ToastModalChildrenStyle.modalContent}>
          我们已将您的需求上传至公海，会持续为您匹配合适的机构
        </ThemedText>
      </ToastModal>

      {/* 选择其他产品模态框 */}
      <ToastModal
        visible={productModalVisible}
        onConfirm={handleProductModalClose}
        onCancel={() => setProductModalVisible(false)}
        confirmText="前往产品大全"
      >
        <View style={ToastModalChildrenStyle.modalIconContainer}>
          <AntDesign name="product" size={48} color="#2B56F6" />
        </View>
        <ThemedText style={ToastModalChildrenStyle.modalTitle}>
          选择其他产品
        </ThemedText>
        <ThemedText style={ToastModalChildrenStyle.modalContent}>
          请前往APP产品大全选择产品
        </ThemedText>
      </ToastModal>
    </>
  );
}

const styles = StyleSheet.create({
  cardMargin: {
    marginTop: 12,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  contentContainer: {
    flex: 1,
    gap: 8,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  messageTime: {
    fontSize: 12,
    marginLeft: 8,
  },
  messageContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  greenBorder: {
    borderLeftColor: "#67C23A",
    borderLeftWidth: 4,
    paddingLeft: 10,
  },
  orangeBorder: {
    borderLeftColor: "#E6A23C",
    borderLeftWidth: 4,
    paddingLeft: 10,
  },
  blueBorder: {
    borderLeftColor: customColors.primary,
    borderLeftWidth: 4,
    paddingLeft: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
});
