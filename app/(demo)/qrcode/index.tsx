import QRCodeDisplay from "@/components/QRCodeDisplay";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card, TextInput } from "react-native-paper";

export default function QRCodeDemoScreen() {
  const [currentPath, setCurrentPath] = useState("/qrcode");
  const [customPath, setCustomPath] = useState("/custom");
  const [customParams, setCustomParams] = useState(
    '{"id": "123", "name": "test"}'
  );

  // 解析自定义参数
  const parseCustomParams = () => {
    try {
      return JSON.parse(customParams);
    } catch {
      return {};
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>二维码生成演示</Text>

        <Text style={styles.subtitle}>
          生成当前页面的二维码，支持App和Web访问
        </Text>

        {/* 当前页面二维码 */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>当前页面二维码</Text>
            <Text style={styles.cardDescription}>
              生成当前页面的二维码，扫码后直接进入对应功能
            </Text>

            <QRCodeDisplay
              path={currentPath}
              title="当前页面"
              description="扫码直接访问当前页面"
              showDownloadButton={true}
              showShareButton={true}
            />
          </Card.Content>
        </Card>

        {/* 自定义页面二维码 */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>自定义页面二维码</Text>
            <Text style={styles.cardDescription}>
              生成指定页面的二维码，支持自定义参数
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                label="页面路径"
                value={customPath}
                onChangeText={setCustomPath}
                style={styles.input}
                placeholder="/custom"
              />

              <TextInput
                label="查询参数 (JSON格式)"
                value={customParams}
                onChangeText={setCustomParams}
                style={styles.input}
                placeholder='{"id": "123", "name": "test"}'
                multiline
                numberOfLines={3}
              />
            </View>

            <QRCodeDisplay
              path={customPath}
              params={parseCustomParams()}
              title="自定义页面"
              description="扫码访问自定义页面"
              showDownloadButton={true}
              showShareButton={true}
            />
          </Card.Content>
        </Card>

        {/* 功能说明 */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>功能说明</Text>

            <View style={styles.featureList}>
              <Text style={styles.featureItem}>
                📱{" "}
                <Text style={styles.featureText}>
                  App扫码：直接进入对应功能页面
                </Text>
              </Text>
              <Text style={styles.featureItem}>
                🌐{" "}
                <Text style={styles.featureText}>
                  浏览器扫码：下载App或打开Web页面
                </Text>
              </Text>
              <Text style={styles.featureItem}>
                💾{" "}
                <Text style={styles.featureText}>
                  下载二维码：保存到本地相册
                </Text>
              </Text>
              <Text style={styles.featureItem}>
                📤{" "}
                <Text style={styles.featureText}>
                  分享二维码：通过系统分享功能
                </Text>
              </Text>
              <Text style={styles.featureItem}>
                🔄{" "}
                <Text style={styles.featureText}>重新生成：更新二维码内容</Text>
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* 使用示例 */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>使用示例</Text>

            <View style={styles.exampleContainer}>
              <Text style={styles.exampleTitle}>1. 基础用法：</Text>
              <Text style={styles.exampleCode}>
                {`<QRCodeDisplay
                    path="/login"
                    title="登录页面"
                    description="扫码进入登录页面"
                  />`}
              </Text>

              <Text style={styles.exampleTitle}>2. 带参数：</Text>
              <Text style={styles.exampleCode}>
                {`<QRCodeDisplay
                  path="/user/profile"
                  params={{ id: "123", tab: "info" }}
                  title="用户资料"
                  description="扫码查看用户资料"
                />`}
              </Text>

              <Text style={styles.exampleTitle}>3. 自定义配置：</Text>
              <Text style={styles.exampleCode}>
                {`<QRCodeDisplay
                   path="/product/123"
                   options={{
                     size: 300,
                     color: '#000000',
                     backgroundColor: '#ffffff',
                     logo: {
                       uri: 'https://example.com/logo.png',
                       width: 50,
                       height: 50
                     }
                   }}
                   title="商品详情"
                   description="扫码查看商品详情"
                 />`}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  featureList: {
    marginTop: 8,
  },
  featureItem: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  featureText: {
    color: "#333",
  },
  exampleContainer: {
    marginTop: 8,
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
  },
  exampleCode: {
    fontSize: 12,
    fontFamily: "monospace",
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
});
