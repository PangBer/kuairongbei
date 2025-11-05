import { StyleSheet } from "react-native";

export const selectStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    maxWidth: 300,
    width: "100%",
    maxHeight: "60%",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
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
  breadcrumbItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    marginRight: 4,
  },
  breadcrumbText: {
    fontSize: 12,
    color: "#4a9aff",
    fontWeight: "500",
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
