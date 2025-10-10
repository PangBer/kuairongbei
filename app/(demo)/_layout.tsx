import { AuthGuard } from "@/components/AuthGuard";
import { Stack } from "expo-router";

export default () => {
  return (
    <AuthGuard requireAuth={false}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="demo" />
        <Stack.Screen name="qrcode/index" />
        <Stack.Screen name="qrcode-scanner/index" />
        <Stack.Screen name="contact-service/index" />
        <Stack.Screen name="select-demo/index" />
      </Stack>
    </AuthGuard>
  );
};
