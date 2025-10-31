import { ThemedText, ThemedView } from "@/components/ui";
import globalStyles from "@/styles/globalStyles";

export default () => {
  return (
    <ThemedView style={globalStyles.globalContainer}>
      <ThemedText>留资详情</ThemedText>
    </ThemedView>
  );
};
