import React from "react";
import { Alert, Linking, Platform, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

interface ContactServiceProps {
  title?: string;
  description?: string;
  wechatId?: string;
  webContactUrl?: string; // Web端联系客服的HTTP链接
  showCard?: boolean;
  buttonText?: string;
  onContactPress?: () => void;
}

export default function ContactService({
  title = "联系客服",
  description = "点击联系我们的客服团队",
  wechatId = "your-wechat-id", // 请替换为实际的企业微信ID
  webContactUrl = "https://work.weixin.qq.com/ca/cawcde231c19052561", // Web端联系客服链接
  showCard = true,
  buttonText = "联系客服",
  onContactPress,
}: ContactServiceProps) {
  // 处理联系客服
  const handleContactService = async () => {
    try {
      onContactPress?.();

      // 根据平台选择不同的处理方式
      if (Platform.OS === "web") {
        // Web端：直接打开企业微信联系页面
        if (webContactUrl) {
          const opened = await Linking.openURL(webContactUrl);
          if (!opened) {
            Alert.alert("提示", "无法打开联系页面，请检查链接是否正确");
          }
        } else {
          Alert.alert("提示", "Web端联系客服链接未配置");
        }
      } else {
        // App端：打开微信添加联系人
        const wechatUrl = "weixin://";
        const canOpenWechat = await Linking.canOpenURL(wechatUrl);

        if (!canOpenWechat) {
          Alert.alert("提示", "未检测到微信应用，请先安装微信", [
            { text: "取消", style: "cancel" },
            { text: "确定", style: "default" },
          ]);
          return;
        }

        // 构建微信添加联系人的URL
        const addContactUrl = `weixin://dl/business/?ticket=${wechatId}`;

        // 尝试打开微信
        const opened = await Linking.openURL(addContactUrl);

        if (!opened) {
          // 如果直接添加失败，尝试打开微信主界面
          await Linking.openURL(wechatUrl);

          Alert.alert("提示", "已为您打开微信，请在微信中搜索并添加客服微信", [
            { text: "确定", style: "default" },
          ]);
        }
      }
    } catch (error) {
      console.error("联系客服失败:", error);

      if (Platform.OS === "web") {
        Alert.alert("提示", "无法打开联系页面，请手动访问客服页面");
      } else {
        Alert.alert("提示", "无法打开微信，请手动打开微信并搜索客服微信");
      }
    }
  };

  // 显示客服信息
  const showServiceInfo = () => {
    const platformInfo =
      Platform.OS === "web"
        ? `Web端联系链接: ${webContactUrl}\n\n点击将直接打开企业微信联系页面`
        : `客服微信ID: ${wechatId}\n\n点击将打开微信添加客服为联系人`;

    Alert.alert(
      "客服信息",
      `${platformInfo}\n\n工作时间: 周一至周五 9:00-18:00\n\n如有紧急问题，请直接联系客服`,
      [
        { text: "取消", style: "cancel" },
        { text: "联系客服", onPress: handleContactService },
      ]
    );
  };

  if (showCard) {
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleContactService}
              style={styles.contactButton}
              icon="message"
            >
              {buttonText}
            </Button>

            <Button
              mode="outlined"
              onPress={showServiceInfo}
              style={styles.infoButton}
              icon="information"
            >
              客服信息
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  }

  return (
    <View style={styles.simpleContainer}>
      <Button
        mode="contained"
        onPress={handleContactService}
        style={styles.contactButton}
        icon="message"
      >
        {buttonText}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 4,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  contactButton: {
    minWidth: 120,
  },
  infoButton: {
    minWidth: 120,
  },
  simpleContainer: {
    alignItems: "center",
  },
});
