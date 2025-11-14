import { useMemo } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { Portal } from "react-native-paper";
import VideoScreen from "./Video";

export default ({
  visible,
  onClose,
  uri,
}: {
  visible: boolean;
  onClose: () => void;
  uri: string;
}) => {
  const isVideo = useMemo(() => {
    const videoFormats = ["mp4", "mov", "avi", "wmv", "flv", "mkv", "webm"];
    if (uri) {
      const lowerUri = uri.toLowerCase();
      return videoFormats.some(format => lowerUri.endsWith(format));
    }
    return false;
  }, [uri]);
  return (
    <Portal>
      {visible && (
        <TouchableOpacity style={styles.previewContainer} onPress={onClose}>
          {isVideo ? (
            <VideoScreen uri={uri || ""} />
          ) : (
            <Image
              source={{
                uri: uri || "",
              }}
              resizeMode="contain"
              style={styles.previewImage}
            />
          )}
        </TouchableOpacity>
      )}
    </Portal>
  );
};

const styles = StyleSheet.create({
  previewImage: {
    width: "100%",
    height: "100%",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
  },
});
