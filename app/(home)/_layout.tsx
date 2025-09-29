import { AuthGuard } from "@/components/AuthGuard";
import { Stack } from "expo-router";

export default () => {
  return (
    <AuthGuard requireAuth={false}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login/index" />
        <Stack.Screen name="doc/index" />
      </Stack>
    </AuthGuard>
  );
};
