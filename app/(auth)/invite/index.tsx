import globalStyles from "@/components/styles/globalStyles";
import { ThemedText, ThemedView } from "@/components/ui";

export default () => {
  return (
    <ThemedView style={globalStyles.globalContainer}>
      <ThemedText>邀请</ThemedText>
    </ThemedView>
  );
};
