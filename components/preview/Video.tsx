import { customColors } from "@/constants/theme";
import { AntDesign } from "@expo/vector-icons";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function VideoScreen({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  return (
    <>
      <VideoView style={styles.video} player={player} nativeControls={false} />
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
          }}
        >
          <AntDesign
            name={isPlaying ? "pause-circle" : "play-circle"}
            size={40}
            color={customColors.primary}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  video: {
    width: 410,
    height: 325,
  },
  controlsContainer: {
    padding: 10,
  },
});
