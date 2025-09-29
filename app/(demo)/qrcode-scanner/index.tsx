import QRCodeScanner from "@/components/QRCodeScanner";
import { parseQRCodeData } from "@/utils/qrcode";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card } from "react-native-paper";

export default function QRCodeScannerDemoScreen() {
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState<string>("");
  const [parsedResult, setParsedResult] = useState<any>(null);

  // 处理扫描成功
  const handleScanSuccess = (data: string) => {
    setScanResult(data);
    const parsed = parseQRCodeData(data);
    setParsedResult(parsed);
    setShowScanner(false);
  };

  // 处理扫描错误
  const handleScanError = (error: string) => {
    console.error("扫描错误:", error);
    setShowScanner(false);
  };

  // 关闭扫描器
  const handleCloseScanner = () => {
    setShowScanner(false);
  };

  // 重新扫描
  const handleRescan = () => {
    setScanResult("");
    setParsedResult(null);
    setShowScanner(true);
  };

  // 清除结果
  const handleClearResult = () => {
    setScanResult("");
    setParsedResult(null);
  };

  if (showScanner) {
    return (
      <QRCodeScanner
        onScanSuccess={handleScanSuccess}
        onScanError={handleScanError}
        onClose={handleCloseScanner}
        title="扫描二维码"
        description="将二维码放入扫描框内进行扫描"
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>二维码扫描演示</Text>

        <Text style={styles.subtitle}>
          扫描二维码并解析内容，支持App和Web端跳转
        </Text>

        {/* 扫描按钮 */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>开始扫描</Text>
            <Text style={styles.cardDescription}>
              点击按钮开始扫描二维码，支持多种格式的二维码
            </Text>

            <Button
              mode="contained"
              onPress={() => setShowScanner(true)}
              style={styles.scanButton}
              icon="camera"
            >
              开始扫描
            </Button>
          </Card.Content>
        </Card>

        {/* 扫描结果 */}
        {scanResult && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>扫描结果</Text>
              <Text style={styles.cardDescription}>
                二维码扫描成功，以下是解析结果
              </Text>

              <View style={styles.resultContainer}>
                <Text style={styles.resultLabel}>原始数据：</Text>
                <Text style={styles.resultData}>{scanResult}</Text>

                {parsedResult && (
                  <>
                    <Text style={styles.resultLabel}>解析类型：</Text>
                    <Text style={styles.resultData}>{parsedResult.type}</Text>

                    <Text style={styles.resultLabel}>页面路径：</Text>
                    <Text style={styles.resultData}>
                      {parsedResult.path || "无"}
                    </Text>

                    <Text style={styles.resultLabel}>查询参数：</Text>
                    <Text style={styles.resultData}>
                      {Object.keys(parsedResult.params).length > 0
                        ? JSON.stringify(parsedResult.params, null, 2)
                        : "无"}
                    </Text>

                    <Text style={styles.resultLabel}>原始URL：</Text>
                    <Text style={styles.resultData}>
                      {parsedResult.originalUrl}
                    </Text>
                  </>
                )}
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={handleRescan}
                  style={styles.button}
                  icon="camera"
                >
                  重新扫描
                </Button>
                <Button
                  mode="text"
                  onPress={handleClearResult}
                  style={styles.button}
                  icon="close"
                >
                  清除结果
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* 功能说明 */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>功能说明</Text>

            <View style={styles.featureList}>
              <Text style={styles.featureItem}>
                📱{" "}
                <Text style={styles.featureText}>
                  App端扫码：直接跳转到对应功能页面
                </Text>
              </Text>
              <Text style={styles.featureItem}>
                🌐{" "}
                <Text style={styles.featureText}>
                  Web端扫码：在浏览器中打开对应页面
                </Text>
              </Text>
              <Text style={styles.featureItem}>
                🔍{" "}
                <Text style={styles.featureText}>
                  智能解析：自动识别二维码类型和内容
                </Text>
              </Text>
              <Text style={styles.featureItem}>
                📋{" "}
                <Text style={styles.featureText}>
                  参数传递：支持查询参数的解析和传递
                </Text>
              </Text>
              <Text style={styles.featureItem}>
                🔄{" "}
                <Text style={styles.featureText}>
                  重新扫描：支持多次扫描和结果清除
                </Text>
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* 支持的二维码格式 */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>支持的二维码格式</Text>

            <View style={styles.formatList}>
              <Text style={styles.formatItem}>
                <Text style={styles.formatType}>Web链接：</Text>
                <Text style={styles.formatExample}>
                  https://192.168.1.4:8081/user/profile?id=123
                </Text>
              </Text>
              <Text style={styles.formatItem}>
                <Text style={styles.formatType}>相对路径：</Text>
                <Text style={styles.formatExample}>/user/profile?id=123</Text>
              </Text>
              <Text style={styles.formatItem}>
                <Text style={styles.formatType}>通用链接：</Text>
                <Text style={styles.formatExample}>
                  https://kuairongbei.com/user/profile?id=123
                </Text>
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* 使用示例 */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>使用示例</Text>

            <View style={styles.exampleContainer}>
              <Text style={styles.exampleTitle}>1. 基础扫描：</Text>
              <Text style={styles.exampleCode}>
                {`<QRCodeScanner
  onScanSuccess={(data) => {
    console.log('扫描成功:', data);
  }}
  onScanError={(error) => {
    console.error('扫描失败:', error);
  }}
/>`}
              </Text>

              <Text style={styles.exampleTitle}>2. 自定义配置：</Text>
              <Text style={styles.exampleCode}>
                {`<QRCodeScanner
  title="扫描二维码"
  description="将二维码放入扫描框内"
  onScanSuccess={handleScanSuccess}
  onScanError={handleScanError}
  onClose={handleClose}
/>`}
              </Text>

              <Text style={styles.exampleTitle}>3. 解析二维码数据：</Text>
              <Text style={styles.exampleCode}>
                {`import { parseQRCodeData } from '@/utils/qrcode';

const parsed = parseQRCodeData(qrCodeData);
console.log('类型:', parsed.type);
console.log('路径:', parsed.path);
console.log('参数:', parsed.params);`}
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
  scanButton: {
    marginTop: 8,
  },
  resultContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
  },
  resultData: {
    fontSize: 12,
    color: "#333",
    fontFamily: "monospace",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 16,
  },
  button: {
    margin: 4,
    minWidth: 120,
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
  formatList: {
    marginTop: 8,
  },
  formatItem: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 18,
  },
  formatType: {
    fontWeight: "bold",
    color: "#333",
  },
  formatExample: {
    color: "#666",
    fontFamily: "monospace",
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
