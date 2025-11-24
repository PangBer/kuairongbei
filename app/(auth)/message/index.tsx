import PageHeader from "@/components/PageHeader";
import globalStyles from "@/components/styles/globalStyles";
import { ThemedCard, ThemedText, ThemedView } from "@/components/ui";
import { customColors } from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link } from "expo-router";
import {
  Pressable,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Appbar, Badge } from "react-native-paper";

export default () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  // 模拟消息数据
  const messages = [
    {
      id: 1,
      icon: "bank",
      title: "诚信金融服务有限公司",
      time: "15:30",
      content: "您好！已为您匹配到企业贷产品...",
      unread: 1,
    },
    {
      id: 2,
      icon: "bank",
      title: "恒通贷款服务中心",
      time: "昨天",
      content: "您的贷款资料已收到，正在审核中",
      unread: 0,
    },
    {
      id: 3,
      icon: "notification",
      title: "快融呗官方客服",
      time: "08:15",
      content: "您的账户已完成实名认证，可申...",
      unread: 0,
    },
    {
      id: 4,
      icon: "bank",
      title: "诚信金融服务有限公司诚信金融服务有限公司",
      time: "15:30",
      content: "您好！已为您匹配到企业贷产品...",
      unread: 1,
    },
    {
      id: 5,
      icon: "notification",
      title: "快融呗官方客服",
      time: "08:15",
      content: "您的账户已完成实名认证，可申...",
      unread: 0,
    },
    {
      id: 6,
      icon: "bank",
      title: "诚信金融服务有限公司",
      time: "15:30",
      content: "您好！已为您匹配到企业贷产品...",
      unread: 1,
    },
    {
      id: 7,
      icon: "bank",
      title: "诚信金融服务有限公司",
      time: "15:30",
      content: "您好！已为您匹配到企业贷产品...",
      unread: 1,
    },
    {
      id: 8,
      icon: "notification",
      title: "快融呗官方客服",
      time: "08:15",
      content: "您的账户已完成实名认证，可申...",
      unread: 0,
    },
    {
      id: 9,
      icon: "bank",
      title: "诚信金融服务有限公司",
      time: "15:30",
      content: "您好！已为您匹配到企业贷产品...",
      unread: 1,
    },
    {
      id: 10,
      icon: "bank",
      title: "诚信金融服务有限公司",
      time: "15:30",
      content: "您好！已为您匹配到企业贷产品...",
      unread: 1,
    },
  ];

  return (
    <>
      {/* 页面头部 */}
      <PageHeader title="消息中心">
        <Appbar.Action
          icon={() => (
            <AntDesign
              name="clear"
              size={20}
              color={isDark ? "#ffffff" : "#1a1a1a"}
            />
          )}
          onPress={() => {}}
        />
      </PageHeader>

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
        />
      </ThemedView>

      {/* 消息列表 */}
      <ScrollView
        style={globalStyles.globalContainer}
        contentContainerStyle={globalStyles.globalPaddingBottom}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <Link
            key={message.id}
            href={{
              pathname: "/message/chat",
              params: {
                id: message.id,
                name: message.title,
              },
            }}
            asChild
          >
            <Pressable>
              <ThemedCard style={styles.messageItem}>
                <View style={styles.messageHeader}>
                  <View style={styles.iconContainer}>
                    <AntDesign
                      name={message.icon as any}
                      size={24}
                      color={customColors.primary}
                    />
                  </View>

                  <View style={globalStyles.globalContainer}>
                    <View style={styles.messageTitleRow}>
                      <ThemedText style={styles.messageTitle}>
                        {message.title}
                      </ThemedText>
                      <ThemedText style={styles.messageTime}>
                        {message.time}
                      </ThemedText>
                    </View>
                    <View style={styles.messageList}>
                      <ThemedText style={styles.messageText}>
                        {message.content}
                      </ThemedText>
                      {message.unread > 0 && <Badge>51</Badge>}
                    </View>
                  </View>
                </View>
              </ThemedCard>
            </Pressable>
          </Link>
        ))}
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
  },
});
