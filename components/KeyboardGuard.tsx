import globalStyles from "@/components/styles/globalStyles";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DismissKeyboardWrapper = ({
  children,
  touchableComponent,
}: {
  children?: React.ReactNode;
  touchableComponent?: React.ReactNode;
}) => {
  const inset = useSafeAreaInsets();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={globalStyles.globalContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={inset.top}
      enabled={isKeyboardVisible}
    >
      {Platform.OS === "web" ? (
        <>
          {touchableComponent}
          {children}
        </>
      ) : (
        <>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            style={globalStyles.globalContainer}
          >
            {touchableComponent}
          </TouchableWithoutFeedback>
          {children}
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default DismissKeyboardWrapper;
