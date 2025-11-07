import { ThemedText } from "@/components/ui";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export interface ExpandItemProps {
  title: string;
  content: string;
  defaultExpanded?: boolean;
}

export default function ExpandItem({
  title,
  content,
  defaultExpanded = false,
}: ExpandItemProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const height = useSharedValue(defaultExpanded ? 500 : 0);
  const opacity = useSharedValue(defaultExpanded ? 1 : 0);
  const rotation = useSharedValue(defaultExpanded ? 180 : 0);

  useEffect(() => {
    if (isExpanded) {
      height.value = withTiming(500, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
      rotation.value = withTiming(180, { duration: 300 });
    } else {
      height.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
      rotation.value = withTiming(0, { duration: 300 });
    }
  }, [isExpanded, height, opacity, rotation]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const animatedContentStyle = useAnimatedStyle(() => ({
    maxHeight: height.value,
    opacity: opacity.value,
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View
      style={[
        styles.expandItem,
        {
          borderBottomColor: isDark ? "#333" : "#e0e0e0",
        },
      ]}
    >
      <TouchableOpacity
        style={styles.expandQuestion}
        onPress={handleToggle}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.expandQuestionText}>{title}</ThemedText>
        <Animated.View style={animatedIconStyle}>
          <AntDesign
            name="down"
            size={16}
            color={isDark ? "#cccccc" : "#666666"}
          />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View
        style={[styles.expandAnswerContainer, animatedContentStyle]}
      >
        <View style={styles.expandAnswer}>
          <ThemedText style={styles.expandAnswerText}>{content}</ThemedText>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  expandItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  expandQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expandQuestionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    marginRight: 12,
  },
  expandAnswerContainer: {
    overflow: "hidden",
  },
  expandAnswer: {
    marginTop: 12,
    paddingLeft: 0,
  },
  expandAnswerText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
