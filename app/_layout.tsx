import ToastContainer from "@/components/ToastContainer";
import { customDarkTheme, customLightTheme } from "@/constants/theme";
import { persistor, store } from "@/store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, useColorScheme } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
export const unstable_settings = {
  anchor: "(home)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const paperTheme = isDark ? customDarkTheme : customLightTheme;
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
