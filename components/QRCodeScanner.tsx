import { handleQRCodeScan, parseQRCodeData } from "@/utils/qrcode";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";

interface QRCodeScannerProps {
  onScanSuccess?: (data: string) => void;
  onScanError?: (error: string) => void;
  onClose?: () => void;
  title?: string;
  description?: string;
}

export default function QRCodeScanner({
  onScanSuccess,
  onScanError,
  onClose,
  title = "扫描二维码",
  description = "将二维码放入扫描框内",
}: QRCodeScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [scannedData, setScannedData] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  // 请求相机权限
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // 处理扫描结果
  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (isProcessing) return;

    setIsProcessing(true);
    setScannedData(data);
    setIsScanning(false);

    try {
      // 解析二维码数据
      const parsed = parseQRCodeData(data);

      if (parsed.type === "unknown") {
        Alert.alert("扫描失败", "无法识别的二维码格式");
        onScanError?.("无法识别的二维码格式");
        return;
      }

      // 处理扫描结果
      handleQRCodeScan(
        data,
        (path: string, params?: Record<string, any>) => {
          // 导航到对应页面
          if (params && Object.keys(params).length > 0) {
            router.push({
              pathname: path as any,
              params: params,
            });
          } else {
            router.push(path as any);
          }
          onScanSuccess?.(data);
        },
        (error: string) => {
          Alert.alert("扫描失败", error);
          onScanError?.(error);
        }
      );
    } catch (error) {
      console.error("处理扫描结果失败:", error);
      Alert.alert("扫描失败", "处理二维码数据时发生错误");
      onScanError?.("处理二维码数据时发生错误");
    } finally {
      setIsProcessing(false);
    }
  };

  // 重新开始扫描
  const handleRestartScan = () => {
    setIsScanning(true);
    setScannedData("");
    setIsProcessing(false);
  };

  // 关闭扫描器
  const handleClose = () => {
    setIsScanning(false);
    onClose?.();
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content style={styles.content}>
            <Text style={styles.title}>请求相机权限</Text>
            <Text style={styles.description}>正在请求相机权限...</Text>
            <ActivityIndicator size="large" style={styles.loading} />
          </Card.Content>
        </Card>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content style={styles.content}>
            <Text style={styles.title}>需要相机权限</Text>
            <Text style={styles.description}>扫描二维码需要访问相机权限</Text>
            <Button
              mode="contained"
              onPress={requestPermission}
              style={styles.button}
            >
              授权相机权限
            </Button>
            {onClose && (
              <Button
                mode="outlined"
                onPress={handleClose}
                style={styles.button}
              >
                取消
              </Button>
            )}
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          {isScanning ? (
            <View style={styles.cameraContainer}>
              <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
                barcodeScannerSettings={{
                  barcodeTypes: ["qr", "pdf417"],
                }}
              />
              <View style={styles.scanOverlay}>
                <View style={styles.scanFrame} />
                <Text style={styles.scanText}>将二维码放入框内</Text>
              </View>
            </View>
          ) : (
            <View style={styles.resultContainer}>
              {isProcessing ? (
                <View style={styles.processingContainer}>
                  <ActivityIndicator size="large" />
                  <Text style={styles.processingText}>正在处理...</Text>
                </View>
              ) : (
                <View style={styles.scannedContainer}>
                  <Text style={styles.scannedTitle}>扫描成功！</Text>
                  <Text style={styles.scannedData}>{scannedData}</Text>
                  <View style={styles.buttonContainer}>
                    <Button
                      mode="contained"
                      onPress={handleRestartScan}
                      style={styles.button}
                    >
                      重新扫描
                    </Button>
                    {onClose && (
                      <Button
                        mode="outlined"
                        onPress={handleClose}
                        style={styles.button}
                      >
                        关闭
                      </Button>
                    )}
                  </View>
                </View>
              )}
            </View>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
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
  loading: {
    marginTop: 16,
  },
  button: {
    marginTop: 12,
    minWidth: 120,
  },
  cameraContainer: {
    width: "100%",
    height: 300,
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  scanOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: "#4CAF50",
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  scanText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 16,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  resultContainer: {
    width: "100%",
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  processingContainer: {
    alignItems: "center",
  },
  processingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  scannedContainer: {
    alignItems: "center",
    width: "100%",
  },
  scannedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 12,
  },
  scannedData: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    borderRadius: 4,
    maxWidth: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
