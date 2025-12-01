import ToastContainer from "@/components/ToastContainer";
import { customDarkTheme, customLightTheme } from "@/constants/theme";
import wsService from "@/service/WebSocketService";
import { persistor, store } from "@/store";
import { useAuth } from "@/store/hooks";
import { setCurrentPath } from "@/utils";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Linking from "expo-linking";
import { router, Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import {
  AppState,
  AppStateStatus,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export const unstable_settings = {
  anchor: "(home)",
};

const WsLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      wsService.connect();
    }
  }, [isAuthenticated]);
  return children;
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const paperTheme = isDark ? customDarkTheme : customLightTheme;
  const pathname = usePathname();
  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  useEffect(() => {
    //  启动App
    console.log("App 启动");

    // 后台唤醒 deep link
    const subscription = Linking.addEventListener("url", handleUrl);
    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
      appStateSubscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextState: AppStateStatus) => {
    if (nextState === "active") {
      // 从后台进入前台，处理 deep link
      console.log("App 进入前台");
    }

    // 进入后台
    if (nextState === "background") {
      console.log("App 进入后台");
    }
  };

  const handleUrl = ({ url }: any) => {
    let parsedUrl = url;
    // 开发模式：提取真正目标 URL
    if (__DEV__) {
      try {
        const u = new URL(url);
        if (u.searchParams.has("url")) {
          parsedUrl = decodeURIComponent(u?.searchParams?.get("url") || "");
        }
      } catch {}
    }

    const parsed = Linking.parse(parsedUrl);
    // 跳转 invite 页面
    if (parsed.path === "invite") {
      router.navigate("/invite");
    } else if (parsed.path === "boost") {
      router.navigate("/boost");
    }
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider
          value={
            isDark
              ? {
                  ...DarkTheme,
                  colors: {
                    ...DarkTheme.colors,
                    background: paperTheme.colors.foreground,
                  },
                }
              : {
                  ...DefaultTheme,
                  colors: {
                    ...DefaultTheme.colors,
                    background: paperTheme.colors.foreground,
                  },
                }
          }
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <WsLayout>
              <PaperProvider theme={paperTheme}>
                <StatusBar style={isDark ? "light" : "dark"} />
                <SafeAreaView
                  style={[
                    styles.container,
                    {
                      backgroundColor: paperTheme.colors.foreground,
                    },
                  ]}
                >
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(home)" />
                  </Stack>
                  <ToastContainer />
                </SafeAreaView>
              </PaperProvider>
            </WsLayout>
          </GestureHandlerRootView>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
// 添加样式定义
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});
