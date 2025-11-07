import { AuthGuard } from "@/components/AuthGuard";
import { Slot } from "expo-router";

export default () => {
  return (
    <AuthGuard requireAuth={true}>
      <Slot />
    </AuthGuard>
  );
};
