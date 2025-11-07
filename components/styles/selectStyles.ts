import { customColors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const selectStyles = StyleSheet.create({
  // 底部 Modal 样式
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
    position: "relative",
  },
  modalHeaderLeft: {
    flex: 1,
    alignItems: "flex-start",
    zIndex: 1,
  },
  modalHeaderRight: {
    flex: 1,
    alignItems: "flex-end",
    zIndex: 1,
  },
  modalTitleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 0,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  modalClearText: {
    fontSize: 16,
    color: customColors.error,
  },
  modalCloseText: {
    fontSize: 16,
    color: customColors.primary,
  },
  modalOptions: {
    paddingVertical: 8,
    maxHeight: 400,
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
    flex: 1,
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
  // 保留旧样式以兼容（如果需要）
  optionsList: {
    maxHeight: 500,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedOptionText: {
    color: "#4a9aff",
    fontWeight: "600",
  },
  checkmark: {
    fontSize: 16,
    color: "#4a9aff",
    fontWeight: "bold",
  },
  // MultiLevelSelect 专用样式
  breadcrumbContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
  },

  breadcrumbText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  breadcrumbSeparator: {
    marginHorizontal: 4,
    color: "#666",
    fontSize: 12,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionButton: {
    minWidth: 80,
  },
});
