import globalStyles from "@/components/styles/globalStyles";
import { ThemedCard, ThemedText, ThemedView } from "@/components/ui";
import { customColors } from "@/constants/theme";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import QRCode from "react-native-qrcode-svg";

export default () => {
  const invitationCode = "KRB887766";

  return (
    <>
      <ScrollView
        style={globalStyles.globalContainer}
        contentContainerStyle={globalStyles.globalPaddingBottom}
        showsVerticalScrollIndicator={false}
      >
        {/* 蓝色标题栏 */}
        <ThemedView style={styles.header}>
          <ThemedText style={styles.headerTitle}>快融呗邀请有礼</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            每邀请1位好友，最高赚50元现金
          </ThemedText>
        </ThemedView>

        {/* 主体内容 */}
        <View style={styles.content}>
          {/* 二维码 */}
          <ThemedView style={styles.qrCodeContainer}>
            <QRCode
              value="https://kuairongbei.com/register?code=KRB887766"
              size={200}
              backgroundColor="#ffffff"
            />
          </ThemedView>

          {/* 邀请码 */}
          <View style={styles.codeContainer}>
            <ThemedText style={styles.codeLabel}>
              扫码下载APP，输入邀请码
            </ThemedText>
            <ThemedText style={styles.codeText}>{invitationCode}</ThemedText>
          </View>

          {/* 奖励说明 */}
          <ThemedCard style={styles.rewardContainer}>
            <ThemedText style={styles.rewardTitle}>奖励说明</ThemedText>

            <View style={styles.rewardItem}>
              <ThemedText style={styles.rewardIcon}>1</ThemedText>

              <ThemedText style={styles.rewardText}>
                好友注册成功，您获得10元
              </ThemedText>
            </View>

            <View style={styles.rewardItem}>
              <ThemedText style={styles.rewardIcon}>2</ThemedText>
              <ThemedText style={styles.rewardText}>
                完成首次申请，再得30元
              </ThemedText>
            </View>

            <View style={styles.rewardItem}>
              <ThemedText style={styles.rewardIcon}>3</ThemedText>
              <ThemedText style={styles.rewardText}>
                成功放款后，额外得20元
              </ThemedText>
            </View>
          </ThemedCard>

          {/* 提示文字 */}
          <View style={styles.tipContainer}>
            <ThemedText style={styles.tipText}>
              好友越多，奖励越多，上不封顶
            </ThemedText>
          </View>
        </View>
      </ScrollView>
      {/* 保存海报按钮 */}
      <ThemedView style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => {}}
          icon="image"
          style={styles.button}
          buttonColor={customColors.primary}
        >
          保存海报
        </Button>
      </ThemedView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2B56F6",
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#ffffff",
    opacity: 0.9,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: "center",
  },
  qrCodeContainer: {
    width: 250,
    height: 250,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  codeContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  codeLabel: {
    fontSize: 14,
    marginBottom: 10,
  },
  codeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: customColors.primary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  rewardContainer: {
    width: "100%",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  rewardItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  rewardIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: "center",
    backgroundColor: customColors.primary,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  rewardText: {
    fontSize: 14,
    marginLeft: 8,
  },
  tipContainer: {
    marginBottom: 30,
  },
  tipText: {
    fontSize: 14,
  },
  buttonContainer: {
    width: "100%",
    padding: 10,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 10,
  },
});
