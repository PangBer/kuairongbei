import PageHeader from "@/components/PageHeader";
import globalStyles from "@/components/styles/globalStyles";
import { ThemedText, ThemedView } from "@/components/ui";
import { customColors } from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// 消息项组件
const MessageItem = ({ item }: any) => {
  const isMe = item.sender === "me";
  return (
    <View
      style={[
        styles.messageRow,
        isMe ? styles.messageRowMe : styles.messageRowOther,
      ]}
    >
      {!isMe && (
        <View style={styles.avatarContainer}>
          <AntDesign name="bank" size={32} color={customColors.primary} />
        </View>
      )}
      <View style={{ maxWidth: "70%" }}>
        <View
          style={[
            styles.messageBubble,
            globalStyles.globalContainer,
            isMe ? styles.messageBubbleMe : styles.messageBubbleOther,
          ]}
        >
          <ThemedText style={[styles.messageText, isMe && { color: "#fff" }]}>
            {item.text}
          </ThemedText>
        </View>
        <ThemedText
          style={[styles.messageTime, isMe && { textAlign: "right" }]}
        >
          {item.time}
        </ThemedText>
      </View>
    </View>
  );
}; // 模拟聊天数据
const messages = [
  {
    id: 1,
    text: "您好！我是诚信金融的客服，看到您提交了50万元的经营贷款申请，系统已为您匹配到我们的企业贷产品。请问您方便沟通一下具体需求吗？",
    sender: "other",
    time: "15:30",
  },
  {
    id: 2,
    text: "哦哦哦哦",
    sender: "me",
    time: "14:41",
  },
  {
    id: 3,
    text: "没问题。如果您的抵押物是北京的房产，评估值在100万以上，还可以申请更低的利率，需要我为您详细介绍一下吗？",
    sender: "other",
    time: "14:42",
  },
  {
    id: 4,
    text: "放放风",
    sender: "me",
    time: "14:41",
  },
  {
    id: 5,
    text: "没问题。如果您的抵押物是北京的房产，评估值在100万以上，还可以申请更低的利率，需要我为您详细介绍一下吗？",
    sender: "other",
    time: "14:42",
  },
  {
    id: 6,
    text: "放放风",
    sender: "me",
    time: "14:41",
  },
  {
    id: 7,
    text: "放放风",
    sender: "other",
    time: "14:42",
  },
  {
    id: 8,
    text: "没问题。如果您的抵押物是北京的房产，评估值在100万以上，还可以申请更低的利率，需要我为您详细介绍一下吗？",
    sender: "me",
    time: "14:41",
  },
];
export default () => {
  const { id, name } = useLocalSearchParams();
  const inset = useSafeAreaInsets();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [messageList, setMessageList] = useState<any[]>([]);
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);
      const timeoutId = setTimeout(() => {
        scrollToBottom(true);
        clearTimeout(timeoutId);
      }, 0);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setIsKeyboardVisible(false)
    );
    //  模拟接口请求
    setTimeout(() => {
      setMessageList(messages);
      setIsReady(true);
    }, 200);
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);
  // ------- 首次渲染滚动到底 -------
  useEffect(() => {
    if (isReady) {
      scrollToBottom(false);
    }
  }, [isReady]);
  // ------- 关键：滚动到底部函数 -------
  const scrollToBottom = (animated = true) => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToEnd({ animated });
    });
  };

  return (
    <>
      {/* 头部 */}
      <PageHeader title={name as string}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <AntDesign
            name="pinterest"
            size={12}
            color="#67C23A"
            style={{ marginLeft: "auto" }}
          />
          <ThemedText
            style={{ fontSize: 12, color: "#67C23A", lineHeight: 12 }}
          >
            当前在线
          </ThemedText>
        </View>
      </PageHeader>
      {/* 消息列表 */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={globalStyles.globalContainer}
        keyboardVerticalOffset={inset.top}
        enabled={isKeyboardVisible}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <FlatList
            ref={flatListRef}
            data={messageList}
            renderItem={({ item }) => <MessageItem item={item} />}
            keyExtractor={(item) => item.id.toString()}
            style={[globalStyles.globalContainer, { paddingHorizontal: 10 }]}
            contentContainerStyle={globalStyles.globalPaddingBottom}
            showsVerticalScrollIndicator={false}
            // onLayout={() => setIsReady(true)}
          />
        </TouchableWithoutFeedback>
        {/* 输入框 */}
        <ThemedView style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="请输入您想咨询的问题..."
            placeholderTextColor="#999999"
          />
          <TouchableOpacity style={styles.sendButton} activeOpacity={0.8}>
            <Feather name="send" size={24} color="#ffffff" />
          </TouchableOpacity>
        </ThemedView>
      </KeyboardAvoidingView>
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
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 12,
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
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: customColors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});
