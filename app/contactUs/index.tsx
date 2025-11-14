import ExpandItem from "@/components/ExpandItem";
import PageHeader from "@/components/PageHeader";
import globalStyles from "@/components/styles/globalStyles";
import { ThemedCard, ThemedText } from "@/components/ui";
import { customColors } from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function ContactUsScreen() {
  const router = useRouter();

  // 常见问题数据
  const faqData = [
    {
      question: "如何提高我的贷款额度？",
      answer:
        "您可以通过以下方式提高贷款额度：1. 保持良好的信用记录，按时还款；2. 增加账户活跃度，多使用平台服务；3. 完善个人信息，提供更多资产证明；4. 联系客服申请额度提升。",
    },
    {
      question: "提现后多久可以到账？",
      answer:
        "提现到账时间根据银行不同而有所差异，一般情况下：1. 工作日提现：1-3个工作日到账；2. 节假日提现：顺延至下一个工作日；3. 具体到账时间以银行处理为准。",
    },
    {
      question: "积分有什么用？",
      answer:
        "积分可以在平台内兑换各种优惠和服务：1. 兑换现金红包；2. 兑换平台优惠券；3. 参与积分抽奖活动；4. 兑换会员权益；5. 抵扣部分服务费用。",
    },
    {
      question: "逾期有什么风险？",
      answer:
        "逾期会产生以下影响：1. 产生逾期费用和罚息；2. 影响个人信用记录；3. 可能被列入失信名单；4. 影响后续贷款申请；5. 可能面临法律诉讼。请务必按时还款。",
    },
  ];

  return (
    <>
      <PageHeader title="联系我们" />
      <ScrollView
        style={globalStyles.globalContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyles.globalPaddingBottom}
      >
        {/*企微客服/在线客服 */}
        <View style={styles.serviceCardsContainer}>
          <ThemedCard style={styles.serviceCardWrapperLeft}>
            {/* 企业微信客服卡片 */}
            <View style={styles.serviceCard}>
              <View style={styles.serviceIconContainer}>
                <AntDesign name="wechat" size={32} color="#2B56F6" />
              </View>
              <ThemedText style={styles.serviceTitle}>企业微信客服</ThemedText>
              <ThemedText style={styles.serviceText}>
                添加企业微信获取一对一服务
              </ThemedText>
              <TouchableOpacity
                style={styles.serviceButton}
                activeOpacity={0.8}
                onPress={() => router.push("/contactUs/addWeixin")}
              >
                <AntDesign name="plus-circle" size={16} color="#FFFFFF" />
                <ThemedText style={styles.serviceButtonText}>
                  立即添加
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedCard>
          <ThemedCard style={styles.serviceCardWrapperRight}>
            {/* 在线客服卡片 */}
            <View style={styles.serviceCard}>
              <View style={styles.serviceIconContainer}>
                <AntDesign name="message" size={32} color="#2B56F6" />
              </View>
              <ThemedText style={styles.serviceTitle}>在线客服</ThemedText>
              <ThemedText style={styles.serviceText}>
                实时在线咨询，快速解决问题
              </ThemedText>
              <TouchableOpacity
                style={styles.serviceButton}
                activeOpacity={0.8}
              >
                <AntDesign name="customer-service" size={16} color="#FFFFFF" />
                <ThemedText style={styles.serviceButtonText}>
                  开始咨询
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedCard>
        </View>

        {/* 企业微信二维码 */}
        <ThemedCard>
          {/* 标题 */}
          <View style={styles.qrCodeTitleContainer}>
            <AntDesign name="qrcode" size={20} color={customColors.primary} />
            <ThemedText style={styles.qrCodeTitle}>企业微信二维码</ThemedText>
          </View>

          {/* 二维码容器 */}
          <View style={styles.qrCodeImageContainer}>
            <QRCode
              value="https://example.com/wechat"
              size={200}
              color="#000000"
              backgroundColor="#FFFFFF"
            />
          </View>

          {/* 底部提示文字 */}
          <View style={styles.qrCodeTipsContainer}>
            <ThemedText style={styles.qrCodeTipText}>
              保存图片到手机，打开微信扫码添加
            </ThemedText>
            <ThemedText style={styles.qrCodeTipText}>
              工作时间：9：00-18：00（节假日除外）
            </ThemedText>
          </View>
        </ThemedCard>

        {/* 常见问题 */}
        <ThemedCard>
          {/* 标题 */}
          <View style={styles.sectionTitleContainer}>
            <AntDesign
              name="question-circle"
              size={20}
              color={customColors.primary}
            />
            <ThemedText style={styles.sectionTitle}>常见问题</ThemedText>
          </View>

          {/* 问题列表 */}
          <View style={styles.faqContainer}>
            {faqData.map((item, index) => (
              <ExpandItem
                key={index}
                title={item.question}
                content={item.answer}
                defaultExpanded={index === 0}
              />
            ))}
          </View>
        </ThemedCard>

        {/*其他联系方式 */}
        <ThemedCard>
          {/* 标题 */}
          <View style={styles.sectionTitleContainer}>
            <AntDesign name="phone" size={20} color={customColors.primary} />
            <ThemedText style={styles.sectionTitle}>其他联系方式</ThemedText>
          </View>

          {/* 联系方式列表 */}
          <View style={styles.contactContainer}>
            {/* 客服热线 */}
            <View style={styles.contactItem}>
              <View style={styles.contactIconContainer}>
                <AntDesign
                  name="phone"
                  size={20}
                  color={customColors.primary}
                />
              </View>
              <View style={styles.contactInfo}>
                <ThemedText style={styles.contactLabel}>客服热线</ThemedText>
                <ThemedText style={styles.contactValue}>
                  400-888-9999
                </ThemedText>
              </View>
            </View>

            {/* 工作时间 */}
            <View style={styles.contactItem}>
              <View style={styles.contactIconContainer}>
                <AntDesign
                  name="clock-circle"
                  size={20}
                  color={customColors.primary}
                />
              </View>
              <View style={styles.contactInfo}>
                <ThemedText style={styles.contactLabel}>工作时间</ThemedText>
                <ThemedText style={styles.contactValue}>
                  周一至周五9：00-18：00
                </ThemedText>
              </View>
            </View>

            {/* 官方邮箱 */}
            <View style={styles.contactItem}>
              <View style={styles.contactIconContainer}>
                <AntDesign name="mail" size={20} color={customColors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <ThemedText style={styles.contactLabel}>官方邮箱</ThemedText>
                <ThemedText style={styles.contactValue}>
                  xxxx@model.com
                </ThemedText>
              </View>
            </View>
          </View>
        </ThemedCard>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  // 客服卡片容器
  serviceCardsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  // 卡片包装器
  serviceCardWrapperLeft: {
    flex: 1,
    marginHorizontal: 0,
    marginLeft: 10,
  },
  serviceCardWrapperRight: {
    marginHorizontal: 0,
    flex: 1,
    marginRight: 10,
  },
  // 单个客服卡片
  serviceCard: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  // 图标容器（浅蓝底深蓝图标，圆形）
  serviceIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EBF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  // 标题
  serviceTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  // 描述文字
  serviceText: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 18,
  },
  // 按钮（蓝底白字）
  serviceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: customColors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 6,
    width: "100%",
  },
  // 按钮文字
  serviceButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  // 二维码卡片样式
  qrCodeTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  qrCodeTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  // 二维码图片容器（浅灰蓝色方框）
  qrCodeImageContainer: {
    backgroundColor: "#E8F0F8",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    aspectRatio: 1,
    width: "80%",
    alignSelf: "center",
  },
  // 提示文字容器
  qrCodeTipsContainer: {
    gap: 6,
  },
  // 提示文字样式
  qrCodeTipText: {
    fontSize: 12,
    lineHeight: 18,
    alignSelf: "center",
  },
  // 通用标题容器
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  // 常见问题样式
  faqContainer: {
    marginTop: 8,
  },
  // 联系方式样式
  contactContainer: {
    gap: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  contactInfo: {
    flex: 1,
    gap: 4,
  },
  contactLabel: {
    fontSize: 12,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: "500",
  },
});
