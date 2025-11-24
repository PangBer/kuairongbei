import PageHeader from "@/components/PageHeader";
import globalStyles from "@/components/styles/globalStyles";
import { ThemedCard, ThemedText, ThemedView } from "@/components/ui";
import { customColors } from "@/constants/theme";
import { useToastActions } from "@/store/hooks";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Clipboard from "expo-clipboard";
import {
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";

export default () => {
  const { showSuccess } = useToastActions();
  const friends = [
    { name: "张**", helped: true, time: "今天 09:25" },
    { name: "", helped: false, index: 2 },
    { name: "", helped: false, index: 3 },
  ];

  const inviteMethods = [
    { icon: "wechat", label: "微信好友" },
    { icon: "qq", label: "QQ好友" },
    { icon: "link", label: "复制链接" },
  ];

  const rules = [
    "好友通过您的邀请链接或注册并登录，即完成助力",
    "每位好友仅可助力1次，助力成功后不可撤销",
    "满足3位好友助力后，500积分将自动解冻至您的账户",
    "被邀请的好友可获得200积分新人奖励",
  ];

  const shareInviteLink = async (method?: any) => {
    const urlText = "kuairongbei://kuairongbei.com/invite";
    if (method.icon === "link") {
      // 复制链接逻辑
      Clipboard.setStringAsync(urlText);
      showSuccess("链接已复制");
    } else {
      // 分享到对应平台逻辑
      const content = {
        title: "邀请好友助力",
        message: urlText,
        url: urlText, // iOS 会尽量使用 url 字段
      };
      await Share.share(content as any);
    }
  };
  return (
    <>
      <PageHeader title="邀请好友助力" />
      <ScrollView
        style={globalStyles.globalContainer}
        contentContainerStyle={globalStyles.globalPaddingBottom}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Section */}
        <ThemedCard>
          <View style={styles.progressContainer}>
            <ThemedText style={styles.progressNumber}>1/3</ThemedText>
            <ThemedText style={styles.progressText}>已助力好友</ThemedText>
          </View>

          {/* Description Section */}
          <View>
            <ThemedText style={styles.descriptionTitle}>
              邀请3位好友助力，即可解冻500积分
            </ThemedText>
            <ThemedText style={styles.descriptionSubtitle}>
              积分可用于兑换现金或抵扣贷款手续费
            </ThemedText>
          </View>
        </ThemedCard>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>已邀请好友</ThemedText>
          <TouchableOpacity activeOpacity={0.8}>
            <ThemedText style={styles.viewMoreText}>还差2位好友</ThemedText>
          </TouchableOpacity>
        </View>
        {/* Friends List Section */}
        <ThemedCard>
          {friends.map((friend, index) => (
            <ThemedView key={index} style={styles.friendItem}>
              <AntDesign
                name="user"
                size={24}
                color={friend.helped ? customColors.customGreen : "#CCCCCC"}
              />

              {friend.helped ? (
                <ThemedView style={styles.helpedFriendInfo}>
                  <ThemedText style={styles.friendName}>
                    {friend.name}
                  </ThemedText>
                  <ThemedText style={styles.helpedText}>已助力</ThemedText>
                </ThemedView>
              ) : (
                <ThemedText style={styles.inviteText}>
                  邀请好友助力 第{friend.index}位好友
                </ThemedText>
              )}

              {friend.helped ? (
                <ThemedText style={styles.friendTime}>{friend.time}</ThemedText>
              ) : (
                <AntDesign
                  name="pinterest"
                  size={16}
                  color={customColors.primary}
                  style={{ marginLeft: "auto" }}
                />
              )}
            </ThemedView>
          ))}
        </ThemedCard>

        {/* Invitation Methods Section */}
        <ThemedCard>
          <ThemedText style={styles.sectionTitle}>邀请好友方式</ThemedText>
          <ThemedView style={styles.methodsContainer}>
            {inviteMethods.map((method: any, index) => (
              <TouchableOpacity
                key={index}
                style={styles.methodItem}
                activeOpacity={0.8}
                onPress={() => shareInviteLink(method)}
              >
                <AntDesign
                  name={method.icon}
                  size={40}
                  color={customColors.primary}
                />
                <ThemedText style={styles.methodLabel}>
                  {method.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedCard>

        {/* Rules Section */}
        <ThemedCard>
          <ThemedText style={styles.sectionTitle}>助力规则说明</ThemedText>
          {rules.map((rule, index) => (
            <ThemedView key={index} style={styles.ruleItem}>
              <AntDesign
                name="check-circle"
                size={16}
                color={customColors.customGreen}
              />
              <ThemedText style={styles.ruleText}>{rule}</ThemedText>
            </ThemedView>
          ))}
        </ThemedCard>
      </ScrollView>
      {/* Invite Button */}
      <ThemedView style={styles.buttonContainer}>
        <Button
          mode="contained"
          icon="share-variant"
          buttonColor={customColors.primary}
          onPress={shareInviteLink}
        >
          立即邀请好友
        </Button>
      </ThemedView>
    </>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  progressNumber: {
    fontSize: 48,
    lineHeight: 48,
    fontWeight: "bold",
    color: customColors.primary,
  },
  progressText: {
    fontSize: 16,
    marginTop: 5,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  descriptionSubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  viewMoreText: {
    color: customColors.primary,
    fontSize: 14,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  helpedFriendInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  friendName: {
    fontSize: 16,
  },
  helpedText: {
    fontSize: 14,
    color: "#52C41A",
    marginLeft: 10,
  },
  inviteText: {
    fontSize: 14,
    marginLeft: 10,
  },
  friendTime: {
    fontSize: 14,
    marginLeft: "auto",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  methodsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  methodItem: {
    alignItems: "center",
  },
  methodLabel: {
    fontSize: 14,
    marginTop: 8,
  },
  ruleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ruleText: {
    fontSize: 14,
    marginLeft: 8,
  },
  buttonContainer: {
    paddingVertical: 10,
  },
});
