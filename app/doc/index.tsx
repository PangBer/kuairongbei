import PageHeader from "@/components/PageHeader";
import Pdf from "@/components/pdf";
import { NameValue } from "@/components/pdf/types";
import { ThemedText, ThemedView } from "@/components/ui";
import { customColors } from "@/constants/theme";
import { EventEmitter } from "expo-modules-core";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { Button } from "react-native-paper";
type MyEvents = {
  onBackData: (payload: { check: string; time: string; name: string }) => void;
};

export const myEmitter = new EventEmitter<MyEvents>();

export default () => {
  const { name, url, check } = useLocalSearchParams();
  const [checkCountdown, setCheckCountdown] = useState(0);
  const [pageDown, setPageDown] = useState(false);
  useEffect(() => {
    if (check) {
      startCountdown();
    }
  }, [check]);
  // 开始倒计时
  const startCountdown = () => {
    setCheckCountdown(15);
    const timer = setInterval(() => {
      setCheckCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  const handleAgree = () => {
    myEmitter.emit("onBackData", {
      check: "ok",
      name: name as string,
      time: Date.now().toString(),
    });
    router.back();
  };
  return (
    <>
      <PageHeader title={NameValue[name as string] || (name as string)} />
      <Pdf
        url={url as string}
        name={name as string}
        onPageChange={setPageDown}
      />
      {check ? (
        <ThemedView style={{ padding: 10 }}>
          <ThemedText style={{ fontSize: 12, textAlign: "center" }}>
            请阅读本协议
            {checkCountdown !== 0 ? (
              <Text
                style={{
                  color: customColors.primary,
                  fontSize: 12,
                }}
              >
                {checkCountdown}秒
              </Text>
            ) : (
              <></>
            )}
            后同意并签署《{NameValue[name as string]}》
          </ThemedText>
          <Button
            mode="outlined"
            disabled={checkCountdown !== 0 || !pageDown}
            onPress={handleAgree}
          >
            同意并签署《{NameValue[name as string]}》
          </Button>
        </ThemedView>
      ) : (
        <></>
      )}
    </>
  );
};
