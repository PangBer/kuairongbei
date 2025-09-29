import ContactService from "@/components/ContactService";
import {
  defaultContactConfig,
  getServiceInfoText,
} from "@/utils/contactService";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";

export default function ContactServiceScreen() {
  const [contactConfig] = useState(defaultContactConfig);

  const handleContactPress = () => {
    console.log("用户点击了联系客服");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>联系客服</Text>
        <Text style={styles.description}>
          我们提供多种联系方式，选择最适合您的方式与我们取得联系
        </Text>

        {/* 主要联系方式 */}
        <ContactService
          title="联系客服"
          description="App端打开微信添加客服，Web端直接打开联系页面"
          wechatId={contactConfig.wechatId}
          webContactUrl={contactConfig.webContactUrl}
          showCard={true}
          buttonText="联系客服"
          onContactPress={handleContactPress}
        />

        {/* 客服信息卡片 */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoTitle}>客服信息</Text>
            <Text style={styles.infoText}>
              {getServiceInfoText(contactConfig)}
            </Text>
          </Card.Content>
        </Card>

        {/* 其他联系方式 */}
        <Card style={styles.otherCard}>
          <Card.Content>
            <Text style={styles.otherTitle}>其他联系方式</Text>

            {contactConfig.email && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>邮箱:</Text>
                <Text style={styles.contactValue}>{contactConfig.email}</Text>
              </View>
            )}

            {contactConfig.phone && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>电话:</Text>
                <Text style={styles.contactValue}>{contactConfig.phone}</Text>
              </View>
            )}

            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>工作时间:</Text>
              <Text style={styles.contactValue}>
                {contactConfig.serviceHours}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* 使用说明 */}
        <Card style={styles.helpCard}>
          <Card.Content>
            <Text style={styles.helpTitle}>使用说明</Text>
            <Text style={styles.helpText}>
              <Text style={styles.platformTitle}>App端：</Text>
              {"\n"}
              1. 点击"联系客服"按钮{"\n"}
              2. 系统会自动打开微信应用{"\n"}
              3. 在微信中搜索并添加客服微信{"\n"}
              4. 开始与客服对话{"\n\n"}
              <Text style={styles.platformTitle}>Web端：</Text>
              {"\n"}
              1. 点击"联系客服"按钮{"\n"}
              2. 系统会自动打开企业微信联系页面{"\n"}
              3. 在页面中直接与客服对话
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#666",
    lineHeight: 22,
  },
  infoCard: {
    marginVertical: 16,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  otherCard: {
    marginVertical: 16,
    elevation: 2,
  },
  otherTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  contactItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    width: 80,
  },
  contactValue: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  helpCard: {
    marginVertical: 16,
    elevation: 2,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  helpText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  platformTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
});
