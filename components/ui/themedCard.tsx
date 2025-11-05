import { StyleSheet, useColorScheme, ViewStyle } from "react-native";
import { Card } from "react-native-paper";

export function ThemedCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}) {
  const colorScheme = useColorScheme();
  return (
    <Card
      theme={{
        dark: colorScheme === "dark",
      }}
      style={[styles.card, style]}
    >
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
