// import { AuthGuard } from "@/components/AuthGuard";
import { Slot } from "expo-router";

export default () => {
  return (
    <Slot />
    // <AuthGuard requireAuth={true}>
    // </AuthGuard>
  );
};
