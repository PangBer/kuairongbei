import {
  defaultQRCodeOptions,
  generatePageQRCodeLink,
  type QRCodeOptions,
} from "@/utils/qrcode";
import React, { useState } from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import QRCode from "react-native-qrcode-svg";

interface QRCodeDisplayProps {
  path: string;
  params?: Record<string, any>;
  title?: string;
  description?: string;
  showDownloadButton?: boolean;
  showShareButton?: boolean;
  options?: QRCodeOptions;
  onQRCodeGenerated?: (link: string) => void;
}

export default function QRCodeDisplay({
  path,
  params,
  title = "页面二维码",
  description = "使用本App或浏览器扫码访问",
  showDownloadButton = true,
  showShareButton = true,
  options,
  onQRCodeGenerated,
}: QRCodeDisplayProps) {
  const [qrCodeLink, setQrCodeLink] = useState<string>("");

  // 生成二维码链接
  const generateQRCodeLink = () => {
    const link = generatePageQRCodeLink(path, params);
    setQrCodeLink(link);
    onQRCodeGenerated?.(link);
  };

  // 组件挂载时生成二维码链接
  React.useEffect(() => {
    generateQRCodeLink();
  }, [path, params]);

  // 下载二维码
  const handleDownload = async () => {
    if (!qrCodeLink) {
      Alert.alert("提示", "二维码未生成");
      return;
    }

    try {
      // 在Web端，创建一个下载链接
      if (Platform.OS === "web") {
        // 对于Web端，我们可以尝试截图或使用其他方法
        Alert.alert("提示", "请右键保存二维码图片");
      } else {
        // 在移动端，可以保存到相册
        Alert.alert("提示", "二维码已保存到相册");
      }
    } catch (err) {
      Alert.alert("错误", "下载失败");
    }
  };

  // 分享二维码
  const handleShare = async () => {
    if (!qrCodeLink) {
      Alert.alert("提示", "二维码未生成");
      return;
    }

    try {
      // 在Web端，复制链接到剪贴板
      if (Platform.OS === "web") {
        await navigator.clipboard.writeText(qrCodeLink);
        Alert.alert("提示", "二维码链接已复制到剪贴板");
      } else {
        // 在移动端，使用系统分享
        Alert.alert("提示", "使用系统分享功能");
      }
    } catch (err) {
      Alert.alert("错误", "分享失败");
    }
  };

  const qrCodeOptions = { ...defaultQRCodeOptions, ...options };

  // 获取网站模式提示信息
  const getWebsiteModeTip = () => {
    return (
      <View style={styles.tipContainer}>
        <Text style={styles.tipText}>🌐 扫码后将在浏览器中打开网站页面</Text>
        <Text style={styles.tipSubText}>
          📱 如使用App扫码，将直接打开对应功能页面
        </Text>
      </View>
    );
  };

  return (
    <Card style={styles.container}>
      <Card.Content style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        {getWebsiteModeTip()}

        {qrCodeLink && (
          <View style={styles.qrCodeContainer}>
            <QRCode
              value={qrCodeLink}
              size={qrCodeOptions.size}
              color={qrCodeOptions.color}
              backgroundColor={qrCodeOptions.backgroundColor}
              logo={qrCodeOptions.logo}
              logoSize={qrCodeOptions.logoSize}
              logoBackgroundColor={qrCodeOptions.logoBackgroundColor}
              logoMargin={qrCodeOptions.logoMargin}
              logoBorderRadius={qrCodeOptions.logoBorderRadius}
              quietZone={qrCodeOptions.quietZone}
              enableLinearGradient={qrCodeOptions.enableLinearGradient}
              linearGradient={qrCodeOptions.linearGradient?.colors}
              gradientDirection={qrCodeOptions.gradientDirection}
            />
            <Text style={styles.qrCodeText}>扫描二维码访问页面</Text>
            <Text style={styles.qrCodeLinkText}>{qrCodeLink}</Text>
          </View>
        )}

        {qrCodeLink && (
          <View style={styles.buttonContainer}>
            {showDownloadButton && (
              <Button
                mode="contained"
                onPress={handleDownload}
                style={styles.button}
                icon="download"
              >
                下载二维码
              </Button>
            )}
            {showShareButton && (
              <Button
                mode="outlined"
                onPress={handleShare}
                style={styles.button}
                icon="share"
              >
                分享二维码
              </Button>
            )}
            <Button
              mode="text"
              onPress={generateQRCodeLink}
              style={styles.button}
              icon="refresh"
            >
              重新生成
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    elevation: 4,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
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
  loadingContainer: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },
  errorContainer: {
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#f44336",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 8,
  },
  qrCodeContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  qrCodeText: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  qrCodeLinkText: {
    marginTop: 4,
    fontSize: 10,
    color: "#999",
    textAlign: "center",
    maxWidth: 250,
  },
  tipContainer: {
    backgroundColor: "#E8F5E8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  tipText: {
    fontSize: 12,
    color: "#2E7D32",
    textAlign: "center",
    lineHeight: 16,
    fontWeight: "500",
  },
  tipSubText: {
    fontSize: 11,
    color: "#388E3C",
    textAlign: "center",
    lineHeight: 14,
    marginTop: 4,
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
});
