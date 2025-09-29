import ToastContainer from "@/components/ToastContainer";
import { customLightTheme } from "@/constants/theme";
import { persistor, store } from "@/store";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export const unstable_settings = {
  anchor: "(home)",
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={customLightTheme}>
          <ThemeProvider value={DefaultTheme}>
            <SafeAreaView style={styles.container}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(home)" />
                <Stack.Screen name="(demo)" />
                <Stack.Screen name="(auth)" />
              </Stack>
              <StatusBar style="auto" />
              <ToastContainer />
            </SafeAreaView>
          </ThemeProvider>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}
// 添加样式定义
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
});
