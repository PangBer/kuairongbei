import { AuthGuard } from "@/components/AuthGuard";
import { Stack } from "expo-router";

export default () => {
  return (
    <AuthGuard requireAuth={true}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="gather/index" />
        <Stack.Screen name="invite/index" />
      </Stack>
    </AuthGuard>
  );
};
