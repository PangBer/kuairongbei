import PageHeader from "@/components/PageHeader";
import globalStyles from "@/components/styles/globalStyles";
import { ThemedCard, ThemedText } from "@/components/ui";
import { customColors } from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function AddWeixinScreen() {
  const router = useRouter();
  // 复制微信号
  const handleCopyWeixin = () => {
    // 复制功能实现
    console.log("复制微信号");
  };

  return (
    <>
      <PageHeader title="企业微信客服" />
      <ScrollView
        style={globalStyles.globalContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyles.globalPaddingBottom}
      >
        {/* 企微内容 */}
        <ThemedCard>
          {/* 头像姓名 */}
          <View style={styles.profileContainer}>
            <View style={styles.avatarContainer}>
              <AntDesign name="user" size={40} color={customColors.primary} />
            </View>
            <View style={styles.profileInfo}>
              <ThemedText style={styles.profileName}>贷款服务助手</ThemedText>
              <ThemedText style={styles.profileSubtitle}>
                企业微信认证客服
              </ThemedText>
              <View style={styles.verifiedBadge}>
                <AntDesign
                  name="check-circle"
                  size={14}
                  color={customColors.primary}
                />
                <ThemedText style={styles.verifiedText}>官方认证</ThemedText>
              </View>
            </View>
          </View>

          {/* 联系方式 */}
          <View
            style={[styles.sectionContainer, { padding: 10, borderRadius: 10 }]}
          >
            <View style={styles.sectionTitleRow}>
              <AntDesign name="phone" size={18} color="#2B56F6" />
              <ThemedText style={styles.sectionTitle}>联系方式</ThemedText>
            </View>
            <View style={styles.contactInfoRow}>
              <View style={styles.contactInfoLeft}>
                <ThemedText style={styles.contactLabel}>企业微信号</ThemedText>
              </View>
              <ThemedText style={[styles.contactValue, { marginRight: 10 }]}>
                xxxxx
              </ThemedText>
              <TouchableOpacity
                style={{ alignItems: "center", flexDirection: "row", gap: 4 }}
                onPress={handleCopyWeixin}
              >
                <AntDesign name="copy" size={16} color={customColors.primary} />
                <ThemedText style={styles.copyButtonText}>复制</ThemedText>
              </TouchableOpacity>
            </View>
            <View style={styles.contactInfoRow}>
              <ThemedText style={styles.contactLabel}>工作时间</ThemedText>
              <ThemedText style={styles.contactValue}>
                周一至周五9：00-18：00
              </ThemedText>
            </View>
          </View>

          {/* 服务内容 */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleRow}>
              <AntDesign
                name="customer-service"
                size={18}
                color={customColors.primary}
              />
              <ThemedText style={styles.sectionTitle}>服务内容</ThemedText>
            </View>
            <View style={styles.serviceList}>
              <View style={styles.serviceItem}>
                <AntDesign
                  name="check-circle"
                  size={16}
                  color={customColors.primary}
                />
                <ThemedText style={styles.serviceText}>
                  一对一专属客服服务
                </ThemedText>
              </View>
              <View style={styles.serviceItem}>
                <AntDesign
                  name="check-circle"
                  size={16}
                  color={customColors.primary}
                />
                <ThemedText style={styles.serviceText}>
                  快速响应贷款咨询
                </ThemedText>
              </View>
              <View style={styles.serviceItem}>
                <AntDesign
                  name="check-circle"
                  size={16}
                  color={customColors.primary}
                />
                <ThemedText style={styles.serviceText}>
                  专业贷款方案定制
                </ThemedText>
              </View>
              <View style={styles.serviceItem}>
                <AntDesign
                  name="check-circle"
                  size={16}
                  color={customColors.primary}
                />
                <ThemedText style={styles.serviceText}>
                  24小时在线支持
                </ThemedText>
              </View>
            </View>
          </View>

          {/* 按钮栏 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonWhite}
              activeOpacity={0.8}
              onPress={() => router.push("./weixinQRCode")}
            >
              <AntDesign name="qrcode" size={18} color={customColors.primary} />
              <ThemedText style={styles.buttonWhiteText}>显示二维码</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonBlue} activeOpacity={0.8}>
              <AntDesign name="wechat" size={18} color="#FFFFFF" />
              <ThemedText style={styles.buttonBlueText}>去微信添加</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedCard>

        {/* 添加步骤 */}
        <ThemedCard>
          <View style={styles.sectionTitleRow}>
            <AntDesign
              name="step-forward"
              size={18}
              color={customColors.primary}
            />
            <ThemedText style={styles.sectionTitle}>添加步骤</ThemedText>
          </View>
          <View style={styles.stepsContainer}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <ThemedText style={styles.stepNumberText}>1</ThemedText>
              </View>
              <ThemedText style={styles.stepText}>
                打开微信，点击右上角+号
              </ThemedText>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <ThemedText style={styles.stepNumberText}>2</ThemedText>
              </View>
              <ThemedText style={styles.stepText}>选择添加朋友</ThemedText>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <ThemedText style={styles.stepNumberText}>3</ThemedText>
              </View>
              <ThemedText style={styles.stepText}>
                点击搜索输入企业微信号
              </ThemedText>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <ThemedText style={styles.stepNumberText}>4</ThemedText>
              </View>
              <ThemedText style={styles.stepText}>
                点击添加到通讯录完成添加
              </ThemedText>
            </View>
          </View>
        </ThemedCard>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  // 头像姓名容器
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EBF4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
    gap: 6,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
  },
  profileSubtitle: {
    fontSize: 12,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF4FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: customColors.primary,
    fontWeight: "500",
  },
  // 通用区块容器
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  // 联系方式样式
  contactInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  contactInfoLeft: {
    flex: 1,
    gap: 4,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 12,
  },
  copyButtonText: {
    fontSize: 12,
    color: customColors.primary,
    fontWeight: "500",
  },
  // 服务内容样式
  serviceList: {
    gap: 12,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  serviceText: {
    fontSize: 14,
    flex: 1,
  },
  // 按钮容器
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  buttonWhite: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: customColors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  buttonWhiteText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2B56F6",
  },
  buttonBlue: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: customColors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  buttonBlueText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // 添加步骤样式
  stepsContainer: {
    gap: 16,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: customColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
