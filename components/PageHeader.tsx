import { router } from "expo-router";
import { Appbar } from "react-native-paper";

export default ({
  children,
  title,
}: {
  children?: React.ReactNode;
  title: string;
  onRightPress?: () => void;
}) => {
  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={() => router.back()} />
      <Appbar.Content title={title} />
      {children}
    </Appbar.Header>
  );
};
