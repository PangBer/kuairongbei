import KeyboardGuard from "@/components/KeyboardGuard";
import PageHeader from "@/components/PageHeader";
import globalStyles from "@/components/styles/globalStyles";
import { ThemedText, ThemedView } from "@/components/ui";
import { customColors } from "@/constants/theme";
import {
  generateMessageId,
  Message,
  MessageStatus,
  messageStorage,
  MessageType,
  wsService,
} from "@/service/WebSocketService";
import { useAuth } from "@/store/hooks";
import { formatTime } from "@/utils";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// 消息项组件
const MessageItem = ({ item, icon }: any) => {
  const isMe = item.sender === "mobile";

  return (
    <View
      style={[
        styles.messageRow,
        isMe ? styles.messageRowMe : styles.messageRowOther,
      ]}
    >
      {!isMe && (
        <View style={styles.avatarContainer}>
          <AntDesign name={icon} size={32} color={customColors.primary} />
        </View>
      )}
      <View style={{ maxWidth: "70%" }}>
        <View
          style={[
            styles.messageBubble,
            globalStyles.globalContainer,
            isMe ? styles.messageBubbleMe : styles.messageBubbleOther,
            item.status === "failed" && styles.messageBubbleFailed,
          ]}
        >
          <ThemedText style={[styles.messageText, isMe && { color: "#fff" }]}>
            {item.content}
          </ThemedText>
        </View>
        <ThemedText
          style={[styles.messageTime, isMe && { textAlign: "right" }]}
        >
          {formatTime(item.timestamp)}
        </ThemedText>
        {item.status === "failed" && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              // 重发失败的消息
              // if (item.id && item.chatId) {
              //   wsService.sendMessage(item);
              // }
            }}
          >
            <ThemedText style={styles.retryButtonText}>重发</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default () => {
  const {
    id,
    name,
    icon = "bank",
    goId,
  }: {
    id: string;
    name?: string;
    icon?: string;
    goId: string;
  } = useLocalSearchParams();
  const { userInfo } = useAuth();
  const chatId = id.toString();
  const chatName = name || "";
  const toId = userInfo?.userId.toString() || "";
  const toName = userInfo?.name || userInfo?.mobilePhone.slice(-4) || "";

  const flatListRef = useRef<FlatList>(null);
  const [messageList, setMessageList] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(0);

  // 加载聊天历史消息
  const loadChatMessages = async () => {
    setLoading(true);
    try {
      let messages = await messageStorage.getMessagesByChatId(chatId);
      if (messages.length > messageList.length) {
        messages = messages.reverse().slice(pages * 10, pages * 10 + 10);
        setPages((pre) => pre + 1);
        setMessageList((pre) => [...messages.reverse(), ...pre]);

        if (!pages) {
          // 加载草稿
          const draft = await messageStorage.getDraft(chatId);
          if (draft) {
            setInputText(draft);
          }
          await new Promise((resolve) => {
            let t = setTimeout(() => {
              resolve(null);
              clearTimeout(t);
            }, 100);
          });
          scrollToBottom(true);
        }
      }

      // 清除未读消息数
      await messageStorage.clearUnreadCount(chatId);
      // 发送已读回执
      // 注意：这里暂时注释掉，因为此时还没有具体的消息ID可用
    } catch (error) {
      console.error("加载聊天消息失败:", error);
      Alert.alert("错误", "加载聊天记录失败");
    } finally {
      setLoading(false);
    }
  };
  const onFastScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (Platform.OS !== "web") return;
    const offsetY = event.nativeEvent.contentOffset.y;

    if (offsetY <= 0) {
      loadChatMessages();
      // 触发你的逻辑
    }
  };
  // 发送消息
  const sendMessage = async () => {
    const content = inputText.trim();
    if (!content) return;

    // 生成临时消息
    const tempMessage = {
      id: generateMessageId(),
      chatId,
      chatName,
      content,
      sender: "mobile" as Message["sender"],
      toId,
      toName,
      goId,
      type: MessageType.TEXT,
      status: "sending" as Message["status"],
      timestamp: Date.now(),
    };

    // 立即更新UI
    setMessageList((prev) => [...prev, tempMessage]);
    setInputText("");

    // 清空草稿
    await messageStorage.saveDraft(chatId, "");

    // 滚动到底部
    await new Promise((resolve) => {
      let t = setTimeout(() => {
        resolve(null);
        clearTimeout(t);
      }, 100);
    });
    scrollToBottom(true);

    try {
      // 保存到本地存储
      // await messageStorage.saveMessage(tempMessage);

      // 通过WebSocket发送消息
      await wsService.sendMessage(tempMessage);

      // 更新消息状态为已发送
      updateMessageStatus(tempMessage.id, "sent");
    } catch (error) {
      console.error("发送消息失败:", error);
      // 更新消息状态为发送失败
      updateMessageStatus(tempMessage.id, "failed");
    }
  };

  // 更新消息状态
  const updateMessageStatus = async (
    messageId: string,
    status: MessageStatus
  ) => {
    setMessageList((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, status } : msg))
    );

    // 更新本地存储中的消息状态
    try {
      await messageStorage.updateMessageStatus(chatId, messageId, status);
    } catch (error) {
      console.error("更新消息状态失败:", error);
    }
  };

  // 保存草稿
  const handleInputChange = async (content: string) => {
    setInputText(content);
    // 自动保存草稿
    if (content.trim()) {
      await messageStorage.saveDraft(chatId, content);
    }
  };
  // 监听新消息
  const handleNewMessage = async (message: any) => {
    if (message.toId === chatId && message.sender === "client") {
      // 更新UI
      setMessageList((prev) => [...prev, message]);

      // 滚动到底部
      await new Promise((resolve) => {
        let t = setTimeout(() => {
          resolve(null);
          clearTimeout(t);
        }, 100);
      });
      scrollToBottom(true);
    }
  };
  // 初始化
  useEffect(() => {
    loadChatMessages();

    wsService.onMessage(chatId, handleNewMessage);

    // 清理函数
    return () => {
      wsService.offMessage(chatId, handleNewMessage);
    };
  }, [chatId]);

  // ------- 关键：滚动到底部函数 -------
  const scrollToBottom = (animated = true, h = 0) => {
    requestAnimationFrame(async () => {
      flatListRef.current?.scrollToEnd({ animated });

      // 清除未读消息数
      await messageStorage.clearUnreadCount(chatId);
    });
  };

  return (
    <>
      {/* 头部 */}
      <PageHeader title={name} />
      {/* 消息列表 */}

      <KeyboardGuard
        touchableComponent={
          <FlatList
            ref={flatListRef}
            data={messageList}
            renderItem={({ item }) => <MessageItem item={item} icon={icon} />}
            keyExtractor={(item) => item.id}
            style={[globalStyles.globalContainer, { paddingHorizontal: 10 }]}
            contentContainerStyle={[
              // globalStyles.globalPaddingBottom,
              styles.messageListContent,
            ]}
            onScroll={onFastScroll}
            onRefresh={loadChatMessages}
            refreshing={loading}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator
                    size="large"
                    color={customColors.primary}
                  />
                  <ThemedText style={styles.loadingText}>
                    加载消息中...
                  </ThemedText>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <AntDesign name="message" size={50} color="#CCCCCC" />
                  <ThemedText style={styles.emptyText}>
                    暂无消息，开始聊天吧
                  </ThemedText>
                </View>
              )
            }
          />
        }
      >
        {/* 输入框 */}
        <ThemedView style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="请输入您想咨询的问题..."
            placeholderTextColor="#999999"
            value={inputText}
            onChangeText={handleInputChange}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            activeOpacity={0.8}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Feather name="send" size={24} color="#ffffff" />
          </TouchableOpacity>
        </ThemedView>
      </KeyboardGuard>
    </>
  );
};

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 5,
  },
  messageRowMe: {
    justifyContent: "flex-end",
  },
  messageRowOther: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 15,
    marginVertical: 3,
  },
  messageBubbleOther: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 0,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageBubbleMe: {
    backgroundColor: customColors.primary,
    borderTopRightRadius: 0,
  },
  messageBubbleFailed: {
    backgroundColor: "#ffebee",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },

  messageTime: {
    fontSize: 12,
  },
  statusIcon: {
    marginLeft: 4,
  },
  retryButton: {
    marginTop: 2,
    alignSelf: "flex-end",
  },
  retryButtonText: {
    fontSize: 12,
    color: customColors.primary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: customColors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  messageListContent: {
    // paddingVertical: 10,
    paddingTop: 0,
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
});
