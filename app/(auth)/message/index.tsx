import PageHeader from "@/components/PageHeader";
import globalStyles from "@/components/styles/globalStyles";
import { ThemedCard, ThemedText, ThemedView } from "@/components/ui";
import { customColors } from "@/constants/theme";
import wsService, {
  ConnectionStatus,
  messageStorage,
} from "@/service/WebSocketService";
import { formatTime } from "@/utils";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Appbar, Badge } from "react-native-paper";

export default () => {
  const [chatList, setChatList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    wsService.getStatus()
  );
  const chatListRef = useRef(chatList);
  const [searchText, setSearchText] = useState("");

  // 加载聊天列表
  const loadChatList = async () => {
    try {
      const list = await messageStorage.getChatList();
      if (list.length) {
        // 为每个聊天项添加icon属性（实际应用中应该从其他地方获取）
        setChatList(list);
      } else {
        setChatList([]);
      }
    } catch (error) {
      console.error("加载聊天列表失败:", error);
      Alert.alert("错误", "加载消息列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 过滤搜索结果
  const filteredChats = useMemo(() => {
    chatListRef.current = chatList;
    return chatList.filter(
      (chat) =>
        chat.title.toLowerCase().includes(searchText.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [chatList]);

  // WebSocket连接状态处理
  const handleConnectionStatus = (status: ConnectionStatus) => {
    setConnectionStatus(status);
    console.log("WebSocket连接状态:", status);
  };
  const messageChange = async (message: any) => {
    if (message.sender === "client") {
      try {
        // 通知消息监听器
        const contactIndex = chatListRef.current.findIndex(
          (e) => e.id === message.toId
        );
        if (contactIndex !== -1) {
          // 更新联系人信息
          const newChat = {
            ...chatListRef.current[contactIndex],
            goId: message.goId || message.chatId,
            lastMessage: message.content,
            lastMessageTime: message.timestamp,
            unreadCount: message.id
              ? chatListRef.current[contactIndex].unreadCount + 1
              : 1,
          };

          setChatList((pre: any) => {
            const newList = pre.toSpliced(contactIndex, 1);
            return [newChat, ...newList];
          });
        } else {
          // 添加联系人
          setChatList([
            {
              id: message.toId,
              goId: message.goId || message.chatId,
              title: message.toName,
              lastMessage: message.content,
              lastMessageTime: message.timestamp,
              unreadCount: 1,
              icon: message.toId === "000000" ? "notification" : "bank",
            },
            ...chatList,
          ]);
        }
      } catch (error) {
        console.error("保存接收到的消息失败:", error);
      }
    }
  };
  // 初始化
  useEffect(() => {
    // 加载聊天列表
    loadChatList();

    // 监听WebSocket状态变化
    wsService.onStatusChange(handleConnectionStatus);

    // 监听新消息，更新聊天列表
    wsService.onMessage("all", messageChange);

    // 清理函数
    return () => {
      wsService.offStatusChange(handleConnectionStatus);
      wsService.offMessage("all", messageChange);
      // 注意：这里不调用disconnect，因为可能其他组件还在使用WebSocket连接
    };
  }, []);

  const clearAllUnreadCounts = async () => {
    try {
      await messageStorage.clearAllUnreadCounts();
      setChatList((prev) => prev.map((chat) => ({ ...chat, unreadCount: 0 })));
    } catch (error) {
      console.error("清除所有未读消息数失败:", error);
      Alert.alert("错误", "清除所有未读消息数失败");
    }
  };

  return (
    <>
      {/* 页面头部 */}
      <PageHeader title="消息中心">
        <Appbar.Action
          onPress={async () => {
            // clearAllUnreadCounts();
            await messageStorage.clearAll();
            loadChatList();
          }}
          icon={() => (
            <AntDesign name="clear" size={20} color={customColors.primary} />
          )}
        />
      </PageHeader>

      {/* 连接状态指示器 */}
      <ThemedView style={styles.connectionStatusContainer}>
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor:
                connectionStatus === ConnectionStatus.CONNECTED
                  ? "#4CAF50"
                  : "#FF9800",
            },
          ]}
        />
        <ThemedText style={styles.statusText}>
          {connectionStatus === ConnectionStatus.CONNECTED
            ? "已连接"
            : "连接中..."}
        </ThemedText>
      </ThemedView>

      {/* 搜索框 */}
      <ThemedView style={styles.searchContainer}>
        <FontAwesome5
          name="search"
          size={18}
          color="#999999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="搜索机构或消息内容"
          placeholderTextColor="#999999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </ThemedView>

      {/* 消息列表 */}
      <ScrollView
        style={globalStyles.globalContainer}
        contentContainerStyle={[
          globalStyles.globalPaddingBottom,
          styles.scrollContent,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={customColors.primary} />
            <ThemedText style={styles.loadingText}>加载消息中...</ThemedText>
          </View>
        ) : filteredChats.length === 0 ? (
          <View style={styles.emptyContainer}>
            <AntDesign name="message" size={50} color="#CCCCCC" />
            <ThemedText style={styles.emptyText}>暂无消息</ThemedText>
          </View>
        ) : (
          filteredChats.map((chat) => (
            <Link
              key={chat.id}
              href={{
                pathname: "/message/chat",
                params: {
                  id: chat.id,
                  icon: chat.icon,
                  name: chat.title,
                  goId: chat.goId,
                },
              }}
              asChild
            >
              <Pressable
                onPress={async () => {
                  // 点击聊天项时，清除未读消息数
                  // if (chat.unreadCount > 0) {
                  //   await messageStorage.clearUnreadCount(chat.id);
                  //   // 发送已读回执
                  //   wsService.sendReadReceipt(chat.id);
                  // }
                }}
              >
                <ThemedCard style={styles.messageItem}>
                  <View style={styles.messageHeader}>
                    <View style={styles.iconContainer}>
                      <AntDesign
                        name={chat.icon as any}
                        size={32}
                        color={customColors.primary}
                      />
                    </View>

                    <View style={globalStyles.globalContainer}>
                      <View style={styles.messageTitleRow}>
                        <ThemedText style={styles.messageTitle}>
                          {chat.title}
                        </ThemedText>
                        <ThemedText style={styles.messageTime}>
                          {formatTime(chat.lastMessageTime)}
                        </ThemedText>
                      </View>
                      <View style={styles.messageList}>
                        <ThemedText
                          style={[
                            styles.messageText,
                            chat.unreadCount > 0 && styles.unreadMessageText,
                          ]}
                          numberOfLines={1}
                        >
                          {chat.lastMessage}
                        </ThemedText>
                        {chat.unreadCount > 0 && (
                          <Badge style={styles.badge}>
                            {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                          </Badge>
                        )}
                      </View>
                    </View>
                  </View>
                </ThemedCard>
              </Pressable>
            </Link>
          ))
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  messageItem: {
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 15,
  },
  messageContent: {
    flex: 1,
  },
  messageTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: "bold",
    width: "80%",
  },
  messageTime: {
    fontSize: 12,
  },
  messageText: {
    fontSize: 14,
  },
  messageList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  connectionStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#999999",
  },
  badge: {
    marginLeft: 5,
    backgroundColor: customColors.primary,
  },
  unreadMessageText: {
    fontWeight: "500",
  },
});
