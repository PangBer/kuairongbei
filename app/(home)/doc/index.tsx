import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { WebView } from "react-native-webview";
interface DocumentItem {
  id?: string;
  name: string;
  type: "docx" | "pdf" | "xlsx" | "pptx";
  url: string;
  size?: string;
  uploadDate?: string;
  description?: string;
}
export default function DocViewerScreen() {
  const { url, type, showAgreement, title } = useLocalSearchParams<{
    url?: string;
    type?: "docx" | "pdf" | "xlsx" | "pptx";
    showAgreement?: string;
    title?: string;
  }>();

  // 默认文档
  const documentUrl = url || "https://ryr123.com/app_resources/sqxy.docx";
  const documentType = type || "docx";
  const isAgreementMode = showAgreement === "true";
  const [isLoading, setIsLoading] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const webViewRef = useRef<WebView>(null);
  const getViewerUrl = (document: DocumentItem): string => {
    const encodedUrl = encodeURIComponent(document.url);

    switch (document.type) {
      case "pdf":
      case "docx":
      case "xlsx":
      case "pptx":
        // PPTX 使用 Microsoft Office Online Viewer
        return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
      default:
        return document.url;
    }
  };
  // 获取查看器 URL
  const getViewerUrlForDocument = () => {
    const document = {
      name: title || "文档",
      url: documentUrl,
      type: documentType,
    };

    return getViewerUrl(document);
  };

  // Web 端适配：如果是 web 端且是协议模式，显示不同的布局
  const isWeb = Platform.OS === "web";

  return (
    <View style={[styles.screenContainer, isWeb && styles.webScreenContainer]}>
      {/* 协议模式下的头部 */}
      {isAgreementMode && (
        <View style={styles.agreementHeader}>
          <Text style={styles.agreementTitle}>{title || "用户协议"}</Text>
          <Text style={styles.agreementSubtitle}>请仔细阅读以下协议内容</Text>
        </View>
      )}

      <View
        style={[styles.viewerContainer, isWeb && styles.webViewerContainer]}
      >
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4a9aff" />
            <Text style={styles.loadingText}>加载文档中...</Text>
          </View>
        )}

        {/* Web 端适配：使用 iframe 或 WebView */}
        {isWeb ? (
          <View style={styles.webContainer}>
            <iframe
              src={getViewerUrlForDocument()}
              style={{
                width: "100%",
                height: "100%",
                maxWidth: "100%",
                border: "none",
              }}
              title="文档查看器"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                console.error("iframe 加载错误");
                setIsLoading(false);
              }}
            />
          </View>
        ) : (
          <WebView
            ref={webViewRef}
            source={{ uri: getViewerUrlForDocument() }}
            style={styles.webView}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onError={(error) => {
              console.error("WebView 错误:", error);
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
          />
        )}
      </View>

      {/* 协议模式下的底部按钮 */}

      <View style={styles.agreementFooter}>
        {isAgreementMode && (
          <Button
            mode="contained"
            onPress={() => router.back()}
            disabled={hasAgreed}
            style={styles.agreeButton}
            contentStyle={styles.agreeButtonContent}
          >
            {hasAgreed ? "已同意" : "我同意该协议"}
          </Button>
        )}
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.cancelButton}
        >
          返回
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  webScreenContainer: {
    maxWidth: "100%",
    overflow: "hidden",
    width: "100%",
  },
  viewerContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  webViewerContainer: {
    maxWidth: "100%",
    overflow: "hidden",
    width: "100%",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  webView: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    overflow: "hidden",
    maxWidth: "100%",
    width: "100%",
    position: "relative",
  },
  agreementHeader: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  agreementTitle: {
    textAlign: "center",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  agreementSubtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
  },
  agreementFooter: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  agreeButton: {
    flex: 1,
    marginRight: 12,
    borderRadius: 8,
  },
  agreeButtonContent: {
    paddingVertical: 8,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 8,
  },
});
