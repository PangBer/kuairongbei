import { ThemedCard, ThemedText } from "@/components/ui";
import globalStyles from "@/styles/globalStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

// 消息类型
type MessageType = "match_success" | "match_fail" | "system" | "points";

interface MessageItem {
  id: string;
  type: MessageType;
  title: string;
  content: string;
  time: Date;
  buttonText?: string; // 匹配成功/失败时使用
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
    default:
      return "#2B56F6"; // 默认蓝色
  }
};

// 模拟消息数据
const messageList: MessageItem[] = [
  {
    id: "1",
    type: "match_success",
    title: "匹配成功通知",
    content: "恭喜您！您的贷款需求已成功匹配到合适的产品，请尽快前往匹配页查看详情并进行下一步操作。",
    time: new Date(Date.now() - 10 * 60 * 1000), // 10分钟前
    buttonText: "前往匹配页面",
  },
  {
    id: "2",
    type: "match_fail",
    title: "匹配失败通知",
    content: "很抱歉，目前没有匹配到适合您的贷款产品。您可以点击查看详情，了解具体原因及后续建议。",
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

  // 处理按钮点击
  const handleButtonPress = () => {
    router.push("/(home)/demand");
  };

  return (
    <ScrollView
      style={globalStyles.globalContainer}
      showsVerticalScrollIndicator={false}
    >
      {messageList.map((message, index) => {
        const cardStyles: ViewStyle = {
          ...(index > 0 ? styles.cardMargin : {}),
          ...(message.type === "match_success" ? styles.greenBorder : {}),
          ...(message.type === "match_fail" ? styles.orangeBorder : {}),
        };

        return (
          <ThemedCard key={message.id} style={cardStyles}>
            <View style={styles.messageContainer}>
              {/* 左侧图标 */}
              <View style={[styles.iconContainer, { backgroundColor: getIconBackgroundColor(message.type) }]}>
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
                  <ThemedText style={styles.messageTitle}>{message.title}</ThemedText>
                  <ThemedText style={styles.messageTime}>
                    {formatTime(message.time)}
                  </ThemedText>
                </View>

                {/* 消息内容 */}
                <ThemedText style={styles.messageContent}>{message.content}</ThemedText>

                {/* 匹配成功/失败时的按钮 */}
                {(message.type === "match_success" || message.type === "match_fail") && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    activeOpacity={0.8}
                    onPress={handleButtonPress}
                  >
                    <AntDesign
                      name={message.type === "match_success" ? "arrow-right" : "eye"}
                      size={14}
                      color="#2B56F6"
                    />
                    <ThemedText style={styles.actionButtonText}>
                      {message.buttonText}
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ThemedCard>
        );
      })}
    </ScrollView>
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
    color: "#333333",
    flex: 1,
  },
  messageTime: {
    fontSize: 12,
    color: "#999999",
    marginLeft: 8,
  },
  messageContent: {
    fontSize: 14,
    color: "#666666",
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
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#2B56F6",
    backgroundColor: "#FFFFFF",
    marginTop: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: "#2B56F6",
    fontWeight: "500",
  },
});
