import PageHeader from "@/components/PageHeader";
import globalStyles from "@/components/styles/globalStyles";
import { ThemedCard, ThemedView } from "@/components/ui";
import { ThemedText } from "@/components/ui/themedText";
import { customColors } from "@/constants/theme";
import { useToastActions } from "@/store/hooks/toastHooks";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, useTheme } from "react-native-paper";

// 模拟数据 - 实际使用时可能从路由参数获取
const friendName = "李咏宸";

export default function BoostPage() {
  const theme = useTheme();
  const router = useRouter();
  const { showSuccess } = useToastActions();

  // 处理确认助力按钮点击
  const handleConfirmBoost = () => {
    // 显示成功提示
    // Toast.show('助力成功！');
    showSuccess("助力成功！");
    // 模拟网络请求延迟
    setTimeout(() => {
      // 跳转到结果页面或首页
      // 这里假设存在一个结果页面，如果不存在可以导航到首页
      try {
      } catch (error) {
        // 如果结果页面不存在，导航到首页
        router.push("/(home)");
      }
    }, 1500);
  };

  return (
    <>
      <PageHeader title="好友助力" />

      <ScrollView
        style={globalStyles.globalContainer}
        contentContainerStyle={globalStyles.globalPaddingBottom}
      >
        {/* 介绍区域 */}
        <ThemedCard>
          <View style={{ alignItems: "center" }}>
            <View style={styles.iconContainer}>
              <AntDesign name="rocket" size={28} color={customColors.primary} />
            </View>
          </View>

          <ThemedText type="subtitle" style={styles.title}>
            帮助你的好友提升额度！
          </ThemedText>

          <ThemedText style={styles.description}>
            你的好友{" "}
            <Text style={{ color: customColors.primary }}>{friendName}</Text>{" "}
            正在申请贷款，需要你的帮助来提升他的额度。
          </ThemedText>
        </ThemedCard>
      </ScrollView>
      {/* 确认按钮 */}
      <ThemedView style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleConfirmBoost}
          style={styles.confirmButton}
          labelStyle={styles.confirmButtonLabel}
        >
          确认助力
        </Button>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(74, 154, 255, 0.1)",
  },
  helpIcon: {
    width: 40,
    height: 40,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    padding: 10,
  },
  confirmButton: {
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});
