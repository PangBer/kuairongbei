import { ThemedText, ThemedView } from "@/components/ui";
import { customColors } from "@/constants/theme";
import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

export interface SortOption {
  label: string;
  value: string;
}

export interface SortModalProps {
  visible: boolean;
  options: SortOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  title?: string;
  closeText?: string;
}

export default function SortModal({
  visible,
  options,
  selectedValue,
  onSelect,
  onClose,
  title = "选择排序方式",
  closeText = "关闭",
}: SortModalProps) {
  const handleSelect = (value: string) => {
    onSelect(value);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalOverlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        <ThemedView style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>{title}</ThemedText>
            <TouchableOpacity onPress={onClose}>
              <ThemedText style={styles.modalCloseText}>{closeText}</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.modalOptions}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.modalOptionItem}
                onPress={() => handleSelect(option.value)}
                activeOpacity={1}
              >
                <ThemedText
                  style={[
                    styles.modalOptionText,
                    selectedValue === option.value &&
                      styles.modalOptionTextActive,
                  ]}
                >
                  {option.label}
                </ThemedText>
                {selectedValue === option.value && (
                  <ThemedText style={styles.modalCheckmark}>✓</ThemedText>
                )}
              </TouchableOpacity>
            ))}
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalCloseText: {
    fontSize: 16,
    color: customColors.primary,
  },
  modalOptions: {
    paddingVertical: 8,
  },
  modalOptionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
  },
  modalOptionText: {
    fontSize: 16,
  },
  modalOptionTextActive: {
    color: customColors.primary,
    fontWeight: "600",
  },
  modalCheckmark: {
    fontSize: 18,
    color: customColors.primary,
    fontWeight: "bold",
  },
});
