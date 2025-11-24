import { customColors } from "@/constants/theme";
import { ReactNode } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import { ThemedText, ThemedView } from "./ui";

export interface ToastModalProps {
  visible: boolean;
  onConfirm?: () => void;
  children: ReactNode;
  title?: string;
  confirmText?: string;
  cancleText?: string;
  onCancel: () => void;
  loading?: boolean;
}

export default function ToastModal({
  visible,
  onConfirm,
  children,
  title,
  confirmText = "知道了",
  cancleText,
  onCancel,
  loading = false,
}: ToastModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalOverlayTouchable}
          activeOpacity={1}
          onPress={onCancel}
        />
        <ThemedView style={styles.modalContent}>
          {title && <ThemedText style={styles.modalTitle}>{title}</ThemedText>}
          <View style={styles.modalBody}>{children}</View>

          <View style={styles.buttonGroup}>
            <Button
              mode="contained"
              onPress={onConfirm}
              loading={loading}
              disabled={loading}
            >
              {confirmText}
            </Button>
            {cancleText && (
              <Button
                mode="contained"
                buttonColor={customColors.onErrorContainer}
                onPress={onCancel}
                loading={loading}
                disabled={loading}
              >
                {cancleText}
              </Button>
            )}
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalOverlayTouchable: {
    flex: 1,
  },
  modalContent: {
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  modalBody: {
    marginBottom: 24,
    alignItems: "center",
  },
  confirmButton: {
    borderColor: customColors.primary,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  buttonGroup: {
    flexDirection: "column",
    width: "100%",
    gap: 16,
  },
  cancleButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancleButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export const ToastModalChildrenStyle = StyleSheet.create({
  modalIconContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  modalContent: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
  },
});
